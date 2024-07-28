import { Router } from 'express'
import { Middlewares } from '@api/v1'
import security from './security'
import auth from './auth.routes'
import profile from './profile.routes'

const routes = Router()
const { authentication, authorization } = Middlewares

// Public
routes.use('/auth', auth)
// Authentication
routes.use('/profile', authentication, profile)
// Authentication and Authorization
routes.use('/security', authentication, authorization, security)

export default routes
