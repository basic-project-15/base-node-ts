import { Router } from 'express'
import { rolesControllers } from '@api/v1/controllers'
import { authorization, authentication } from '@api/v1/middlewares'

const rolesRoutes = Router()

rolesRoutes.get('/', authentication, authorization, rolesControllers.getRoles)
rolesRoutes.get(
  '/:idRole',
  authentication,
  authorization,
  rolesControllers.getRole,
)
rolesRoutes.post(
  '/',
  authentication,
  authorization,
  rolesControllers.createRole,
)
rolesRoutes.patch(
  '/:idRole',
  authentication,
  authorization,
  rolesControllers.updateRole,
)
rolesRoutes.delete(
  '/:idRole',
  authentication,
  authorization,
  rolesControllers.deleteRole,
)
rolesRoutes.patch(
  '/:idRole/assignPermission',
  authentication,
  authorization,
  rolesControllers.assignPermission,
)
rolesRoutes.patch(
  '/:idRole/removePermission',
  authentication,
  authorization,
  rolesControllers.removePermission,
)

export default rolesRoutes
