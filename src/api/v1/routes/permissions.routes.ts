import { Router } from 'express'
import { permissionsControllers } from '@api/v1/controllers'
import { authorization, authToken } from '@middlewares/authentication'
import { permissionsDto } from '@middlewares/validations'

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
  permissionsDto.createPermission,
  permissionsControllers.createPermission,
)
permissionsRoutes.delete(
  '/:idPermission',
  authToken,
  authorization,
  permissionsControllers.deletePermission,
)

export default permissionsRoutes
