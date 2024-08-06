import { compare } from 'bcrypt'
import { OAuth2Client } from 'google-auth-library'
import type { IUser, Languages } from '@interfaces'
import { GOOGLE_CLIENT_ID, MAX_FAILED_PASSWORDS, UserModel } from '@common'
import { capitalizeFirstLetter, CustomError, SendEmails } from '@core'
import { jwt } from '@config'

interface Credentials {
  email: string
  password: string
}

export const generateTokens = async (
  _id: string,
  email: string,
  passwordVersion: number,
) => {
  // Verify user
  const user = await UserModel.findById(_id)
  if (user == null) throw CustomError('USER_NOT_FOUND', 401)

  // Generate tokens
  const accessToken = jwt.generateAccessToken({
    _id,
    email,
    passwordVersion,
  })
  const refreshToken = jwt.generateRefreshToken({ _id })

  // Update user
  user.refreshToken = refreshToken
  await user.save()

  return { accessToken, refreshToken }
}

export const validateEmailAndPass = async (
  credentials: Credentials,
  lng: Languages,
) => {
  // Verify user
  const user = await UserModel.findOne({
    email: credentials.email,
    state: true,
  })
  if (user == null) throw CustomError('USER_INVALID_CREDENTIALS', 401)

  // Verify user is blocked
  let incorrectPassword: number = user.incorrectPassword!
  if (incorrectPassword >= MAX_FAILED_PASSWORDS)
    throw CustomError('USER_BLOCKED_DETAILS', 401)

  // Check password and update user if password is incorrect
  const checkPassword = await compare(credentials.password, user.password!)
  if (!checkPassword) {
    incorrectPassword++
    if (incorrectPassword <= MAX_FAILED_PASSWORDS) {
      user.incorrectPassword = incorrectPassword
      await user.save()
    }
  }

  // Verify user is blocked and send email once
  if (!checkPassword && incorrectPassword === MAX_FAILED_PASSWORDS) {
    await SendEmails.blockedAccount(lng, {
      name: user?.firstName,
      email: credentials.email,
    })
    throw CustomError('USER_BLOCKED_DETAILS', 401)
  } else if (!checkPassword) {
    throw CustomError('USER_INVALID_CREDENTIALS', 401)
  }

  // Unblock user
  user.incorrectPassword = 0
  await user.save()

  return user.$clone()
}

export const validateLoginWithGoogle = async (idToken: string) => {
  // Verify idToken
  const client = new OAuth2Client(GOOGLE_CLIENT_ID)
  const ticket = await client.verifyIdToken({
    idToken,
    audience: GOOGLE_CLIENT_ID,
  })
  const payload = ticket.getPayload()
  if (!payload) throw CustomError('USER_INVALID_CREDENTIALS', 401)

  // Verify user, if it is not found, it will register it
  const email = payload.email ?? ''
  let user = await UserModel.findOne({ email, state: true })
  if (user == null) {
    const firstName = payload.given_name ?? ''
    const lastName = payload.family_name ?? ''
    const photo = payload.picture ?? ''
    const newUser: Omit<IUser, '_id'> = {
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

    // Verify user again
    user = await UserModel.findOne({ email, state: true })
    if (user == null) throw CustomError('RES_SERVER_ERROR', 500)
  }

  // Unblock user
  user.incorrectPassword = 0
  await user.save()

  return user.$clone()
}

export const validateRefreshToken = async (refreshToken: string) => {
  // Verify refresh token
  if (!refreshToken) throw CustomError('RES_INVALID_TOKEN', 401)
  const userToken = jwt.verifyRefreshToken(refreshToken)

  // Verify user
  const user = await UserModel.findOne({ _id: userToken._id, state: true })
  if (!user || user.refreshToken !== refreshToken)
    throw CustomError('RES_INVALID_TOKEN', 401)

  return user.$clone()
}
