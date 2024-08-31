import type { Request, Response } from 'express'
import type { DataResponse } from '@interfaces'
import { getErrorResponse } from '@core'
import * as UserServices from '@securityModule/users/services'

export const getUserById = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { params, t } = req
  try {
    // Get user
    const idUser: string = params.idUser
    const user = await UserServices.getUserById(idUser)

    // Response
    statusCode = 200
    dataResponse.message = t.USER_FOUND
    dataResponse.data = { user }
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}
