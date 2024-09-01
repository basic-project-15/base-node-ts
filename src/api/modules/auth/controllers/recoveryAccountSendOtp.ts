import type { Request, Response } from 'express'
import type { IDataResponse } from '@interfaces'
import * as AuthServices from '@authModule/services'
import { CustomError, getErrorResponse, sendEmail } from '@common'

export const recoveryAccountSendOtp = async (req: Request, res: Response) => {
  let dataResponse: IDataResponse = { message: '', data: null }
  let statusCode = 500
  const { body, t, lng } = req
  try {
    const email: string = body.email

    // Verify exist email
    const user = await AuthServices.verifyExistEmail(email)
    if (user == null) throw CustomError('USER_OTP_SENT', 200)

    // Generate OTP
    const newOtp = await AuthServices.generateOtp(email)

    // Send OTP
    await sendEmail(lng, {
      recipients: { to: [`${user.firstName} <${user.email}>`] },
      subject: t.USER_ACCOUNT_RECOVERY,
      templateBody: 'recoveryAccount',
      body: {
        name: user.firstName,
        newOtp: newOtp.otp,
      },
    })

    // Response
    statusCode = 200
    dataResponse.message = t.USER_OTP_SENT
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}
