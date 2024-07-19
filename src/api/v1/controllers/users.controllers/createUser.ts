import type { Request, Response } from 'express'
import { hash } from 'bcrypt'
import { Types } from 'mongoose'
import type { DataResponse, IUser } from '@interfaces'
import { bcrypt } from '@config'
import { UserModel } from '@api/v1'

export const createUser = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { body, t, userToken } = req
  try {
    const userFoundByEmail = await UserModel.findOne({ email: body.email })
    if (userFoundByEmail != null) {
      dataResponse.message = t('USER_ALREADY_EXISTS')
      return res.status(409).send(dataResponse)
    }

    const newPassword = await hash('New_1234', bcrypt.SALT)
    const newUser: IUser = {
      name: body.name,
      surname: body.surname,
      email: body.email,
      password: newPassword,
      passwordVersion: 1,
      roleIds: [],
      created_at: new Date(),
      created_by: new Types.ObjectId(userToken._id),
      state: true,
    }
    const userModel = new UserModel(newUser)
    await userModel.save()
    dataResponse.message = t('USER_CREATED')
    dataResponse.data = { _id: userModel.id, ...newUser }
    return res.status(200).send(dataResponse)
  } catch (error) {
    dataResponse.message = t('RES_SERVER_ERROR')
    dataResponse.data = error
    return res.status(500).send(dataResponse)
  }
}
