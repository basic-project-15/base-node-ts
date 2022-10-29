import { Request, Response, NextFunction } from 'express'
import { usersAdminSchemas } from '@common/schema'
import { validateAJV } from '@core/helpers'

const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { success, message, data } = validateAJV(
    req.body,
    usersAdminSchemas.createUser,
  )
  if (success) {
    next()
  } else {
    res.status(400).send({
      message: 'Error de validación',
      data: { message, data },
    })
  }
}

export default { createUser }
