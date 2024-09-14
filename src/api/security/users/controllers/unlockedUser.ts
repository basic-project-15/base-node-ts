import type { Request, Response } from 'express'
import type { IDataResponse } from '@interfaces'
import { getErrorResponse } from '@common'
import * as UserServices from '@api/security/users/services'

export const unlockedUser = async (req: Request, res: Response) => {
  let dataResponse: IDataResponse = { message: '', data: null }
  let statusCode = 500
  const { params, t, userToken } = req
  try {
    // Disable user
    const currentIdUser: string = userToken._id
    const idUser: string = params.idUser
    const user = await UserServices.unlockedUser(currentIdUser, idUser)

    // Response
    statusCode = 200
    dataResponse.message = t.USER_UNLOCKED
    dataResponse.data = { user }
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}
