import { Router } from 'express'
import { usersControllers } from '@api/v1/controllers'
import { authorization, authentication } from '@api/v1/middlewares'

const usersRoutes = Router()

usersRoutes.get('/', authentication, authorization, usersControllers.getUsers)
usersRoutes.get(
  '/:idUser',
  authentication,
  authorization,
  usersControllers.getUser,
)
usersRoutes.post(
  '/',
  authentication,
  authorization,
  usersControllers.createUser,
)
usersRoutes.patch(
  '/:idUser',
  authentication,
  authorization,
  usersControllers.updateUser,
)
usersRoutes.delete(
  '/:idUser',
  authentication,
  authorization,
  usersControllers.deleteUser,
)

export default usersRoutes
