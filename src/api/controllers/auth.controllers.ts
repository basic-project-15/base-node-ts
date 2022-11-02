import { Request, Response } from 'express'
import { compare } from 'bcrypt'
import { UserLogin, UserToken } from '@interfaces/'
import { usersModels } from '@common/models'
import { jwt } from '@core/helpers'
import { Methods, Paths } from '@common/types'

const login = async (req: Request, res: Response) => {
  const { body } = req
  try {
    const newUser: UserLogin = {
      email: body.email,
      password: body.password,
    }

    // Validations
    const user = await usersModels.findOne({ email: newUser.email }).exec()
    if (!user) {
      return res.status(401).send({
        message: 'Credenciales no válidas',
        data: null,
      })
    }
    const checkPassword = await compare(newUser.password, user.password)
    if (!checkPassword) {
      return res.status(401).send({
        message: 'Credenciales no válidas',
        data: null,
      })
    }

    // Actions
    const userFormat: UserToken = {
      id: user.id,
      email: user.email,
      role: user.role,
    }
    const response = jwt.generateToken(userFormat)
    const { statusCode, message, token } = response
    return res.status(statusCode).send({
      message,
      data: {
        ...userFormat,
        methods: Object.values(Methods),
        paths: Object.values(Paths),
        token,
        permissions: user.permissions,
      },
    })
  } catch (error) {
    return res.status(500).send({
      message: 'Problema interno del servidor',
      data: error,
    })
  }
}

export default { login }
