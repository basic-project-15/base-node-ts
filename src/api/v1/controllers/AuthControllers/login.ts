import type { Request, Response } from 'express'
import { compare } from 'bcrypt'
import { OAuth2Client } from 'google-auth-library'
import type { DataResponse, IUser } from '@interfaces'
import { jwt } from '@config'
import { GOOGLE_CLIENT_ID, MAX_FAILED_PASSWORDS, UserModel } from '@common'
import { capitalizeFirstLetter, SendEmails } from '@core'

export const loginWithEmailAndPass = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { body, t, lng } = req
  try {
    const user = await getUserLogin(body.email)

    if (user == null) {
      dataResponse.message = t.USER_INVALID_CREDENTIALS
      return res.status(401).send(dataResponse)
    }
    let incorrectPassword: number = user.incorrectPassword
    if (incorrectPassword < MAX_FAILED_PASSWORDS) {
      const checkPassword = await compare(body.password, user.password)
      if (!checkPassword) {
        incorrectPassword++
        if (incorrectPassword <= MAX_FAILED_PASSWORDS) {
          await UserModel.updateOne(
            { _id: user._id },
            { $set: { incorrectPassword } },
          )
        }
        if (incorrectPassword === MAX_FAILED_PASSWORDS) {
          await SendEmails.blockedAccount(lng, {
            name: user?.firstName,
            email: body.email,
          })
          dataResponse.message = t.USER_BLOCKED_DETAILS
          return res.status(401).send(dataResponse)
        }
        dataResponse.message = t.USER_INVALID_CREDENTIALS
        return res.status(401).send(dataResponse)
      }
    } else {
      dataResponse.message = t.USER_BLOCKED_DETAILS
      return res.status(401).send(dataResponse)
    }

    delete user.password
    delete user.incorrectPassword
    const accessToken = jwt.generateAccessToken({
      _id: user._id,
      email: user.email,
      passwordVersion: user.passwordVersion,
    })
    const refreshToken = jwt.generateRefreshToken({ _id: user._id })
    await UserModel.updateOne(
      { _id: user._id },
      { $set: { refreshToken, incorrectPassword: 0 } },
    )
    dataResponse.message = t.USER_AUTHENTICATED
    dataResponse.data = { user, accessToken, refreshToken }
    return res.status(200).send(dataResponse)
  } catch (error) {
    dataResponse.message = t.RES_SERVER_ERROR
    dataResponse.data = {
      name: error.name,
      message: error.message,
    }
    return res.status(500).send(dataResponse)
  }
}

export const loginWithGoogle = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { body, t } = req
  try {
    const client = new OAuth2Client(GOOGLE_CLIENT_ID)
    const ticket = await client.verifyIdToken({
      idToken: body.idToken,
      audience: GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    if (!payload) {
      dataResponse.message = t.USER_INVALID_CREDENTIALS
      return res.status(401).send(dataResponse)
    }

    const email = payload.email ?? ''
    let user = await getUserLogin(email)
    let accessToken = ''
    let refreshToken = ''
    // If the user is not found, it registers it.
    if (user == null) {
      const firstName = payload.given_name ?? ''
      const lastName = payload.family_name ?? ''
      const photo = payload.picture ?? ''
      const newUser: IUser = {
        firstName: capitalizeFirstLetter(firstName),
        lastName: capitalizeFirstLetter(lastName),
        email,
        photo,
        passwordVersion: 0,
        roleIds: [],
        created_at: new Date(),
        state: true,
      }
      const userModel = new UserModel(newUser)
      await userModel.save()
      user = await getUserLogin(email)
    }

    delete user.password
    delete user.incorrectPassword
    accessToken = jwt.generateAccessToken({
      _id: user._id,
      email: user.email,
      passwordVersion: user.passwordVersion,
    })
    refreshToken = jwt.generateRefreshToken({ _id: user._id })
    await UserModel.updateOne(
      { _id: user._id },
      { $set: { refreshToken, incorrectPassword: 0 } },
    )
    dataResponse.message = t.USER_AUTHENTICATED
    dataResponse.data = { userLogin: user, accessToken, refreshToken }
    return res.status(200).send(dataResponse)
  } catch (error) {
    dataResponse.message = t.RES_SERVER_ERROR
    dataResponse.data = {
      name: error.name,
      message: error.message,
    }
    return res.status(500).send(dataResponse)
  }
}

export const loginRefreshTokens = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { body, t } = req
  try {
    const { refreshToken } = body
    if (!refreshToken) {
      dataResponse.message = t.RES_INVALID_TOKEN
      return res.status(400).send(dataResponse)
    }

    const userToken = jwt.verifyRefreshToken(refreshToken)
    const user = await UserModel.findById(userToken._id)
    if (!user || user.refreshToken !== refreshToken) {
      dataResponse.message = t.RES_INVALID_TOKEN
      return res.status(401).send(dataResponse)
    }

    const accessToken = jwt.generateAccessToken({
      _id: user.id,
      email: user.email,
      passwordVersion: user.passwordVersion,
    })
    const newRefreshToken = jwt.generateRefreshToken({ _id: user.id })
    user.refreshToken = newRefreshToken
    await user.save()
    dataResponse.message = t.USER_AUTHENTICATED
    dataResponse.data = { accessToken, refreshToken: newRefreshToken }
    return res.status(200).send(dataResponse)
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      dataResponse.message = t.RES_EXPIRED_TOKEN
      return res.status(401).send(dataResponse)
    }
    if (error.name === 'JsonWebTokenError') {
      dataResponse.message = t.RES_INVALID_TOKEN
      return res.status(401).send(dataResponse)
    }
    dataResponse.message = t.RES_SERVER_ERROR
    dataResponse.data = {
      name: error.name,
      message: error.message,
    }
    return res.status(500).send(dataResponse)
  }
}

const getUserLogin = async (email: string): Promise<any> => {
  const users = await UserModel.aggregate([
    {
      $match: { email, state: true },
    },
    {
      $lookup: {
        from: 'roles',
        localField: 'roleIds',
        foreignField: '_id',
        as: 'rolesDetails',
      },
    },
    {
      $project: {
        id: 1,
        firstName: 1,
        lastName: 1,
        email: 1,
        phoneNumber: 1,
        password: 1,
        passwordVersion: 1,
        incorrectPassword: 1,
        photo: 1,
        roleIds: 1,
        roles: {
          $map: {
            input: '$rolesDetails',
            as: 'role',
            in: {
              type: '$$role.type',
              description: '$$role.description',
              permissions: '$$role.permissions',
            },
          },
        },
      },
    },
  ])
  if (users.length !== 0) {
    const user = users[0]
    return user
  }
  return null
}
