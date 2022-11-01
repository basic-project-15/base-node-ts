import { Router } from 'express'
import { authControllers } from '@api/controllers'
import { usersAdminDto } from '@middlewares/validations'
import { authBasic } from '@middlewares/authentication'

const authRoutes = Router()

/* Auth */
authRoutes.post(
  '/login',
  authBasic,
  usersAdminDto.login,
  authControllers.loginAdmin,
)

export default authRoutes
