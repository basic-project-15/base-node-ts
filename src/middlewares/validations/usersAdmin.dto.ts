import { Request, Response, NextFunction } from 'express'
import { usersAdminSchemas } from '@common/schema'
import { validateAJV } from '@core/helpers'

const { createUserSchema, updateUserSchema, loginSchema } = usersAdminSchemas

const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { body } = req
  const response = validateAJV(body, createUserSchema)
  const { statusCode, message, data } = response
  if (statusCode === 200) return res.status(statusCode).send({ message, data })
  return next()
}

const updateUser = (req: Request, res: Response, next: NextFunction) => {
  const { body } = req
  const response = validateAJV(body, updateUserSchema)
  const { statusCode, message, data } = response
  if (statusCode !== 200) return res.status(statusCode).send({ message, data })
  return next()
}

const login = (req: Request, res: Response, next: NextFunction) => {
  const { body } = req
  const response = validateAJV(body, loginSchema)
  const { statusCode, message, data } = response
  if (statusCode !== 200) return res.status(statusCode).send({ message, data })
  return next()
}

export default { createUser, updateUser, login }
