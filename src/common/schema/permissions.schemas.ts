import { Type } from '@sinclair/typebox'

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

export default { createPermissionSchema }
