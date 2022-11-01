import { Request, Response, NextFunction } from 'express'
import { permissionsSchemas } from '@common/schema'
import { validateAJV } from '@core/helpers'

const { createPermissionSchema } = permissionsSchemas

const createPermission = (req: Request, res: Response, next: NextFunction) => {
  const { body } = req
  const response = validateAJV(body, createPermissionSchema)
  const { statusCode, message, data } = response
  if (statusCode !== 200) return res.status(statusCode).send({ message, data })
  return next()
}

export default { createPermission }
