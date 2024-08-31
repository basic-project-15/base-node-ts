import type { Request, Response } from 'express'
import type { DataResponse } from '@interfaces'
import * as AuthServices from '@authModule/services'
import { CustomError, getErrorResponse, SendEmails } from '@core'

export const loginWithEmailAndPass = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { body, t, lng } = req
  try {
    const email: string = body.email
    const password: string = body.password

    // Validate email and password
    const result = await AuthServices.validateEmailAndPass(email, password)
    const { user, isSendEmail } = result
    if (isSendEmail) {
      await SendEmails.blockedAccount(lng, {
        name: user?.firstName,
        email,
      })
      throw CustomError('USER_BLOCKED_DETAILS', 401)
    }

    // Generate tokens
    const tokens = await AuthServices.generateTokens(
      user._id.toString(),
      user.email,
      user.passwordVersion,
    )
    delete user.password
    delete user.incorrectPassword
    delete user.refreshToken

    // Response
    statusCode = 200
    dataResponse.message = t.USER_AUTHENTICATED
    dataResponse.data = { user, tokens }
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}
