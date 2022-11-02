import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import addErrors from 'ajv-errors'
import { DataResponse } from '@interfaces'

const ajv = new Ajv({ allErrors: true })
addFormats(ajv, ['email']).addKeyword('kind').addKeyword('modifier')
addErrors(ajv, { keepErrors: false })
ajv.addKeyword({
  keyword: 'isNotEmpty',
  type: 'string',
  validate: function (_schema: any, data: string) {
    return typeof data === 'string' && data.trim() !== ''
  },
  errors: false,
})

const validate = (data: any, schema: any): DataResponse => {
  const response: DataResponse = {
    statusCode: 200,
    message: '',
    data: null,
  }
  if (Object.entries(data).length === 0) {
    response.statusCode = 400
    response.message = 'Formato de datos no vállido.'
    response.data = {
      path: '',
      message: 'JSON no válido',
    }
    return response
  }

  try {
    const validate = ajv.compile(schema)
    const isValid: boolean = validate(data)
    if (!isValid) {
      const errors = validate.errors?.map(error => {
        return {
          path: error.instancePath.replace('/', ''),
          message: error.message,
        }
      })
      response.statusCode = 400
      response.message = 'Formato de datos no vállido.'
      response.data = errors
    }
  } catch (error) {
    response.statusCode = 500
    response.message = 'Problemas de validación'
    response.data = error
  }
  return response
}

export default validate
