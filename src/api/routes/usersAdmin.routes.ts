import { usersAdmin } from '@api/controllers'
import { dtoUsersAdmin } from '@middlewares/validations'
import { Router } from 'express'

const routeUsersAdmin = Router()

routeUsersAdmin.get('/', usersAdmin.getUsers)

routeUsersAdmin.get('/:idUser', usersAdmin.getUser)

routeUsersAdmin.post('/', dtoUsersAdmin.createUser, usersAdmin.createUser)

routeUsersAdmin.patch('/', usersAdmin.updateUser)

routeUsersAdmin.delete('/', usersAdmin.deleteUser)

export default routeUsersAdmin
