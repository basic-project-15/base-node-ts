import { Router } from 'express'
import { MIDDLEWARES, CONTROLLERS } from '@api/v1'

const routes = Router()

routes.get(
  '/',
  MIDDLEWARES.authentication.token,
  MIDDLEWARES.authorization.token,
  CONTROLLERS.users.getUsers,
)
routes.get(
  '/:idUser',
  MIDDLEWARES.authentication.token,
  MIDDLEWARES.authorization.token,
  CONTROLLERS.users.getUser,
)
routes.post(
  '/',
  MIDDLEWARES.authentication.token,
  MIDDLEWARES.authorization.token,
  CONTROLLERS.users.createUser,
)
routes.patch(
  '/:idUser',
  MIDDLEWARES.authentication.token,
  MIDDLEWARES.authorization.token,
  CONTROLLERS.users.updateUser,
)
routes.delete(
  '/:idUser',
  MIDDLEWARES.authentication.token,
  MIDDLEWARES.authorization.token,
  CONTROLLERS.users.deleteUser,
)

export default routes
