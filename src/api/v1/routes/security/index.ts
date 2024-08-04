import { Router } from 'express'
import { PermissionRoutes } from './permission.routes'
import { RoleRoutes } from './role.routes'
import { UserRoutes } from './user.routes'

const routes = Router()

routes.use('/permissions', PermissionRoutes)
routes.use('/roles', RoleRoutes)
routes.use('/users', UserRoutes)

export { routes as SecurityRoutes }
