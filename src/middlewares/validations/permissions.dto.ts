import { Request, Response, NextFunction } from 'express'
import { Type } from '@sinclair/typebox'
import { validateAJV } from '@core/helpers'
import { Methods, Paths } from '@common/types'
import { DataResponse } from '@interfaces'

const createPermission = (req: Request, res: Response, next: NextFunction) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { body, t } = req
  try {
    const createPermissionSchema = Type.Object(
      {
        path: Type.String({
          isNotEmpty: true,
          errorMessage: {
            isNotEmpty: t('VALID_NotEmpty'),
            type: t('VALID_String'),
          },
        }),
        method: Type.String({
          isNotEmpty: true,
          errorMessage: {
            isNotEmpty: t('VALID_NotEmpty'),
            type: t('VALID_String'),
          },
        }),
      },
      {
        additionalProperties: false,
        errorMessage: {
          type: t('VALID_Object'),
          additionalProperties: t('VALID_FormatObject'),
          required: {
            path: t('REQUIRED_Path'),
            method: t('REQUIRED_Method'),
          },
        },
      },
    )
    validateAJV(body, createPermissionSchema)

    // Validate Paths and Methods
    const methods: string[] = Object.values(Methods)
    const paths: string[] = Object.values(Paths)
    if (!methods.includes(body.method))
      dataResponse.message = `${t('VALID_Method')} ${methods}`
    if (!paths.includes(body.path))
      dataResponse.message = `${t('VALID_Path')} ${paths}`
    if (dataResponse.message) return res.status(400).send(dataResponse)
  } catch (error) {
    dataResponse.message = t('RES_InvalidDataFormat')
    dataResponse.data = error
    return res.status(400).send(dataResponse)
  }
  return next()
}

export default { createPermission }
