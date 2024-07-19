import { Router } from 'express'
import { UsersControllers } from '@api/v1'

const routes = Router()

routes.get('/', UsersControllers.getUsers)
routes.get('/:idUser', UsersControllers.getUserById)
routes.post('/', UsersControllers.createUser)
routes.put('/:idUser', UsersControllers.updateUser)
routes.patch('/:idUser/disable', UsersControllers.disableUser)
routes.delete('/:idUser', UsersControllers.deleteUser)
routes.patch('/:idUser/assignRole', UsersControllers.assignRole)
routes.patch('/:idUser/removeRole', UsersControllers.removeRole)

export default routes
