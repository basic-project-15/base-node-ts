import type { Request, Response } from 'express'
import type { DataResponse } from '@interfaces'
import { AccountHandlers } from '@api/v1'
import { CustomError, getErrorResponse, SendEmails } from '@core'

export const loginWithEmailAndPass = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { body, t, lng } = req
  try {
    const email: string = body.email
    const password: string = body.password

    // Validate email and password
    const result = await AccountHandlers.validateEmailAndPass(email, password)
    const { user, isSendEmail } = result
    if (isSendEmail) {
      await SendEmails.blockedAccount(lng, {
        name: user?.firstName,
        email,
      })
      throw CustomError('USER_BLOCKED_DETAILS', 401)
    }

    // Generate tokens
    const tokens = await AccountHandlers.generateTokens(
      user._id.toString(),
      user.email,
      user.passwordVersion,
    )
    delete user.password
    delete user.incorrectPassword
    delete user.refreshToken

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
    const user = await AccountHandlers.validateIdTokenGoogle(idToken)
    delete user.password
    delete user.incorrectPassword
    delete user.refreshToken

    // Generate tokens
    const tokens = await AccountHandlers.generateTokens(
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

export const registerWithEmailAndPass = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { body, t, lng } = req
  try {
    // Verify used email
    const newEmail: string = body.email
    const anotherUser = await AccountHandlers.verifyExistEmail(newEmail)
    if (anotherUser != null) throw CustomError('USER_ALREADY_EXISTS', 409)

    // Register user
    const user = await AccountHandlers.registerWithEmailAndPass({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phoneNumber: body.phoneNumber,
      photo: body.photo,
      password: body.password,
    })
    delete user.password
    delete user.incorrectPassword
    delete user.refreshToken

    // Send Email
    await SendEmails.registerUser(lng, {
      name: user?.firstName,
      email: user.email,
    })

    // Generate tokens
    const tokens = await AccountHandlers.generateTokens(
      user._id.toString(),
      user.email,
      user.passwordVersion,
    )

    // Response
    statusCode = 200
    dataResponse.message = t.USER_CREATED
    dataResponse.data = { user, tokens }
  } catch (error) {
    statusCode = typeof error.code === 'number' ? error.code : 500
    dataResponse = getErrorResponse(t, error)
  }
  return res.status(statusCode).send(dataResponse)
}

export const registerWithGoogle = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { body, t, lng } = req
  try {
    // Register user
    const idToken: string = body.idToken
    const user = await AccountHandlers.registerWithGoogle(idToken)
    delete user.password
    delete user.incorrectPassword
    delete user.refreshToken

    // Send Email
    await SendEmails.registerUser(lng, {
      name: user?.firstName,
      email: user.email,
    })

    // Generate tokens
    const tokens = await AccountHandlers.generateTokens(
      user._id.toString(),
      user.email,
      user.passwordVersion,
    )

    // Response
    statusCode = 200
    dataResponse.message = t.USER_CREATED
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
    const user = await AccountHandlers.validateRefreshToken(refreshToken)

    // Generate tokens
    const tokens = await AccountHandlers.generateTokens(
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

export const recoveryAccountSendOtp = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { body, t, lng } = req
  try {
    const email: string = body.email

    // Verify exist email
    const user = await AccountHandlers.verifyExistEmail(email)
    if (user == null) throw CustomError('USER_OTP_SENT', 200)

    // Generate OTP
    const newOtp = await AccountHandlers.generateOtp(email)

    // Send OTP
    await SendEmails.recoveryAccount(
      lng,
      { name: user.firstName, email: user.email },
      { newOtp: newOtp.otp },
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
    const newPassword: string = body.newPassword

    // Validate OTP
    await AccountHandlers.verifyOtp(email, otp)

    // Recovery account
    const user = await AccountHandlers.recoveryAccount(email, newPassword)
    delete user.password
    delete user.incorrectPassword
    delete user.refreshToken

    // Destroy OTP
    await AccountHandlers.destroyOtp(email, otp)

    // Generate tokens
    const tokens = await AccountHandlers.generateTokens(
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
