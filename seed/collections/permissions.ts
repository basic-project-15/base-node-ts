import { PermissionModel } from '@common'
import type { IPermission } from '@interfaces'

export const createPermissions = async () => {
  try {
    const isPermissions = await PermissionModel.countDocuments({})
    if (isPermissions === 0) {
      const permissions: Array<Omit<IPermission, '_id'>> = [
        { module: 'security', action: 'read' },
        { module: 'security', action: 'create' },
        { module: 'security', action: 'update' },
        { module: 'security', action: 'delete' },
      ]
      await PermissionModel.insertMany(permissions)
      console.log('Created permissions')
    }
  } catch (err) {
    console.error('Error:', err)
  }
}
