import { Router } from 'express'
import { usersAdminControllers } from '@api/controllers'
import { usersAdminDto } from '@middlewares/validations'

const usersAdminRoutes = Router()

usersAdminRoutes.get('/', usersAdminControllers.getUsers)
usersAdminRoutes.get('/:idUser', usersAdminControllers.getUser)
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
