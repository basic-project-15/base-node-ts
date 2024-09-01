import type { Request, Response } from 'express'
import type { IDataResponse } from '@interfaces'
import { getErrorResponse } from '@common'
import * as ProfileServices from '@profileModule/services'

export const updateProfile = async (req: Request, res: Response) => {
  let dataResponse: IDataResponse = { message: '', data: null }
  let statusCode = 500
  const { body, t, userToken } = req
  try {
    // Update profile
    const currentIdUser: string = userToken._id
    const user = await ProfileServices.updateProfile(currentIdUser, {
      firstName: body.firstName,
      lastName: body.lastName,
      phoneNumber: body.phoneNumber,
      photo: body.photo,
    })

    // Response
    statusCode = 200
    dataResponse.message = t.USER_UPDATED
    dataResponse.data = { user }
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}
