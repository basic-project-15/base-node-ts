import type { Request, Response } from 'express'
import type { DataResponse } from '@interfaces'
import * as AuthServices from '@authModule/services'
import { getErrorResponse } from '@core'

export const loginRefreshTokens = async (req: Request, res: Response) => {
  let dataResponse: DataResponse = { message: '', data: null }
  let statusCode = 500
  const { body, t } = req
  try {
    const refreshToken: string = body.refreshToken

    // Validate refreshToken
    const user = await AuthServices.validateRefreshToken(refreshToken)

    // Generate tokens
    const tokens = await AuthServices.generateTokens(
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
