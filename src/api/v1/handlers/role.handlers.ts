import { isValidPermissionSchema, RoleModel, UserModel } from '@common'
import { CustomError } from '@core'
import type { FilterQuery, IModule } from '@interfaces'
import { Types } from 'mongoose'

interface InfoRole {
  idRole: string
  name: string
  description: string
  permissions: IModule[]
  state: boolean
}

export const getRoles = async (filters: FilterQuery) => {
  // Get roles
  const { searchQuery, sortField, sortOrder } = filters
  const order = sortOrder === 'desc' ? -1 : 1
  const roles = await RoleModel.aggregate([
    {
      $match: {
        $or: [
          { type: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } },
        ],
      },
    },
    {
      $project: {
        id: 1,
        type: 1,
        name: 1,
        description: 1,
        state: 1,
      },
    },
    { $sort: { [sortField]: order } },
  ])

  return roles
}

export const getRoleById = async (idRole: string) => {
  // Get role
  const role = await RoleModel.findById(idRole).populate([
    {
      path: 'created_by',
      select: '_id email',
    },
    {
      path: 'updated_by',
      select: '_id email',
    },
  ])
  if (role == null) throw CustomError('ROLE_NOT_FOUND', 404)

  return role
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

export const updateRole = async (currentIdUser: string, infoRole: InfoRole) => {
  // Get roles
  const { idRole, name, description, permissions, state } = infoRole
  const role = await RoleModel.findById(idRole)
  const anotherRole = await RoleModel.findOne({ name })
  console.log(infoRole)

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
