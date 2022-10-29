import { Type } from '@sinclair/typebox'

const createUser = Type.Object(
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
        name: 'El nombre es requerido',
        email: 'El email es requerido',
        password: 'La password es requerido',
        role: 'El rol es requerido',
      },
    },
  },
)

const updateUser = Type.Object(
  {
    id: Type.String({
      isNotEmpty: true,
      errorMessage: {
        isNotEmpty: 'No debe ser vacío',
        type: 'Debe ser un string',
      },
    }),
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
        name: 'El nombre es requerido',
        email: 'El email es requerido',
        password: 'La password es requerido',
        role: 'El rol es requerido',
      },
    },
  },
)

export default { createUser, updateUser }
