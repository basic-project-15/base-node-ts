import { RoleModel, UserModel } from '@models'
import { CustomError } from '@common'
import { Types } from 'mongoose'

export const removeRole = async (
  currentIdUser: string,
  idUser: string,
  idRole: string,
) => {
  // Verify user
  const user = await UserModel.findById(idUser).populate('roleIds')
  if (user == null) throw CustomError('USER_NOT_FOUND', 404)
  if (user.id === currentIdUser) throw CustomError('USER_CHANGE_YOURSELF', 400)

  // Verify edit owner
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

  // Verify role
  const role = await RoleModel.findById(idRole)
  if (role == null) throw CustomError('ROLE_NOT_FOUND', 404)
  const hasRole = user.roleIds.some(role => role._id.equals(idRole))
  if (!hasRole) throw CustomError('USER_ALREADY_REMOVE_ROLE', 409)

  // Remove role and update user
  user.roleIds = user.roleIds.filter(role => !role._id.equals(idRole))
  user.updated_at = new Date()
  user.updated_by = new Types.ObjectId(currentIdUser)
  await user.save()

  return role.toObject()
}
