import { Request, Response, NextFunction } from 'express'
import { permissionsSchemas } from '@common/schema'
import { validateAJV } from '@core/helpers'
import { Methods, Paths } from '@common/types'

const { createPermissionSchema } = permissionsSchemas

const createPermission = (req: Request, res: Response, next: NextFunction) => {
  const { body } = req
  const response = validateAJV(body, createPermissionSchema)
  const { statusCode, message, data } = response
  if (statusCode !== 200) return res.status(statusCode).send({ message, data })
  if (!Object.values(Methods).includes(body.method)) {
    return res.status(400).send({
      message: `El método solo puede ser: ${Object.values(Methods)}`,
      data: null,
    })
  }
  if (!Object.values(Paths).includes(body.path)) {
    return res.status(400).send({
      message: `La ruta solo puede ser: ${Object.values(Paths)}`,
      data: null,
    })
  }
  return next()
}

export default { createPermission }
