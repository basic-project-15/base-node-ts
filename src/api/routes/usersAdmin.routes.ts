import { Router } from 'express'
import { usersAdminControllers } from '@api/controllers'
import { usersAdminDto } from '@middlewares/validations'
import { authToken, authBasic } from '@middlewares/authentication'

const usersAdminRoutes = Router()

usersAdminRoutes.get('/', authToken, usersAdminControllers.getUsers)
usersAdminRoutes.get('/:idUser', authBasic, usersAdminControllers.getUser)
usersAdminRoutes.post(
  '/',
  usersAdminDto.createUser,
  usersAdminControllers.createUser,
)
usersAdminRoutes.patch(
  '/:idUser',
  usersAdminDto.updateUser,
  usersAdminControllers.updateUser,
)
usersAdminRoutes.delete('/:idUser', usersAdminControllers.deleteUser)

export default usersAdminRoutes
