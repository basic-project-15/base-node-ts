import type { Response, NextFunction, Request } from 'express'
import auth from 'basic-auth'
import type { DataResponse } from '@interfaces'
import { jwt } from '@config'
import { MODELS } from '@api/v1'

export const basic = (req: Request, res: Response, next: NextFunction): any => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { t } = req
  const user = auth(req)
  const email: string = user?.name ?? ''
  const password: string = user?.pass ?? ''
  if (
    email.length === 0 ||
    password.length === 0 ||
    email !== process.env.BASIC_AUTH_EMAIL ||
    password !== process.env.BASIC_AUTH_PASSWORD
  ) {
    dataResponse.message = t('RES_Application')
    return res.status(401).send(dataResponse)
  }
  next()
}

export const token = async (
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
      dataResponse.message = t('RES_InvalidToken')
      return res.status(401).send(dataResponse)
    }
    const token: string = headerToken.replace('Bearer ', '')
    if (token.length === 0) {
      dataResponse.message = t('RES_InvalidToken')
      return res.status(401).send(dataResponse)
    }
    // Validation with JWT
    const userToken = jwt.verifyToken(token)

    // Validation user
    const user = await MODELS.Users.findById(userToken._id).exec()
    if (user == null) {
      dataResponse.message = t('RES_InvalidToken')
      return res.status(401).send(dataResponse)
    }
    req.userToken = userToken
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      dataResponse.message = t('RES_ExpiredToken')
      return res.status(401).send(dataResponse)
    }
    if (error.name === 'JsonWebTokenError') {
      dataResponse.message = t('RES_InvalidToken')
      return res.status(401).send(dataResponse)
    }
    dataResponse.message = t('RES_ServerError')
    return res.status(500).send(dataResponse)
  }
}
