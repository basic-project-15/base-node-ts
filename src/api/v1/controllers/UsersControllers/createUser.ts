import type { Request, Response } from 'express'
import { hash } from 'bcrypt'
import { Types } from 'mongoose'
import type { DataResponse, IUser } from '@interfaces'
import { bcrypt } from '@config'
import { UserModel } from '@common'
import { SendEmails } from '@core'

export const createUser = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { body, t, lng, userToken } = req
  try {
    const userFoundByEmail = await UserModel.findOne({ email: body.email })
    if (userFoundByEmail != null) {
      dataResponse.message = t.USER_ALREADY_EXISTS
      return res.status(409).send(dataResponse)
    }

    const temporaryPassword = Math.random().toString(36).slice(-10)
    const newPassword = await hash(temporaryPassword, bcrypt.SALT)
    const newUser: IUser = {
      firstName: body.firstName,
      lastName: body.lastName,
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
    dataResponse.data = { _id: userModel.id, ...newUser }

    const result = await SendEmails.createUser(
      lng,
      {
        name: body.firstName,
        email: body.email,
      },
      temporaryPassword,
    )
    if (result.success) {
      dataResponse.message = t.USER_CREATED_WITHOUT_NOTIFICATION
      dataResponse.data = result
      return res.status(207).send(dataResponse)
    }
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
