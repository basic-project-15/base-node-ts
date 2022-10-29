import { Request, Response, NextFunction } from 'express'
import { usersAdminSchemas } from '@common/schema'
import { validateAJV } from '@core/helpers'

const createUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { success, message, data } = validateAJV(
      req.body,
      usersAdminSchemas.createUser,
    )
    if (success) {
      return next()
    } else {
      return res.status(400).send({
        message: 'Error de validación',
        data: { message, data },
      })
    }
  } catch (error) {
    return res.status(500).send({
      message: 'Problema interno del servidor',
      data: error,
    })
  }
}

export default { createUser }
