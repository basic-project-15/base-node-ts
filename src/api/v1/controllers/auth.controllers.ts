import { Request, Response } from 'express'
import { compare } from 'bcrypt'
import { UserLogin, UserToken } from '@interfaces'
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
    const token = jwt.generateToken(userFormat)
    return res.status(200).send({
      message: 'Usuario autenticado',
      data: {
        user: {
          ...userFormat,
          permissions: user.permissions,
        },
        paths: Object.values(Paths),
        methods: Object.values(Methods),
        token,
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
