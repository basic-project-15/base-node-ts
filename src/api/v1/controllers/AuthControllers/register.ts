import type { Request, Response } from 'express'
import { hash } from 'bcrypt'
import type { DataResponse, IUser } from '@interfaces'
import { bcrypt } from '@config'
import { UserModel } from '@common'

export const registerWithEmailAndPass = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { body, t } = req
  try {
    const userFoundByEmail = await UserModel.findOne({ email: body.email })
    if (userFoundByEmail != null) {
      dataResponse.message = t.USER_ALREADY_EXISTS
      return res.status(409).send(dataResponse)
    }

    const newPassword = await hash(body.password, bcrypt.SALT)
    const newUser: IUser = {
      firstName: body.firstName,
      lastName: body?.lastName ?? '',
      email: body.email,
      phoneNumber: body?.phoneNumber ?? '',
      photo: body?.photo ?? '',
      password: newPassword,
      passwordVersion: 1,
      roleIds: [],
      created_at: new Date(),
      state: true,
    }
    const userModel = new UserModel(newUser)
    await userModel.save()

    dataResponse.data = { _id: userModel.id, ...newUser }
    dataResponse.message = t.USER_CREATED
    return res.status(200).send(dataResponse)
  } catch (error) {
    dataResponse.message = t.RES_SERVER_ERROR
    dataResponse.data = {
      name: error.name,
      message: error.message,
    }
    return res.status(500).send(dataResponse)
  }
}
