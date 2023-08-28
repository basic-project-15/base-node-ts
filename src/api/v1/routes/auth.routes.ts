import { Router } from 'express'
import { authControllers } from '@api/v1/controllers'
import { authBasic } from '@api/v1/middlewares'

const authRoutes = Router()

/* Auth */
authRoutes.post('/login', authBasic, authControllers.login)

export default authRoutes
