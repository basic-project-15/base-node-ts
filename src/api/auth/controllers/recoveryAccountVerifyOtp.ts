import type { Request, Response } from 'express'
import type { IDataResponse } from '@interfaces'
import * as AuthServices from '@api/auth/services'
import { getErrorResponse } from '@common'

export const recoveryAccountVerifyOtp = async (req: Request, res: Response) => {
  let dataResponse: IDataResponse = { message: '', data: null }
  let statusCode = 500
  const { body, t } = req
  try {
    const otp: string = body.otp
    const email: string = body.email

    // Verify OTP
    await AuthServices.verifyOtp(email, otp)

    // Response
    statusCode = 200
    dataResponse.message = t.AUTH_OTP_VALID
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}
