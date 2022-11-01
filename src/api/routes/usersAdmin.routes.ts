import { Router } from 'express'
import { usersAdminControllers } from '@api/controllers'
import { usersAdminDto } from '@middlewares/validations'
import { authorization, authToken } from '@middlewares/authentication'

const usersAdminRoutes = Router()

usersAdminRoutes.get(
  '/',
  authToken,
  authorization,
  usersAdminControllers.getUsers,
)
usersAdminRoutes.get(
  '/:idUser',
  authToken,
  authorization,
  usersAdminControllers.getUser,
)
usersAdminRoutes.post(
  '/',
  authToken,
  authorization,
  usersAdminDto.createUser,
  usersAdminControllers.createUser,
)
usersAdminRoutes.patch(
  '/:idUser',
  authToken,
  authorization,
  usersAdminDto.updateUser,
  usersAdminControllers.updateUser,
)
usersAdminRoutes.delete(
  '/:idUser',
  authToken,
  authorization,
  usersAdminControllers.deleteUser,
)

export default usersAdminRoutes
