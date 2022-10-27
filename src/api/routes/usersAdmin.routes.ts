import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from '@api/controllers'
import { Router } from 'express'

const usersAdminRouter = Router()

usersAdminRouter.get('/', (_req, res) => {
  const message: string = getUsers()
  res.send(message)
})

usersAdminRouter.get('/:idUser', (_req, res) => {
  const message: string = getUser()
  res.send(message)
})

usersAdminRouter.post('/', (_req, res) => {
  const message: string = createUser()
  res.send(message)
})

usersAdminRouter.patch('/', (_req, res) => {
  const message: string = updateUser()
  res.send(message)
})

usersAdminRouter.delete('/', (_req, res) => {
  const message: string = deleteUser()
  res.send(message)
})

export default usersAdminRouter
