import { Router } from 'express'
import { usersAdminControllers } from '@api/controllers'
import { usersAdminDto } from '@middlewares/validations'
import { authToken } from '@middlewares/authentication'

const usersAdminRoutes = Router()

usersAdminRoutes.get('/', authToken, usersAdminControllers.getUsers)
usersAdminRoutes.get('/:idUser', authToken, usersAdminControllers.getUser)
usersAdminRoutes.post(
  '/',
  authToken,
  usersAdminDto.createUser,
  usersAdminControllers.createUser,
)
usersAdminRoutes.patch(
  '/:idUser',
  authToken,
  usersAdminDto.updateUser,
  usersAdminControllers.updateUser,
)
usersAdminRoutes.delete('/:idUser', authToken, usersAdminControllers.deleteUser)

export default usersAdminRoutes
