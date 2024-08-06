import type { Request, Response } from 'express'
import type { DataResponse } from '@interfaces'
import { LoginHandlers, RegisterHandlers, AccountHandlers } from '@api/v1'
import { CustomError, getErrorResponse, SendEmails } from '@core'

export const loginWithEmailAndPass = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { body, t, lng } = req
  try {
    const email: string = body.email
    const password: string = body.password

    // Validate email and password
    const user = await LoginHandlers.validateEmailAndPass(
      { email, password },
      lng,
    )
    delete user.password
    delete user.incorrectPassword
    delete user.refreshToken

    // Generate tokens
    const tokens = await LoginHandlers.generateTokens(
      user._id.toString(),
      user.email,
      user.passwordVersion,
    )

    // Response
    statusCode = 200
    dataResponse.message = t.USER_AUTHENTICATED
    dataResponse.data = { user, tokens }
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}

export const loginWithGoogle = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { body, t } = req
  try {
    const idToken: string = body.idToken

    // Validate idToken
    const user = await LoginHandlers.validateLoginWithGoogle(idToken)
    delete user.password
    delete user.incorrectPassword
    delete user.refreshToken

    // Generate tokens
    const tokens = await LoginHandlers.generateTokens(
      user._id.toString(),
      user.email,
      user.passwordVersion,
    )

    // Response
    statusCode = 200
    dataResponse.message = t.USER_AUTHENTICATED
    dataResponse.data = { user, tokens }
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}

export const loginRefreshTokens = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { body, t } = req
  try {
    const refreshToken: string = body.refreshToken

    // Validate refreshToken
    const user = await LoginHandlers.validateRefreshToken(refreshToken)

    // Generate tokens
    const tokens = await LoginHandlers.generateTokens(
      user._id.toString(),
      user.email,
      user.passwordVersion,
    )

    // Response
    statusCode = 200
    dataResponse.message = t.USER_AUTHENTICATED
    dataResponse.data = { tokens }
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}

export const registerWithEmailAndPass = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { body, t } = req
  try {
    // Verify used email
    const newEmail: string = body.email
    const isUsedEmail = await AccountHandlers.verifyAnotherEmail(newEmail)
    if (isUsedEmail) throw CustomError('USER_ALREADY_EXISTS', 409)

    // Register user
    const tokens = await RegisterHandlers.registerUser({
      firstName: body.firstName ?? '',
      lastName: body.lastName ?? '',
      email: body.email ?? '',
      phoneNumber: body.phoneNumber ?? '',
      photo: body.photo ?? '',
      password: body.password ?? '',
    })

    // Response
    statusCode = 200
    dataResponse.message = t.USER_CREATED
    dataResponse.data = { tokens }
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}

export const recoveryAccountSendOtp = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { body, t, lng } = req
  try {
    const email: string = body.email

    // Generate OTP
    const { newOtp, user } = await AccountHandlers.generateOtp(email)

    // Send OTP
    await SendEmails.recoveryAccount(
      lng,
      { name: user.firstName, email: user.email },
      { newOtp },
    )

    // Response
    statusCode = 200
    dataResponse.message = t.USER_OTP_SENT
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}

export const recoveryAccountVerifyOtp = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { body, t } = req
  try {
    const otp: string = body.otp
    const email: string = body.email

    // Verify OTP
    await AccountHandlers.verifyOtp(email, otp)

    // Response
    statusCode = 200
    dataResponse.message = t.USER_OTP_VALID
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}

export const recoveryAccount = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { body, t } = req
  try {
    const otp: string = body.otp
    const email: string = body.email
    const password: string = body.password

    // Validate OTP
    await AccountHandlers.verifyOtp(email, otp)

    // Recovery account
    const user = await AccountHandlers.recoveryAccount(email, password)
    delete user.password
    delete user.incorrectPassword
    delete user.refreshToken

    // Destroy OTP
    await AccountHandlers.destroyOtp(email, otp)

    // Generate tokens
    const tokens = await LoginHandlers.generateTokens(
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
