import { Router } from 'express'
import { usersControllers } from '@api/controllers'
import { usersDto } from '@middlewares/validations'
import { authorization, authToken } from '@middlewares/authentication'

const usersRoutes = Router()

usersRoutes.get('/', authToken, authorization, usersControllers.getUsers)
usersRoutes.get('/:idUser', authToken, authorization, usersControllers.getUser)
usersRoutes.post(
  '/',
  authToken,
  authorization,
  usersDto.createUser,
  usersControllers.createUser,
)
usersRoutes.patch(
  '/:idUser',
  authToken,
  authorization,
  usersDto.updateUser,
  usersControllers.updateUser,
)
usersRoutes.delete(
  '/:idUser',
  authToken,
  authorization,
  usersControllers.deleteUser,
)
usersRoutes.patch(
  '/assignPermission/:idUser',
  authToken,
  authorization,
  usersControllers.assignPermission,
)
usersRoutes.patch(
  '/removePermission/:idUser',
  authToken,
  authorization,
  usersControllers.removePermission,
)

export default usersRoutes
