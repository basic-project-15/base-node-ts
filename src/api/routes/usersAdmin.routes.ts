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

usersAdminRoutes.patch('/', usersAdminControllers.updateUser)

usersAdminRoutes.delete('/', usersAdminControllers.deleteUser)

export default usersAdminRoutes
