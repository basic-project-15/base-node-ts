import { Router } from 'express'
import { getPermissions } from '@securityModule/permissions/controllers'

const routes = Router()

routes.get('/', getPermissions)

export { routes as PermissionRoutes }
