import { jwt } from '@config'
import { UserModel } from '@models'
import { MAX_FAILED_PASSWORDS, CustomError } from '@common'

export const generateTokens = async (_id: string) => {
  // Verify user
  const user = await UserModel.findOne({ _id, state: true })
  if (user == null || user.incorrectPassword === MAX_FAILED_PASSWORDS)
    throw CustomError('USER_NOT_FOUND', 401)

  // Generate tokens
  const accessToken = jwt.generateAccessToken({
    _id,
    email: user.email,
    passwordVersion: user.passwordVersion,
  })
  const refreshToken = jwt.generateRefreshToken({ _id })

  // Update user
  user.refreshToken = refreshToken
  await user.save()

  return { accessToken, refreshToken }
}
