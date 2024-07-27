import type { Request, Response } from 'express'
import type { DataResponse } from '@interfaces'
import { UserModel } from '@common'

export const getUserById = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { params, t } = req
  const idUser: string = params.idUser
  try {
    const userFoundById = await UserModel.findById(idUser).populate([
      {
        path: 'created_by',
        select: '_id email',
      },
      {
        path: 'updated_by',
        select: '_id email',
      },
    ])
    if (userFoundById == null) {
      dataResponse.message = t.USER_NOT_FOUND
      return res.status(404).send(dataResponse)
    }

    dataResponse.message = t.USER_FOUND
    dataResponse.data = userFoundById
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
