import { Request, Response, NextFunction } from 'express'
import { Type } from '@sinclair/typebox'
import { validateAJV } from '@core/helpers'
import { Methods, Paths } from '@common/types'
import { DataResponse } from '@interfaces'

const createPermission = (req: Request, res: Response, next: NextFunction) => {
  const dataResponse: DataResponse = {
    message: '',
    data: null,
  }
  const { body } = req
  try {
    const createPermissionSchema = Type.Object(
      {
        path: Type.String({
          isNotEmpty: true,
          errorMessage: {
            isNotEmpty: 'No debe ser vacío',
            type: 'Debe ser un string',
          },
        }),
        method: Type.String({
          isNotEmpty: true,
          errorMessage: {
            isNotEmpty: 'No debe ser vacío',
            type: 'Debe ser un string',
          },
        }),
      },
      {
        additionalProperties: false,
        errorMessage: {
          type: 'Debe ser un objeto',
          additionalProperties: 'El formato del objeto no es válido',
          required: {
            path: 'La ruta es requerida',
            method: 'El método es requerido',
          },
        },
      },
    )
    validateAJV(body, createPermissionSchema)

    // Validate Paths and Methods
    const methods: string[] = Object.values(Methods)
    const paths: string[] = Object.values(Paths)
    if (!methods.includes(body.method))
      dataResponse.message = `El método solo puede ser: ${methods}`
    if (!paths.includes(body.path))
      dataResponse.message = `La ruta solo puede ser: ${paths}`
    if (dataResponse.message) return res.status(400).send(dataResponse)
  } catch (error) {
    dataResponse.message = 'Formato de datos no válido.'
    dataResponse.data = error
    return res.status(400).send(dataResponse)
  }
  return next()
}

export default { createPermission }
