import type { Request, Response } from 'express'
import type { IDataResponse } from '@interfaces'
import * as AuthServices from '@authModule/services'
import { CustomError, getErrorResponse, sendEmail } from '@common'

export const loginWithEmailAndPass = async (req: Request, res: Response) => {
  let dataResponse: IDataResponse = { message: '', data: null }
  let statusCode = 500
  const { body, t, lng } = req
  try {
    const email: string = body.email
    const password: string = body.password

    // Validate email and password
    const { user, isSendEmail } = await AuthServices.validateEmailAndPass(
      email,
      password,
    )

    // Notify if account is blocked
    if (isSendEmail) {
      await sendEmail(lng, {
        recipients: { to: [`${user.firstName} <${user.email}>`] },
        subject: t.USER_BLOCKED,
        templateBody: 'blockedAccount',
      })
      throw CustomError('USER_BLOCKED_DETAILS', 401)
    }

    // Generate tokens
    const tokens = await AuthServices.generateTokens(user._id.toString())
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
