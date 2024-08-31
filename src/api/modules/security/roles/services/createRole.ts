import { isValidPermissionSchema, RoleModel } from '@common'
import { CustomError } from '@core'
import type { IModule } from '@interfaces'
import { Types } from 'mongoose'

interface InfoRole {
  idRole: string
  name: string
  description: string
  permissions: IModule[]
  state: boolean
}

export const createRole = async (
  currentIdUser: string,
  infoRole: Omit<InfoRole, 'idRole' | 'state'>,
) => {
  const { name, description, permissions } = infoRole

  // Verify another role
  const anotherRole = await RoleModel.findOne({ name })
  if (anotherRole != null) throw CustomError('ROLE_ALREADY_EXISTS', 409)

  // Verify permissions
  if (!isValidPermissionSchema(permissions))
    throw CustomError('PERMISSION_NOT_VALID', 400)

  // Create role
  const role = new RoleModel({
    type: 'admin',
    name,
    description,
    permissions,
    created_at: new Date(),
    created_by: new Types.ObjectId(currentIdUser),
    state: true,
  })
  await role.save()

  return role
}
