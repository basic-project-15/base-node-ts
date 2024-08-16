import { Router } from 'express'
import { PermissionRoutes } from './permission.routes'
import { RoleRoutes } from './role.routes'
import { UserRoutes } from './user.routes'
import { authorization } from '@api/v1/middlewares'

const routes = Router()

routes.use('/permissions', authorization, PermissionRoutes)
routes.use('/roles', authorization, RoleRoutes)
routes.use('/users', authorization, UserRoutes)

export { routes as SecurityRoutes }
