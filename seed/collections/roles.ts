import { RoleModel } from '@common'
import type { IRole } from '@interfaces'

export const createRoles = async () => {
  try {
    const isRoles = await RoleModel.countDocuments({})
    if (isRoles === 0) {
      const roles: Array<Omit<IRole, '_id'>> = [
        {
          type: 'owner',
          name: 'Super Administrador',
          description: 'Rol que tiene control total sobre todo el sistema.',
          permissions: [],
          created_at: new Date(),
          state: true,
        },
        {
          type: 'admin',
          name: 'Administrador de Usuarios y Roles',
          description: 'Rol para la gestión de usuarios, roles y permisos.',
          permissions: [
            {
              module: 'security',
              sections: [
                {
                  section: 'users',
                  actions: ['read', 'add', 'edit', 'delete'],
                },
                {
                  section: 'roles',
                  actions: ['read', 'add', 'edit', 'delete'],
                },
                { section: 'permissions', actions: ['read'] },
              ],
            },
          ],
          created_at: new Date(),
          state: true,
        },
        {
          type: 'admin',
          name: 'reador de Usuarios',
          description: 'Rol para readar la información de los usuarios.',
          permissions: [
            {
              module: 'security',
              sections: [{ section: 'users', actions: ['read'] }],
            },
          ],
          created_at: new Date(),
          state: true,
        },
        {
          type: 'admin',
          name: 'reador',
          description: 'Rol readar la información de todas las tablas.',
          permissions: [
            {
              module: 'security',
              sections: [
                { section: 'users', actions: ['read'] },
                { section: 'roles', actions: ['read'] },
                { section: 'permissions', actions: ['read'] },
              ],
            },
            {
              module: 'business',
              sections: [
                { section: 'places', actions: ['read'] },
                { section: 'providers', actions: ['read'] },
              ],
            },
            {
              module: 'products',
              sections: [
                { section: 'foods', actions: ['read'] },
                { section: 'complements', actions: ['read'] },
                { section: 'extras', actions: ['read'] },
                { section: 'drinks', actions: ['read'] },
                { section: 'food_categories', actions: ['read'] },
              ],
            },
            {
              module: 'billing',
              sections: [
                { section: 'taxes', actions: ['read'] },
                { section: 'discounts', actions: ['read'] },
                { section: 'promotions', actions: ['read'] },
                { section: 'payment_methods', actions: ['read'] },
                { section: 'orders', actions: ['read'] },
              ],
            },
          ],
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
