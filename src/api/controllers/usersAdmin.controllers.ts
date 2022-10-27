import { Request, Response } from 'express'

const getUsers = (_req: Request, res: Response): void => {
  res.status(200).send('usersAdmin get')
}

const getUser = (_req: Request, res: Response): void => {
  res.status(200).send('usersAdmin get by id')
}

const createUser = (_req: Request, res: Response): void => {
  res.status(200).send('usersAdmin post')
}

const updateUser = (_req: Request, res: Response): void => {
  res.status(200).send('usersAdmin patch')
}

const deleteUser = (_req: Request, res: Response): void => {
  res.status(200).send('usersAdmin delete')
}

export default {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
}
