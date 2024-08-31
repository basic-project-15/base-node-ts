import { RoleModel } from '@common'
import { CustomError } from '@core'
import { Types } from 'mongoose'

export const disableRole = async (currentIdUser: string, idRole: string) => {
  // Verify role
  const role = await RoleModel.findById(idRole)
  if (role == null) throw CustomError('ROLE_NOT_FOUND', 404)
  if (role.type === 'owner') throw CustomError('ROLE_OWNER', 403)

  // Update role
  role.updated_at = new Date()
  role.updated_by = new Types.ObjectId(currentIdUser)
  role.state = false
  await role.save()

  return role
}
