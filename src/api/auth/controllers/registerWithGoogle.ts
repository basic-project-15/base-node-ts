import type { Request, Response } from 'express'
import type { IDataResponse } from '@interfaces'
import * as AuthServices from '@api/auth/services'
import { getErrorResponse, getHTMLFile, sendEmail } from '@common'

export const registerWithGoogle = async (req: Request, res: Response) => {
  let dataResponse: IDataResponse = { message: '', data: null }
  let statusCode = 500
  const { body, t, lng } = req
  try {
    // Verify Google idToken
    const idToken: string = body.idToken
    const payload = await AuthServices.verifyGoogleIdToken(idToken)

    // Create user
    const user = await AuthServices.createUser({
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      photo: payload.photo,
    })
    delete user.password
    delete user.incorrectPassword
    delete user.refreshToken

    // Send Email
    const html = getHTMLFile(__dirname, lng, 'registerUser')
    await sendEmail(html, {
      recipients: { to: [`${user.firstName} <${user.email}>`] },
      subject: t.AUTH_ACCOUNT_REGISTRED,
      body: { name: user.firstName },
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
