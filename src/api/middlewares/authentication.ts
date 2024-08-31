import type { Response, NextFunction, Request } from 'express'
import type { DataResponse } from '@interfaces'
import { jwt } from '@config'
import { MAX_FAILED_PASSWORDS, UserModel } from '@common'

export const authentication = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { t } = req
  try {
    // Validation token
    const headerToken: string = req.headers.authorization ?? ''
    if (!headerToken?.toLowerCase().startsWith('bearer')) {
      dataResponse.message = t.RES_INVALID_TOKEN
      return res.status(401).send(dataResponse)
    }
    const token: string = headerToken.replace('Bearer ', '')
    if (token.length === 0) {
      dataResponse.message = t.RES_INVALID_TOKEN
      return res.status(401).send(dataResponse)
    }
    // Validation with JWT
    const userToken = jwt.verifyAccessToken(token)

    /** Gets a valid user with their active roles and permissions
     * The user has to exist.
     * The password version has to match the user's current version.
     * The user must be active.
     */
    const userFoundById = await UserModel.findById(userToken._id)
    if (
      userFoundById == null ||
      userFoundById.passwordVersion !== userToken.passwordVersion
    ) {
      dataResponse.message = t.RES_INVALID_TOKEN
      return res.status(401).send(dataResponse)
    }
    if (!userFoundById.state) {
      dataResponse.message = t.USER_DISABLED
      return res.status(401).send(dataResponse)
    }
    const incorrectPassword: number = userFoundById.incorrectPassword ?? 0
    if (incorrectPassword >= MAX_FAILED_PASSWORDS) {
      dataResponse.message = t.USER_BLOCKED_DETAILS
      return res.status(401).send(dataResponse)
    }
    req.userToken = userToken
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      dataResponse.message = t.RES_EXPIRED_TOKEN
      return res.status(401).send(dataResponse)
    }
    if (error.name === 'JsonWebTokenError') {
      dataResponse.message = t.RES_INVALID_TOKEN
      return res.status(401).send(dataResponse)
    }
    dataResponse.message = t.RES_SERVER_ERROR
    dataResponse.data = {
      name: error.name,
      message: error.message,
    }
    return res.status(500).send(dataResponse)
  }
}
