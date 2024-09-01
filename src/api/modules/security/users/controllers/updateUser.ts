import type { Request, Response } from 'express'
import type { IDataResponse } from '@interfaces'
import { getErrorResponse } from '@common'
import * as UserServices from '@securityModule/users/services'

export const updateUser = async (req: Request, res: Response) => {
  let dataResponse: IDataResponse = { message: '', data: null }
  let statusCode = 500
  const { body, params, t, userToken } = req
  try {
    // Update user
    const currentIdUser: string = userToken._id
    const idUser: string = params.idUser
    const user = await UserServices.updateUser(currentIdUser, {
      idUser,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      state: body.state,
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
