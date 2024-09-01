import type { Request, Response } from 'express'
import type { IDataResponse } from '@interfaces'
import * as AuthServices from '@authModule/services'
import { getErrorResponse } from '@common'

export const loginWithGoogle = async (req: Request, res: Response) => {
  let dataResponse: IDataResponse = { message: '', data: null }
  let statusCode = 500
  const { body, t } = req
  try {
    const idToken: string = body.idToken

    // Validate idToken
    const user = await AuthServices.validateIdTokenGoogle(idToken)
    delete user.password
    delete user.incorrectPassword
    delete user.refreshToken

    // Generate tokens
    const tokens = await AuthServices.generateTokens(user._id.toString())

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
