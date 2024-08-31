import { jwt } from '@config'
import { MAX_FAILED_PASSWORDS, UserModel } from '@common'
import { CustomError } from '@core'

export const generateTokens = async (
  _id: string,
  email: string,
  passwordVersion: number,
) => {
  // Verify user
  const user = await UserModel.findOne({ email, state: true })
  if (user == null || user.incorrectPassword === MAX_FAILED_PASSWORDS)
    throw CustomError('USER_NOT_FOUND', 401)

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

export const validateRefreshToken = async (refreshToken: string) => {
  // Verify refresh token
  if (!refreshToken) throw CustomError('RES_INVALID_TOKEN', 401)
  const userToken = jwt.verifyRefreshToken(refreshToken)

  // Verify user
  const user = await UserModel.findOne({ _id: userToken._id, state: true })
  if (!user || user.refreshToken !== refreshToken)
    throw CustomError('RES_INVALID_TOKEN', 401)

  return user.toObject()
}
