import type { Request, Response } from 'express'
import { compare } from 'bcrypt'
import { OAuth2Client } from 'google-auth-library'
import dotenv from 'dotenv'
import type { DataResponse } from '@interfaces'
import { jwt } from '@config'
import { UserModel } from '@common'

dotenv.config()

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID

const client = new OAuth2Client(GOOGLE_CLIENT_ID)

export const emailAndPassAuth = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { body, t } = req
  try {
    const users = await UserModel.aggregate([
      {
        $match: { email: body.email, state: true },
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
          userName: 1,
          email: 1,
          phoneNumber: 1,
          password: 1,
          passwordVersion: 1,
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

    if (users.length === 0) {
      dataResponse.message = t('USER_INVALID_CREDENTIALS')
      return res.status(401).send(dataResponse)
    }
    const user = users[0]
    const checkPassword = await compare(body.password, user.password)
    if (!checkPassword) {
      dataResponse.message = t('USER_INVALID_CREDENTIALS')
      return res.status(401).send(dataResponse)
    }

    delete user.password
    const accessToken = jwt.generateAccessToken({
      _id: user._id,
      email: user.email,
      passwordVersion: user.passwordVersion,
    })
    const refreshToken = jwt.generateRefreshToken({ _id: user._id })
    await UserModel.updateOne({ _id: user._id }, { $set: { refreshToken } })
    dataResponse.message = t('USER_AUTHENTICATED')
    dataResponse.data = { user, accessToken, refreshToken }
    return res.status(200).send(dataResponse)
  } catch (error) {
    dataResponse.message = t('RES_SERVER_ERROR')
    dataResponse.data = error
    return res.status(500).send(dataResponse)
  }
}

export const googleAuth = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { body, t } = req
  try {
    const ticket = await client.verifyIdToken({
      idToken: body.idToken,
      audience: GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    if (!payload) {
      dataResponse.message = t('USER_INVALID_CREDENTIALS')
      return res.status(401).send(dataResponse)
    }

    const email = payload.email
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
          userName: 1,
          email: 1,
          phoneNumber: 1,
          password: 1,
          passwordVersion: 1,
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

    if (users.length === 0) {
      dataResponse.message = t('USER_INVALID_CREDENTIALS')
      return res.status(401).send(dataResponse)
    }
    const user = users[0]

    delete user.password
    const token = jwt.generateAccessToken({
      _id: user._id,
      email: user.email,
      passwordVersion: user.passwordVersion,
    })
    dataResponse.message = t('USER_AUTHENTICATED')
    dataResponse.data = { user, token }
    return res.status(200).send(dataResponse)
  } catch (error) {
    dataResponse.message = t('RES_SERVER_ERROR')
    dataResponse.data = error
    return res.status(500).send(dataResponse)
  }
}

export const refreshToken = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { body, t } = req
  try {
    const { refreshToken } = body
    if (!refreshToken) {
      dataResponse.message = t('RES_INVALID_TOKEN')
      return res.status(400).send(dataResponse)
    }

    const userToken = jwt.verifyRefreshToken(refreshToken)
    const user = await UserModel.findById(userToken._id)
    if (!user || user.refreshToken !== refreshToken) {
      dataResponse.message = t('RES_INVALID_TOKEN')
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
    dataResponse.message = t('USER_AUTHENTICATED')
    dataResponse.data = { accessToken, refreshToken: newRefreshToken }
    return res.status(200).send(dataResponse)
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      dataResponse.message = t('RES_EXPIRED_TOKEN')
      return res.status(401).send(dataResponse)
    }
    if (error.name === 'JsonWebTokenError') {
      dataResponse.message = t('RES_INVALID_TOKEN')
      return res.status(401).send(dataResponse)
    }
    dataResponse.message = t('RES_SERVER_ERROR')
    return res.status(500).send(dataResponse)
  }
}
