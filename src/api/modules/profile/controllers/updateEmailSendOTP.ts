import type { Request, Response } from 'express'
import type { DataResponse } from '@interfaces'
import { CustomError, getErrorResponse, SendEmails } from '@core'
import * as AuthServices from '@authModule/services'

export const updateEmailSendOTP = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { body, t, lng } = req
  try {
    const newEmail: string = body.email

    // Verify used email
    const isUsedEmail = await AuthServices.verifyExistEmail(newEmail)
    if (isUsedEmail != null) throw CustomError('USER_ALREADY_EXISTS', 409)

    // Generate OTP
    const newOtp = await AuthServices.generateOtp(newEmail)

    // Send OTP
    await SendEmails.verifyEmail(
      lng,
      { name: '', email: newEmail },
      { newOtp: newOtp.otp },
    )

    // Response
    statusCode = 200
    dataResponse.message = t.USER_EMAIL_VERIFICATION_SENT
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}
