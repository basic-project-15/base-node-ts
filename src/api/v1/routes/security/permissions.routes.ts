import { Router } from 'express'
import { PermissionsControllers } from '@api/v1'

const routes = Router()

routes.get('/', PermissionsControllers.getPermissions)

export default routes
