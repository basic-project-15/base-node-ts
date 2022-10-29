import { Request, Response } from 'express'
import { compare } from 'bcrypt'
import { UsersAdminLogin, UserToken } from '@interfaces/index'
import { usersAdminModels } from '@common/models'
import { jwt } from '@core/helpers'

const loginAdmin = async (req: Request, res: Response) => {
  const { body } = req
  try {
    const newUser: UsersAdminLogin = {
      email: body.email,
      password: body.password,
    }

    // Validations
    const userAdmin = await usersAdminModels
      .findOne({ email: newUser.email })
      .exec()
    if (!userAdmin) {
      return res.status(400).send({
        message: 'Credenciales no válidas',
        data: null,
      })
    }
    const checkPassword = await compare(
      newUser.password,
      userAdmin.password ?? '',
    )
    if (!checkPassword) {
      return res.status(400).send({
        message: 'Credenciales no válidas',
        data: null,
      })
    }

    // Actions
    const userAdminFormat: UserToken = {
      id: userAdmin.id,
      email: userAdmin.email ?? '',
      role: userAdmin.role ?? '',
    }
    const dataResponse = jwt.generateToken(userAdminFormat)
    const { statusCode, message, token } = dataResponse
    return res.status(statusCode).send({
      message,
      data: { ...userAdminFormat, token },
    })
  } catch (error) {
    return res.status(500).send({
      message: 'Problema interno del servidor',
      data: error,
    })
  }
}

export default { loginAdmin }
