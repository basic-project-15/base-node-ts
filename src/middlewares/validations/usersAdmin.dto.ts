import { Request, Response, NextFunction } from 'express'
import { schemaUsersAdmin } from '@common/schema'
import { validateAJV } from '@core/helpers'

const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { success, message } = validateAJV(
    req.body,
    schemaUsersAdmin.createUser,
  )
  if (success) {
    next()
  } else {
    res.status(400).send({
      message: 'Error de validación',
      data: message,
    })
  }
}

export default { createUser }
