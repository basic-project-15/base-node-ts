import { Router } from 'express'
import dotenv from 'dotenv'
import { Middlewares } from '@api/v1'
import auth from './auth.routes'
import security from './security'

dotenv.config()

const routes = Router()
const { authentication, authorization } = Middlewares

routes.use('/auth', auth)
routes.use('/security', authentication, authorization, security)

export default routes
