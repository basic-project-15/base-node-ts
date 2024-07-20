import { Router } from 'express'
import dotenv from 'dotenv'
import {
  AuthenticationMiddleware,
  AuthorizationMiddleware,
  LanguagesMiddleware,
} from '@api'
import auth from './auth.routes'
import security from './security'

dotenv.config()

const routes = Router()

/* Middlewares */
routes.use('/', LanguagesMiddleware)

/* APIs */
routes.use('/auth', auth)
routes.use(
  '/security',
  AuthenticationMiddleware,
  AuthorizationMiddleware,
  security,
)

export default routes
