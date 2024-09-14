import { Router } from 'express'
import { authentication, authorization } from '@middlewares'
import { AuthRoutes } from '@api/auth/routes'
import { UserRoutes } from '@api/security/users/routes'
import { PermissionRoutes } from '@api/security/permissions/routes'
import { RoleRoutes } from '@api/security/roles/routes'
import { ProfileRoutes } from '@api/profile/routes'

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
