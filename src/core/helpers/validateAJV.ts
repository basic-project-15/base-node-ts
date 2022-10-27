import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import addErrors from 'ajv-errors'
import { DataResponse } from '@interfaces/response'

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
    success: true,
    message: '',
  }
  const validate = ajv.compile(schema)
  const isValid: boolean = validate(data)
  if (!isValid) {
    response.success = false
    response.message = ajv.errorsText(validate.errors, {
      separator: '\n',
    })
  }
  return response
}

export default validate
