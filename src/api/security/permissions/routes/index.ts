import { Router } from 'express'
import { getPermissions } from '@api/security/permissions/controllers'

const routes = Router()

routes.get('/', getPermissions)

export { routes as PermissionRoutes }
