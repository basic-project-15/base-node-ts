import { UserModel } from '@common'
import { CustomError } from '@core'

export const getProfile = async (email: string) => {
  // Get user
  const users = await UserModel.aggregate([
    {
      $match: { email, state: true },
    },
    {
      $project: {
        id: 1,
        firstName: 1,
        lastName: 1,
        email: 1,
        phoneNumber: 1,
        photo: 1,
      },
    },
  ])
  if (users.length === 0) throw CustomError('USER_NOT_FOUND', 404)

  return users[0]
}
