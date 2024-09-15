import { UserModel } from '@models'
import { CustomError } from '@common'

export const getUserById = async (idUser: string) => {
  const user = await UserModel.findById(idUser).populate([
    {
      path: 'roleIds',
      select: '_id name',
    },
    {
      path: 'created_by',
      select: '_id email',
    },
    {
      path: 'updated_by',
      select: '_id email',
    },
  ])
  if (user == null) throw CustomError('USER_NOT_FOUND', 404)

  return user.toObject()
}
