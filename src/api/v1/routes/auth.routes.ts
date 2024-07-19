import { Router } from 'express'
import { AuthControllers } from '@api/v1'

const routes = Router()

routes.post('/login', AuthControllers.login)

export default routes
