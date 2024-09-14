import type { Request, Response } from 'express'
import type { IDataResponse } from '@interfaces'
import { getErrorResponse } from '@common'
import * as AuthServices from '@api/auth/services'
import * as ProfileServices from '@api/profile/services'

export const updateEmail = async (req: Request, res: Response) => {
  let dataResponse: IDataResponse = { message: '', data: null }
  let statusCode = 500
  const { body, t, userToken } = req
  try {
    const currentIdUser: string = userToken._id
    const newEmail: string = body.email
    const otp: string = body.otp

    // Validate OTP
    await AuthServices.verifyOtp(newEmail, otp)

    // Update email
    const user = await ProfileServices.updateEmail(currentIdUser, newEmail)
    delete user.password
    delete user.incorrectPassword
    delete user.refreshToken

    // Destroy OTP
    await AuthServices.destroyOtp(newEmail, otp)

    // Generate tokens
    const tokens = await AuthServices.generateTokens(user._id.toString())

    // Resposne
    statusCode = 200
    dataResponse.message = t.PROFILE_EMAIL_UPDATED
    dataResponse.data = { user, tokens }
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}
