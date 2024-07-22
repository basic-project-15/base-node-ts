import { Router } from 'express'
import { AuthControllers } from '@api/v1'

const routes = Router()

routes.post('/email-and-pass', AuthControllers.emailAndPassAuth)
routes.post('/google-token', AuthControllers.googleAuth)

export default routes
