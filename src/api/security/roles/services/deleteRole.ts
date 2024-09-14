import { RoleModel, UserModel } from '@models'
import { CustomError } from '@common'

export const deleteRole = async (idRole: string) => {
  // Verify role
  const role = await RoleModel.findById(idRole)
  if (role == null) throw CustomError('ROLE_NOT_FOUND', 404)
  if (role.type === 'owner') throw CustomError('ROLE_OWNER', 403)

  // Verify users with this role
  const usersWithIdRol = await UserModel.find({ roleIds: idRole })
  if (usersWithIdRol.length > 0) throw CustomError('ROLE_ALREADY_USED', 409)

  // Delete role
  await role.deleteOne()

  return role
}
