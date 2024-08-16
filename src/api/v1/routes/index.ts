import { Router } from 'express'
import { authentication } from '@api/v1'
import { AuthRoutes } from './auth.routes'
import { ProfileRoutes } from './profile.routes'
import { SecurityRoutes } from './security'

const routes = Router()

// Public
routes.use('/auth', AuthRoutes)
// Authentication
routes.use('/profile', authentication, ProfileRoutes)
// Authentication and Authorization
routes.use('/security', authentication, SecurityRoutes)

export { routes as v1Routes }
