import type { Request, Response } from 'express'
import type { IDataResponse } from '@interfaces'
import * as AuthServices from '@api/auth/services'
import { getErrorResponse, sendEmail } from '@common'
import path from 'path'

export const recoveryAccountSendOtp = async (req: Request, res: Response) => {
  let dataResponse: IDataResponse = { message: '', data: null }
  let statusCode = 500
  const { body, t, lng } = req
  try {
    const email: string = body.email

    // Generate OTP
    const { newOtp, user } = await AuthServices.generateOtpInternalUser(email)

    // Send OTP
    const languagesDir = path.resolve(__dirname, '..', 'languages')
    const filePath = path.join(languagesDir, `${lng}/recoveryAccount.html`)
    await sendEmail(filePath, {
      recipients: { to: [`${user.firstName} <${user.email}>`] },
      subject: t.AUTH_ACCOUNT_RECOVERY,
      body: {
        name: user.firstName,
        newOtp: newOtp.otp,
      },
    })

    // Response
    statusCode = 200
    dataResponse.message = t.AUTH_OTP_SENT
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}
