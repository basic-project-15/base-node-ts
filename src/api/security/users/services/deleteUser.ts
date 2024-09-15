import { UserModel } from '@models'
import { CustomError } from '@common'

export const deleteUser = async (currentIdUser: string, idUser: string) => {
  // Verify user
  const user = await UserModel.findById(idUser).populate('roleIds')
  if (user == null) throw CustomError('USER_NOT_FOUND', 404)
  if (user.id === currentIdUser) throw CustomError('USER_DELETE_YOURSELF', 400)

  // Verify deletion owner
  const currentUser = await UserModel.findById(currentIdUser).populate(
    'roleIds',
  )
  const isOwnerDeleteUser = user.roleIds.some(role => role.type === 'owner')
  let isOwnerCurrentUser = false
  if (currentUser != null) {
    isOwnerCurrentUser = currentUser.roleIds.some(role => role.type === 'owner')
  }
  if (!isOwnerCurrentUser && isOwnerDeleteUser)
    throw CustomError('USER_OWNER_DELETE', 403)

  // Delete user
  await user.deleteOne()

  return user.toObject()
}
