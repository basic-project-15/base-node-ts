import { Router } from 'express'
import { authentication, authorization } from '@middlewares'
import { AuthRoutes } from '@authModule/routes'
import { UserRoutes } from '@securityModule/users/routes'
import { PermissionRoutes } from '@securityModule/permissions/routes'
import { RoleRoutes } from '@securityModule/roles/routes'
import { ProfileRoutes } from '@profileModule/routes'

const routes = Router()

// Public
routes.use('/auth', AuthRoutes)

// Authentication
routes.use('/profile', authentication, ProfileRoutes)

// Authentication and Authorization
routes.use(
  '/security/permissions',
  authentication,
  authorization,
  PermissionRoutes,
)
routes.use('/security/roles', authentication, authorization, RoleRoutes)
routes.use('/security/users', authentication, authorization, UserRoutes)

export { routes }
