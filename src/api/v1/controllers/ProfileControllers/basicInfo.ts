import type { Request, Response } from 'express'
import { Types } from 'mongoose'
import type { DataResponse } from '@interfaces'
import { UserModel } from '@common'

export const getProfile = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { userToken, t } = req
  try {
    const users = await UserModel.aggregate([
      {
        $match: { email: userToken.email, state: true },
      },
      {
        $project: {
          id: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
          phoneNumber: 1,
          photo: 1,
        },
      },
    ])
    if (users.length === 0) {
      dataResponse.message = t.USER_NOT_FOUND
      return res.status(404).send(dataResponse)
    }

    const user = users[0]
    dataResponse.message = t.USER_FOUND
    dataResponse.data = user
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

export const updateProfile = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { body, t, userToken } = req
  try {
    const userFoundById = await UserModel.findById(userToken._id)
    if (userFoundById == null) {
      dataResponse.message = t.USER_NOT_FOUND
      return res.status(404).send(dataResponse)
    }

    userFoundById.firstName = body.firstName ?? userFoundById.firstName
    userFoundById.lastName = body.lastName ?? userFoundById.lastName
    userFoundById.phoneNumber = body.phoneNumber ?? userFoundById.phoneNumber
    userFoundById.photo = body.photo ?? userFoundById.photo
    userFoundById.updated_at = new Date()
    userFoundById.updated_by = new Types.ObjectId(userToken._id)

    await userFoundById.save()
    dataResponse.message = t.USER_UPDATED
    dataResponse.data = {
      firstName: userFoundById.firstName,
      lastName: userFoundById.lastName,
      phoneNumber: userFoundById.phoneNumber,
      photo: userFoundById.photo,
    }
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
