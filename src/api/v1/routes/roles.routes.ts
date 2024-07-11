import { Router } from 'express'
import { MIDDLEWARES, CONTROLLERS } from '@api/v1'

const routes = Router()

routes.get(
  '/',
  MIDDLEWARES.authentication.token,
  MIDDLEWARES.authorization.token,
  CONTROLLERS.roles.getRoles,
)
routes.get(
  '/:idRole',
  MIDDLEWARES.authentication.token,
  MIDDLEWARES.authorization.token,
  CONTROLLERS.roles.getRole,
)
routes.post(
  '/',
  MIDDLEWARES.authentication.token,
  MIDDLEWARES.authorization.token,
  CONTROLLERS.roles.createRole,
)
routes.patch(
  '/:idRole',
  MIDDLEWARES.authentication.token,
  MIDDLEWARES.authorization.token,
  CONTROLLERS.roles.updateRole,
)
routes.delete(
  '/:idRole',
  MIDDLEWARES.authentication.token,
  MIDDLEWARES.authorization.token,
  CONTROLLERS.roles.deleteRole,
)
routes.patch(
  '/:idRole/assignPermission',
  MIDDLEWARES.authentication.token,
  MIDDLEWARES.authorization.token,
  CONTROLLERS.roles.assignPermission,
)
routes.patch(
  '/:idRole/removePermission',
  MIDDLEWARES.authentication.token,
  MIDDLEWARES.authorization.token,
  CONTROLLERS.roles.removePermission,
)

export default routes
