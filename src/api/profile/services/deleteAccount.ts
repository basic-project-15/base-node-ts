import { UserModel } from '@models'
import { CustomError } from '@common'

export const deleteAccount = async (idUser: string) => {
  // Verify user
  const user = await UserModel.findById(idUser).populate('roleIds')
  if (user == null) throw CustomError('PROFILE_NOT_FOUND', 404)

  let isOwner = false
  isOwner = user.roleIds.some(role => role.type === 'owner')

  if (isOwner) throw CustomError('PROFILE_OWNER_DELETE', 400)

  // Delete user
  await user.deleteOne()

  return user.toObject()
}
