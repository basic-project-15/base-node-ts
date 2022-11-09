import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import addErrors from 'ajv-errors'

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

const validate = (data: any, schema: any) => {
  if (Object.entries(data).length === 0)
    throw { name: 'DataValidationError', data: 'Empty JSON' }
  const validate = ajv.compile(schema)
  const isValid: boolean = validate(data)
  if (!isValid) {
    const data = validate.errors?.map(error => {
      return {
        path: error.instancePath.replace('/', ''),
        message: error.message,
      }
    })
    throw { name: 'DataValidationError', data }
  }
}

export default validate
