import { RoleModel } from '@common'
import type { IRole } from '@interfaces'

export const createRoles = async () => {
  try {
    const isRoles = await RoleModel.countDocuments({})
    if (isRoles === 0) {
      const roles: Array<Omit<IRole, '_id'>> = [
        {
          type: 'owner',
          description: 'Super Administrador',
          permissions: [],
          created_at: new Date(),
          state: true,
        },
        {
          type: 'admin',
          description: 'Administrador de Usuarios',
          permissions: [
            { module: 'security', action: 'read' },
            { module: 'security', action: 'create' },
            { module: 'security', action: 'update' },
            { module: 'security', action: 'delete' },
          ],
          created_at: new Date(),
          state: true,
        },
        {
          type: 'admin',
          description: 'Consultor de Usuarios',
          permissions: [{ module: 'security', action: 'read' }],
          created_at: new Date(),
          state: true,
        },
      ]
      await RoleModel.insertMany(roles)
      console.log('Created roles')
    }
  } catch (err) {
    console.error('Error:', err)
  }
}
