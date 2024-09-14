import { RoleModel, UserModel } from '@models'
import { CustomError } from '@common'
import { Types } from 'mongoose'

export const assignRole = async (
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
  if (hasRole) throw CustomError('USER_ALREADY_ASSIGN_ROLE', 409)

  // Assign role and update user
  user.updated_at = new Date()
  user.updated_by = new Types.ObjectId(currentIdUser)
  user.roleIds.push(new Types.ObjectId(idRole))
  await user.save()

  return role
}
