import { RoleModel } from '@models'
import { CustomError } from '@common'

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
