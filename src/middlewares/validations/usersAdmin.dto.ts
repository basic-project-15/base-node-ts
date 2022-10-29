import { Request, Response, NextFunction } from 'express'
import { usersAdminSchemas } from '@common/schema'
import { validateAJV } from '@core/helpers'

const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { body } = req
  try {
    if (Object.entries(body).length === 0) {
      return res.status(400).send({
        message: 'Formato del body no vállido',
        data: null,
      })
    }
    const { success, message, data } = validateAJV(
      body,
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

const updateUser = (req: Request, res: Response, next: NextFunction) => {
  const { body } = req
  try {
    if (Object.entries(body).length === 0) {
      return res.status(400).send({
        message: 'Formato del body no vállido',
        data: null,
      })
    }
    const { success, message, data } = validateAJV(
      body,
      usersAdminSchemas.updateUser,
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

export default { createUser, updateUser }
