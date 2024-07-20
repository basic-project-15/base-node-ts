import type { Response, NextFunction, Request } from 'express'
import type { DataResponse } from '@interfaces'
import { jwt } from '@config'
import { UserModel } from '@api'

export const AuthenticationMiddleware = async (
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
      dataResponse.message = t('RES_INVALID_TOKEN')
      return res.status(401).send(dataResponse)
    }
    const token: string = headerToken.replace('Bearer ', '')
    if (token.length === 0) {
      dataResponse.message = t('RES_INVALID_TOKEN')
      return res.status(401).send(dataResponse)
    }
    // Validation with JWT
    const userToken = jwt.verifyToken(token)

    // Validation user
    const isUser = await UserModel.countDocuments({ _id: userToken._id })
    if (isUser === 0) {
      dataResponse.message = t('RES_INVALID_TOKEN')
      return res.status(401).send(dataResponse)
    }
    req.userToken = userToken
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      dataResponse.message = t('RES_EXPIRED_TOKEN')
      return res.status(401).send(dataResponse)
    }
    if (error.name === 'JsonWebTokenError') {
      dataResponse.message = t('RES_INVALID_TOKEN')
      return res.status(401).send(dataResponse)
    }
    dataResponse.message = t('RES_SERVER_ERROR')
    return res.status(500).send(dataResponse)
  }
}
