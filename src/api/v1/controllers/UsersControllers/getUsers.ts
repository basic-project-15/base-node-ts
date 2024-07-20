import type { Request, Response } from 'express'
import type { DataResponse } from '@interfaces'
import { UserModel } from '@api'

export const getUsers = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { t } = req
  try {
    const users = await UserModel.aggregate([
      {
        $project: {
          id: 1,
          name: 1,
          surname: 1,
          userName: 1,
          email: 1,
          phoneNumber: 1,
          state: 1,
        },
      },
    ])
    dataResponse.message = t('USERS_LISTED')
    dataResponse.data = users
    return res.status(200).send(dataResponse)
  } catch (error) {
    dataResponse.message = t('RES_SERVER_ERROR')
    dataResponse.data = error
    return res.status(500).send(dataResponse)
  }
}
