import auth from 'basic-auth'
import { Request, Response, NextFunction } from 'express'
import { DataResponse } from '@interfaces'

const authBasic = (req: Request, res: Response, next: NextFunction) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { t } = req
  const user = auth(req)
  const email: string = user?.name ?? ''
  const password: string = user?.pass ?? ''
  if (
    !email ||
    !password ||
    email !== process.env.BASIC_AUTH_EMAIL ||
    password !== process.env.BASIC_AUTH_PASSWORD
  ) {
    dataResponse.message = t('RES_Application')
    return res.status(401).send(dataResponse)
  }
  return next()
}

export default authBasic
