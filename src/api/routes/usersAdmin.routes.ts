import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from '@api/controllers'
import { dtoUserAdminCreate, validate } from '@core/validations'
import { Router } from 'express'

const usersAdminRouter = Router()

usersAdminRouter.get('/', (_req, res) => {
  const message: string = getUsers()
  res.status(200).send(message)
})

usersAdminRouter.get('/:idUser', (_req, res) => {
  const message: string = getUser()
  res.status(200).send(message)
})

usersAdminRouter.post('/', (req, res) => {
  const { success, message } = validate(req.body, dtoUserAdminCreate)
  const msg: string = createUser()
  res.status(200).send({
    success: success,
    message: msg,
    data: message,
  })
})

usersAdminRouter.patch('/', (_req, res) => {
  const message: string = updateUser()
  res.status(200).send(message)
})

usersAdminRouter.delete('/', (_req, res) => {
  const message: string = deleteUser()
  res.status(200).send(message)
})

export default usersAdminRouter
