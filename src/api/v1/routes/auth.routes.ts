import { Router } from 'express'
import { MIDDLEWARES, CONTROLLERS } from '@api/v1'

const routes = Router()

routes.post('/login', MIDDLEWARES.authentication.basic, CONTROLLERS.auth.login)

export default routes
