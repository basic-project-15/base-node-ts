import { Request, Response } from 'express'
import { compare } from 'bcrypt'
import { UserAdminLogin, UserToken } from '@interfaces/index'
import { usersAdminModels } from '@common/models'
import { jwt } from '@core/helpers'

const loginAdmin = async (req: Request, res: Response) => {
  const { body } = req
  try {
    const newUser: UserAdminLogin = {
      email: body.email,
      password: body.password,
    }

    // Validations
    const userAdmin = await usersAdminModels
      .findOne({ email: newUser.email })
      .exec()
    if (!userAdmin) {
      return res.status(401).send({
        message: 'Credenciales no válidas',
        data: null,
      })
    }
    const checkPassword = await compare(
      newUser.password,
      userAdmin.password ?? '',
    )
    if (!checkPassword) {
      return res.status(401).send({
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
    const response = jwt.generateToken(userAdminFormat)
    const { statusCode, message, token } = response
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
