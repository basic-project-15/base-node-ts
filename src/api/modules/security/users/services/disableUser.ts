import { UserModel } from '@models'
import { CustomError } from '@common'
import { Types } from 'mongoose'

export const disableUser = async (currentIdUser: string, idUser: string) => {
  // Verify user
  const user = await UserModel.findById(idUser).populate('roleIds')
  if (user == null) throw CustomError('USER_NOT_FOUND', 404)
  if (user.id === currentIdUser) throw CustomError('USER_DISABLE_YOURSELF', 400)

  // Verify edition owner
  const currentUser = await UserModel.findById(currentIdUser).populate(
    'roleIds',
  )
  const isOwnerEditUser = user.roleIds.some(role => role.type === 'owner')
  let isOwnerCurrentUser = false
  if (currentUser != null) {
    isOwnerCurrentUser = currentUser.roleIds.some(role => role.type === 'owner')
  }
  if (!isOwnerCurrentUser && isOwnerEditUser)
    throw CustomError('USER_OWNER_EDIT', 403)

  // Update user
  user.updated_at = new Date()
  user.updated_by = new Types.ObjectId(currentIdUser)
  user.state = false
  await user.save()

  return user
}
