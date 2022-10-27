import { Router } from 'express'
import { controllerUsersAdmin } from '@api/controllers'
import { dtoUsersAdmin } from '@middlewares/validations'

const routeUsersAdmin = Router()

routeUsersAdmin.get('/', controllerUsersAdmin.getUsers)

routeUsersAdmin.get('/:idUser', controllerUsersAdmin.getUser)

routeUsersAdmin.post(
  '/',
  dtoUsersAdmin.createUser,
  controllerUsersAdmin.createUser,
)

routeUsersAdmin.patch('/', controllerUsersAdmin.updateUser)

routeUsersAdmin.delete('/', controllerUsersAdmin.deleteUser)

export default routeUsersAdmin
