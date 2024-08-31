import type { Request, Response } from 'express'
import type { DataResponse } from '@interfaces'
import * as AuthServices from '@authModule/services'
import { CustomError, getErrorResponse, SendEmails } from '@core'

export const registerWithEmailAndPass = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { body, t, lng } = req
  try {
    // Verify used email
    const newEmail: string = body.email
    const anotherUser = await AuthServices.verifyExistEmail(newEmail)
    if (anotherUser != null) throw CustomError('USER_ALREADY_EXISTS', 409)

    // Register user
    const user = await AuthServices.registerWithEmailAndPass({
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
    const tokens = await AuthServices.generateTokens(
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
