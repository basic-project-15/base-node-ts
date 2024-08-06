import { PermissionModel } from '@common'

export const getPermissions = async () => {
  // Get permissions
  const permissions = await PermissionModel.find()
  return permissions
}
