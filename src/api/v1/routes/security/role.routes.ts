import { Router } from 'express'
import { RoleControllers } from '@api/v1'

const routes = Router()
const {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  disableRole,
  assignPermission,
  removePermission,
} = RoleControllers

routes.get('/', getRoles)
routes.get('/:idRole', getRoleById)
routes.post('/', createRole)
routes.put('/:idRole', updateRole)
routes.delete('/:idRole', deleteRole)
routes.patch('/:idRole/disable', disableRole)
routes.patch('/:idRole/assignPermission', assignPermission)
routes.patch('/:idRole/removePermission', removePermission)

export { routes as RoleRoutes }
