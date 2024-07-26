import { Router } from 'express'
import { Middlewares } from '@api/v1'
import auth from './auth.routes'
import security from './security'

const routes = Router()
const { authentication, authorization } = Middlewares

routes.use('/auth', auth)
routes.use('/security', authentication, authorization, security)

export default routes
