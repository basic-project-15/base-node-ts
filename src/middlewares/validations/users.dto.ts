import { Request, Response, NextFunction } from 'express'
import { Type } from '@sinclair/typebox'
import { validateAJV } from '@core/helpers'
import { DataResponse } from '@interfaces'

const createUser = (req: Request, res: Response, next: NextFunction) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { body } = req
  try {
    const createUserSchema = Type.Object(
      {
        name: Type.String({
          isNotEmpty: true,
          errorMessage: {
            isNotEmpty: 'No debe estar vacío',
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
            isNotEmpty: 'No debe estar vacío',
            type: 'Debe ser un string',
          },
        }),
        role: Type.String({
          isNotEmpty: true,
          errorMessage: {
            isNotEmpty: 'No debe estar vacío',
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
    validateAJV(body, createUserSchema)
  } catch (error) {
    dataResponse.message = 'Formato de datos no válido.'
    dataResponse.data = error
    return res.status(400).send(dataResponse)
  }
  return next()
}

const updateUser = (req: Request, res: Response, next: NextFunction) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { body } = req
  try {
    const updateUserSchema = Type.Object(
      {
        name: Type.Optional(
          Type.String({
            isNotEmpty: true,
            errorMessage: {
              isNotEmpty: 'No debe estar vacío',
              type: 'Debe ser un string',
            },
          }),
        ),
        email: Type.Optional(
          Type.String({
            format: 'email',
            errorMessage: {
              type: 'Debe ser un string',
              format: 'Debe ser un correo electrónico válido',
            },
          }),
        ),
        password: Type.Optional(
          Type.String({
            isNotEmpty: true,
            errorMessage: {
              isNotEmpty: 'No debe estar vacío',
              type: 'Debe ser un string',
            },
          }),
        ),
        role: Type.Optional(
          Type.String({
            isNotEmpty: true,
            errorMessage: {
              isNotEmpty: 'No debe estar vacío',
              type: 'Debe ser un string',
            },
          }),
        ),
      },
      {
        additionalProperties: false,
        errorMessage: {
          type: 'Debe ser un objeto',
          additionalProperties: 'El formato del objeto no es válido',
        },
      },
    )
    validateAJV(body, updateUserSchema)
  } catch (error) {
    dataResponse.message = 'Formato de datos no válido.'
    dataResponse.data = error
    return res.status(400).send(dataResponse)
  }
  return next()
}

const login = (req: Request, res: Response, next: NextFunction) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { body } = req
  try {
    const loginSchema = Type.Object(
      {
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
            isNotEmpty: 'No debe estar vacío',
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
    validateAJV(body, loginSchema)
  } catch (error) {
    dataResponse.message = 'Formato de datos no válido.'
    dataResponse.data = error
    return res.status(400).send(dataResponse)
  }
  return next()
}

export default { createUser, updateUser, login }
