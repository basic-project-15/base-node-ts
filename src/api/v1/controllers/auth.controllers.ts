import { Request, Response } from 'express'
import { compare } from 'bcrypt'
import { DataResponse, UserLogin, UserToken } from '@interfaces'
import { usersModels } from '@common/models'
import { jwt } from '@core/helpers'
import { Methods, Paths } from '@common/types'

const login = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { body } = req
  try {
    const newUser: UserLogin = {
      email: body.email,
      password: body.password,
    }

    // Validations
    const user = await usersModels.findOne({ email: newUser.email }).exec()
    if (!user) {
      dataResponse.message = 'Credenciales no válidas'
      return res.status(401).send(dataResponse)
    }
    const checkPassword = await compare(newUser.password, user.password)
    if (!checkPassword) {
      dataResponse.message = 'Credenciales no válidas'
      return res.status(401).send(dataResponse)
    }

    // Actions
    const userFormat: UserToken = {
      id: user.id,
      email: user.email,
      role: user.role,
    }
    const token = jwt.generateToken(userFormat)
    dataResponse.message = 'Usuario autenticado'
    dataResponse.data = {
      user: {
        ...userFormat,
        permissions: user.permissions,
      },
      paths: Object.values(Paths),
      methods: Object.values(Methods),
      token,
    }
    return res.status(200).send(dataResponse)
  } catch (error) {
    dataResponse.message = 'Problema interno del servidor'
    dataResponse.data = error
    return res.status(500).send(dataResponse)
  }
}

export default { login }
