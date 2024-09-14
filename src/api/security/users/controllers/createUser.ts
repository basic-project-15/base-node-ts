import type { Request, Response } from 'express'
import type { IDataResponse } from '@interfaces'
import { getErrorResponse, sendEmail } from '@common'
import * as UserServices from '@api/security/users/services'
import path from 'path'

export const createUser = async (req: Request, res: Response) => {
  let dataResponse: IDataResponse = { message: '', data: null }
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
    const languagesDir = path.resolve(__dirname, '..', 'languages')
    const filePath = path.join(languagesDir, `${lng}/createAccount.html`)
    await sendEmail(filePath, {
      recipients: { to: [`${user.firstName} <${user.email}>`] },
      subject: t.USER_CREATED,
      body: {
        name: user.firstName,
        temporaryPassword,
      },
    })

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
