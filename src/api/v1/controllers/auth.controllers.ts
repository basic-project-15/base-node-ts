import { Request, Response } from 'express'
import { compare } from 'bcrypt'
import { DataResponse } from '@interfaces'
import { rolesModels, usersModels } from '@common/models'
import { jwt } from '@core/helpers'
import { Role } from '@interfaces'

const login = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { body, t } = req
  try {
    // Validations
    const user = await usersModels.findOne({ email: body.email }).exec()
    const roleFound = await rolesModels.findById(user?.idRole).exec()
    if (!user) {
      dataResponse.message = t('RES_InvalidCredentials')
      return res.status(401).send(dataResponse)
    }
    if (!roleFound) {
      dataResponse.message = t('RES_ServerError')
      return res.status(500).send(dataResponse)
    }
    const checkPassword = await compare(body.password, user.password)
    if (!checkPassword) {
      dataResponse.message = t('RES_InvalidCredentials')
      return res.status(401).send(dataResponse)
    }

    // Actions
    const userFormat = {
      _id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      photo: user.photo,
      created_at: user.created_at,
      created_by: user.created_by,
      updated_at: user.updated_at,
      updated_by: user.updated_by,
      idRole: user.idRole,
      role: roleFound,
    }
    const token = jwt.generateToken({
      _id: userFormat._id,
      email: userFormat.email,
      role: userFormat.role as Role,
    })
    dataResponse.message = t('USERS_Login')
    dataResponse.data = {
      user: userFormat,
      token,
    }
    return res.status(200).send(dataResponse)
  } catch (error) {
    console.log(error)
    dataResponse.message = t('RES_ServerError')
    dataResponse.data = error
    return res.status(500).send(dataResponse)
  }
}

export default { login }
