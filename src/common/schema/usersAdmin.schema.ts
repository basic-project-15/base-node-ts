import { Type } from '@sinclair/typebox'

const create = Type.Object(
  {
    name: Type.String({
      isNotEmpty: true,
      errorMessage: {
        isNotEmpty: 'No debe ser vacío',
        type: 'Debe ser un string',
      },
    }),
    email: Type.String({
      format: 'email',
      errorMessage: {
        type: 'Debe ser un string',
        format: 'Debe ser un correo electrónico válido',
      },
    }),
    password: Type.String({
      isNotEmpty: true,
      errorMessage: {
        isNotEmpty: 'No debe ser vacío',
        type: 'Debe ser un string',
      },
    }),
    role: Type.String({
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
        email: 'El email es requerido',
        password: 'La password es requerido',
      },
    },
  },
)

export default { create }
