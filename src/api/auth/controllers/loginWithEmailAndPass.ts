// import fs from 'fs'
import type { Request, Response } from 'express'
import type { IDataResponse } from '@interfaces'
import * as AuthServices from '@api/auth/services'
import { CustomError, getErrorResponse, getHTMLFile, sendEmail } from '@common'

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
      const html = getHTMLFile(__dirname, lng, 'blockedAccount')
      await sendEmail(html, {
        recipients: { to: [`${user.firstName} <${user.email}>`] },
        subject: t.AUTH_ACCOUNT_BLOCKED,
        body: { name: user.firstName },
      })
      throw CustomError('AUTH_ACCOUNT_BLOCKED_DETAILS', 401)
    }

    // Generate tokens
    const tokens = await AuthServices.generateTokens(user._id.toString())
    delete user.password
    delete user.incorrectPassword
    delete user.refreshToken

    // Response
    statusCode = 200
    dataResponse.message = t.AUTH_AUTHENTICATED
    dataResponse.data = { user, tokens }
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}
