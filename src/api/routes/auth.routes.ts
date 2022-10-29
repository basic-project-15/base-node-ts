import { Router } from 'express'
import { authControllers } from '@api/controllers'
import { usersAdminDto } from '@middlewares/validations'

const authRoutes = Router()

/* Auth */
authRoutes.post('/login', usersAdminDto.login, authControllers.loginAdmin)

export default authRoutes
