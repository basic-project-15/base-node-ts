import { Router } from 'express'
import { authControllers } from '@api/controllers'
import { usersDto } from '@middlewares/validations'
import { authBasic } from '@middlewares/authentication'

const authRoutes = Router()

/* Auth */
authRoutes.post('/login', authBasic, usersDto.login, authControllers.login)

export default authRoutes
