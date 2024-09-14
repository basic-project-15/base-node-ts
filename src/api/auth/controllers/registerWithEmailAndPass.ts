import type { Request, Response } from 'express'
import type { IDataResponse } from '@interfaces'
import * as AuthServices from '@api/auth/services'
import { getErrorResponse, getHTMLFile, sendEmail } from '@common'

export const registerWithEmailAndPass = async (req: Request, res: Response) => {
  let dataResponse: IDataResponse = { message: '', data: null }
  let statusCode = 500
  const { body, t, lng } = req
  try {
    // Create user
    const user = await AuthServices.createUser({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phoneNumber: body.phoneNumber,
      photo: body.photo,
      password: body.password,
    })
    delete user.password
    delete user.incorrectPassword
    delete user.refreshToken

    // Send Email
    const html = getHTMLFile(__dirname, lng, 'registerUser')
    await sendEmail(html, {
      recipients: { to: [`${user.firstName} <${user.email}>`] },
      subject: t.AUTH_ACCOUNT_REGISTRED,
    })

    // Generate tokens
    const tokens = await AuthServices.generateTokens(user._id.toString())

    // Response
    statusCode = 200
    dataResponse.message = t.AUTH_ACCOUNT_REGISTRED
    dataResponse.data = { user, tokens }
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}
