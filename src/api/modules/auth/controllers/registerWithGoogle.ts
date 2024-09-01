import type { Request, Response } from 'express'
import type { IDataResponse } from '@interfaces'
import * as AuthServices from '@authModule/services'
import { CustomError, getErrorResponse, sendEmail } from '@common'

export const registerWithGoogle = async (req: Request, res: Response) => {
  let dataResponse: IDataResponse = { message: '', data: null }
  let statusCode = 500
  const { body, t, lng } = req
  try {
    // Verify Google idToken
    const idToken: string = body.idToken
    const payload = await AuthServices.verifyGoogleIdToken(idToken)

    // Verify used email
    const newEmail: string = body.email
    const anotherUser = await AuthServices.verifyExistEmail(newEmail)
    if (anotherUser != null) throw CustomError('USER_ALREADY_EXISTS', 409)

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
    await sendEmail(lng, {
      recipients: { to: [`${user.firstName} <${user.email}>`] },
      subject: t.USER_CREATED,
      templateBody: 'registerUser',
    })

    // Generate tokens
    const tokens = await AuthServices.generateTokens(user._id.toString())

    // Response
    statusCode = 200
    dataResponse.message = t.USER_CREATED
    dataResponse.data = { user, tokens }
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}
