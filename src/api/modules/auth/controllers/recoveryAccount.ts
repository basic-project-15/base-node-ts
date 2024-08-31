import type { Request, Response } from 'express'
import type { DataResponse } from '@interfaces'
import * as AuthServices from '@authModule/services'
import { getErrorResponse } from '@core'

export const recoveryAccount = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { body, t } = req
  try {
    const otp: string = body.otp
    const email: string = body.email
    const newPassword: string = body.newPassword

    // Validate OTP
    await AuthServices.verifyOtp(email, otp)

    // Recovery account
    const user = await AuthServices.recoveryAccount(email, newPassword)
    delete user.password
    delete user.incorrectPassword
    delete user.refreshToken

    // Destroy OTP
    await AuthServices.destroyOtp(email, otp)

    // Generate tokens
    const tokens = await AuthServices.generateTokens(
      user._id.toString(),
      user.email,
      user.passwordVersion,
    )

    // Response
    statusCode = 200
    dataResponse.message = t.USER_OTP_VALID
    dataResponse.data = { user, tokens }
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}
