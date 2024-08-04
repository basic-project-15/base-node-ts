import { Router } from 'express'
import { PermissionControllers } from '@api/v1'

const routes = Router()
const { getPermissions } = PermissionControllers

routes.get('/', getPermissions)

export { routes as PermissionRoutes }
