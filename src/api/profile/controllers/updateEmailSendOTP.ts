import type { Request, Response } from 'express'
import type { IDataResponse } from '@interfaces'
import { getErrorResponse, sendEmail } from '@common'
import * as AuthServices from '@api/auth/services'
import path from 'path'

export const updateEmailSendOTP = async (req: Request, res: Response) => {
  let dataResponse: IDataResponse = { message: '', data: null }
  let statusCode = 500
  const { body, t, lng } = req
  try {
    const newEmail: string = body.email

    // Generate OTP
    const newOtp = await AuthServices.generateOtpExternalUser(newEmail)

    // Send OTP
    const languagesDir = path.resolve(__dirname, '..', 'languages')
    const filePath = path.join(languagesDir, `${lng}/verifyEmail.html`)
    await sendEmail(filePath, {
      recipients: { to: [`<${newEmail}>`] },
      subject: t.PROFILE_EMAIL_VERIFICATION,
      body: {
        name: '',
        newOtp: newOtp.otp,
      },
    })

    // Response
    statusCode = 200
    dataResponse.message = t.PROFILE_EMAIL_VERIFICATION_SENT
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}
