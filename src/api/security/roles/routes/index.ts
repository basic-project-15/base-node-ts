import { Router } from 'express'
import {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  disableRole,
} from '@api/security/roles/controllers'

const routes = Router()

routes.get('/', getRoles)
routes.get('/:idRole', getRoleById)
routes.post('/', createRole)
routes.put('/:idRole', updateRole)
routes.delete('/:idRole', deleteRole)
routes.patch('/:idRole/disable', disableRole)

export { routes as RoleRoutes }
