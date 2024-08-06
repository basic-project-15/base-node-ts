import type { Request, Response } from 'express'
import type { DataResponse } from '@interfaces'
import { CustomError, getErrorResponse, SendEmails } from '@core'
import { AccountHandlers, LoginHandlers, ProfileHandlers } from '@api/v1'

export const getProfile = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { t, userToken } = req
  try {
    // Get profile
    const user = await ProfileHandlers.getProfile(userToken.email)

    // Response
    statusCode = 200
    dataResponse.message = t.USER_FOUND
    dataResponse.data = { user }
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}

export const updateProfile = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { body, t, userToken } = req
  try {
    // Update profile
    const user = await ProfileHandlers.updateProfile(userToken._id, {
      firstName: body.firstName ?? '',
      lastName: body.lastName ?? '',
      phoneNumber: body.phoneNumber ?? '',
      photo: body.photo ?? '',
    })

    // Response
    statusCode = 200
    dataResponse.message = t.USER_UPDATED
    dataResponse.data = { user }
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}

export const updateEmailSendOTP = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { body, t, lng, userToken } = req
  try {
    const email = userToken.email
    const newEmail: string = body.email

    // Verify used email
    const isUsedEmail = await AccountHandlers.verifyAnotherEmail(newEmail)
    if (isUsedEmail) throw CustomError('USER_ALREADY_EXISTS', 409)

    // Generate OTP
    const { newOtp, user } = await AccountHandlers.generateOtp(email)

    // Send OTP
    await SendEmails.verifyEmail(
      lng,
      { name: user.firstName, email: body.email },
      { newOtp },
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

export const updateEmail = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { body, t, userToken } = req
  try {
    const idUser: string = userToken._id
    const newEmail: string = body.email
    const otp: string = body.otp

    // Verify used email
    const isUsedEmail = await AccountHandlers.verifyAnotherEmail(newEmail)
    if (isUsedEmail) throw CustomError('USER_ALREADY_EXISTS', 409)

    // Validate OTP
    await AccountHandlers.verifyOtp(newEmail, otp)

    // Update email
    const user = await ProfileHandlers.updateEmail(idUser, newEmail)

    // Destroy OTP
    await AccountHandlers.destroyOtp(newEmail, otp)

    // Generate tokens
    const tokens = await LoginHandlers.generateTokens(
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

export const updatePassword = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { body, t, userToken } = req
  try {
    const idUser = userToken._id
    const oldPassword: string = body.password ?? ''
    const newPassword: string = body.newPassword ?? ''

    // Update password
    const user = await ProfileHandlers.updatePassword(
      idUser,
      oldPassword,
      newPassword,
    )

    // Generate tokens
    const tokens = await LoginHandlers.generateTokens(
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
