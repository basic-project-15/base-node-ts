import { jwt } from '@config'
import { UserModel } from '@models'
import { CustomError } from '@common'

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
