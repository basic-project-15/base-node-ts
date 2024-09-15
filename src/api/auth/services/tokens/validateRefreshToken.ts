import { jwt } from '@config'
import { UserModel } from '@models'
import { CustomError } from '@common'

export const validateRefreshToken = async (refreshToken: string) => {
  // Verify refresh token
  if (!refreshToken) throw CustomError('AUTH_INVALID_TOKEN', 401)
  const userToken = jwt.verifyRefreshToken(refreshToken)

  // Verify user
  const user = await UserModel.findById(userToken._id)
  if (!user || user.refreshToken !== refreshToken)
    throw CustomError('AUTH_INVALID_TOKEN', 401)
  if (!user.state) throw CustomError('AUTH_ACCOUNT_DISABLED', 400)

  return user.toObject()
}
