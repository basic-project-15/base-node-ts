import { Router } from 'express'
import { RolesControllers } from '@api/v1'

const routes = Router()

routes.get('/', RolesControllers.getRoles)
routes.get('/:idRole', RolesControllers.getRoleById)
routes.post('/', RolesControllers.createRole)
routes.put('/:idRole', RolesControllers.updateRole)
routes.delete('/:idRole', RolesControllers.deleteRole)
routes.patch('/:idRole/disable', RolesControllers.disableRole)
routes.patch('/:idRole/assignPermission', RolesControllers.assignPermission)
routes.patch('/:idRole/removePermission', RolesControllers.removePermission)

export default routes
