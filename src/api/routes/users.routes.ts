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
  '/:idUser/assignPermission',
  authToken,
  authorization,
  usersControllers.assignPermission,
)
usersRoutes.patch(
  '/:idUser/removePermission',
  authToken,
  authorization,
  usersControllers.removePermission,
)

export default usersRoutes
