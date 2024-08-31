import type { Request, Response } from 'express'
import type { DataResponse } from '@interfaces'
import * as AuthServices from '@authModule/services'
import { getErrorResponse, SendEmails } from '@core'

export const registerWithGoogle = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { body, t, lng } = req
  try {
    // Register user
    const idToken: string = body.idToken
    const user = await AuthServices.registerWithGoogle(idToken)
    delete user.password
    delete user.incorrectPassword
    delete user.refreshToken

    // Send Email
    await SendEmails.registerUser(lng, {
      name: user?.firstName,
      email: user.email,
    })

    // Generate tokens
    const tokens = await AuthServices.generateTokens(
      user._id.toString(),
      user.email,
      user.passwordVersion,
    )

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
