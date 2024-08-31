import type { Request, Response } from 'express'
import type { DataResponse } from '@interfaces'
import { getErrorResponse } from '@core'
import * as ProfileServices from '@profileModule/services'

export const getProfile = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { t, userToken } = req
  try {
    // Get profile
    const user = await ProfileServices.getProfile(userToken.email)

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
