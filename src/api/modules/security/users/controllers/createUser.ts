import type { Request, Response } from 'express'
import type { DataResponse } from '@interfaces'
import { getErrorResponse, SendEmails } from '@core'
import * as UserServices from '@securityModule/users/services'

export const createUser = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { body, t, userToken, lng } = req
  try {
    // Create user
    const currentIdUser: string = userToken._id
    const { user, temporaryPassword } = await UserServices.createUser(
      currentIdUser,
      {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
      },
    )

    // Send Email
    await SendEmails.createAccount(
      lng,
      {
        name: user?.firstName,
        email: user.email,
      },
      temporaryPassword,
    )

    // Response
    statusCode = 200
    dataResponse.message = t.USER_CREATED
    dataResponse.data = { user }
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}
