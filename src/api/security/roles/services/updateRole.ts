import type { IModule } from '@models'
import { isValidPermissionSchema, RoleModel } from '@models'
import { CustomError } from '@common'
import { Types } from 'mongoose'

interface InfoRole {
  idRole: string
  name: string
  description: string
  permissions: IModule[]
  state: boolean
}

export const updateRole = async (currentIdUser: string, infoRole: InfoRole) => {
  // Get roles
  const { idRole, name, description, permissions, state } = infoRole
  const role = await RoleModel.findById(idRole)
  const anotherRole = await RoleModel.findOne({ name })

  // Verify permissions
  if (!isValidPermissionSchema(permissions))
    throw CustomError('PERMISSION_NOT_VALID', 400)

  // Verify roles
  if (role == null) throw CustomError('ROLE_NOT_FOUND', 404)
  if (role.type === 'owner') throw CustomError('ROLE_OWNER', 403)
  if (anotherRole != null && anotherRole.id !== idRole)
    throw CustomError('ROLE_ALREADY_EXISTS', 409)

  // Update role
  role.name = name ?? role.name
  role.description = description ?? role.description
  role.permissions = permissions ?? role.permissions
  role.updated_at = new Date()
  role.updated_by = new Types.ObjectId(currentIdUser)
  role.state = state ?? role.state
  await role.save()

  return role
}
