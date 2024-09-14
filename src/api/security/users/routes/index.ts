import { Router } from 'express'
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  disableUser,
  unlockedUser,
  deleteUser,
  assignRole,
  removeRole,
} from '@api/security/users/controllers'

const routes = Router()

routes.get('/', getUsers)
routes.get('/:idUser', getUserById)
routes.post('/', createUser)
routes.put('/:idUser', updateUser)
routes.patch('/:idUser/disable', disableUser)
routes.patch('/:idUser/unblock', unlockedUser)
routes.delete('/:idUser', deleteUser)
routes.patch('/:idUser/assignRole', assignRole)
routes.patch('/:idUser/removeRole', removeRole)

export { routes as UserRoutes }
