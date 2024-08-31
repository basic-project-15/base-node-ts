import type { Request, Response } from 'express'
import type { DataResponse } from '@interfaces'
import { getErrorResponse } from '@core'
import * as AuthServices from '@authModule/services'
import * as ProfileServices from '@profileModule/services'

export const updatePassword = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { body, t, userToken } = req
  try {
    const currentIdUser = userToken._id
    const oldPassword: string = body.password ?? ''
    const newPassword: string = body.newPassword ?? ''

    // Update password
    const user = await ProfileServices.updatePassword(
      currentIdUser,
      oldPassword,
      newPassword,
    )
    delete user.password
    delete user.incorrectPassword
    delete user.refreshToken

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
