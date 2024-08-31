import type { Request, Response } from 'express'
import type { DataResponse } from '@interfaces'
import { getErrorResponse } from '@core'
import * as ProfileServices from '@profileModule/services'

export const deleteAccount = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { t, userToken } = req
  try {
    const currentIdUser = userToken._id

    // Update password
    const user = await ProfileServices.deleteAccount(currentIdUser)
    delete user.password
    delete user.incorrectPassword
    delete user.refreshToken

    // Resposne
    statusCode = 200
    dataResponse.message = t.USER_DELETED
    dataResponse.data = { user }
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}
