import type { Request, Response } from 'express'
import type { DataResponse } from '@interfaces'
import { CustomError, getErrorResponse } from '@core'
import * as AuthServices from '@authModule/services'
import * as ProfileServices from '@profileModule/services'

export const updateEmail = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { body, t, userToken } = req
  try {
    const currentIdUser: string = userToken._id
    const newEmail: string = body.email
    const otp: string = body.otp

    // Verify used email
    const isUsedEmail = await AuthServices.verifyExistEmail(newEmail)
    if (isUsedEmail != null) throw CustomError('USER_ALREADY_EXISTS', 409)

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
    const tokens = await AuthServices.generateTokens(
      user._id.toString(),
      user.email,
      user.passwordVersion,
    )

    // Resposne
    statusCode = 200
    dataResponse.message = t.USER_UPDATED
    dataResponse.data = { user, tokens }
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}
