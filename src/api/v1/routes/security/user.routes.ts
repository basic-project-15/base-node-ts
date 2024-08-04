import { Router } from 'express'
import { UserControllers } from '@api/v1'

const routes = Router()
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  disableUser,
  deleteUser,
  assignRole,
  removeRole,
} = UserControllers

routes.get('/', getUsers)
routes.get('/:idUser', getUserById)
routes.post('/', createUser)
routes.put('/:idUser', updateUser)
routes.patch('/:idUser/disable', disableUser)
routes.delete('/:idUser', deleteUser)
routes.patch('/:idUser/assignRole', assignRole)
routes.patch('/:idUser/removeRole', removeRole)

export { routes as UserRoutes }
