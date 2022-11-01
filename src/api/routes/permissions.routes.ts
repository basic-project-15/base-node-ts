import { Router } from 'express'
import { permissionsControllers } from '@api/controllers'
import { authorization, authToken } from '@middlewares/authentication'

const permissionsRoutes = Router()

/* Auth */
permissionsRoutes.get(
  '/',
  authToken,
  authorization,
  permissionsControllers.getPermissions,
)
permissionsRoutes.post(
  '/',
  authToken,
  authorization,
  permissionsControllers.createPermission,
)
permissionsRoutes.delete(
  '/:idPermission',
  authToken,
  authorization,
  permissionsControllers.deletePermission,
)

export default permissionsRoutes
