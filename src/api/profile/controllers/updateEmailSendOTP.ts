import type { Request, Response } from 'express'
import type { IDataResponse } from '@interfaces'
import { getErrorResponse, getHTMLFile, sendEmail } from '@common'
import * as AuthServices from '@api/auth/services'

export const updateEmailSendOTP = async (req: Request, res: Response) => {
  let dataResponse: IDataResponse = { message: '', data: null }
  let statusCode = 500
  const { body, t, lng } = req
  try {
    const newEmail: string = body.email

    // Generate OTP
    const newOtp = await AuthServices.generateOtpExternalUser(newEmail)

    // Send OTP
    const html = getHTMLFile(__dirname, lng, 'verifyEmail')
    await sendEmail(html, {
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
