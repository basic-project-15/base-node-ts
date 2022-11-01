import auth from 'basic-auth'
import { Request, Response, NextFunction } from 'express'

const authBasic = (req: Request, res: Response, next: NextFunction) => {
  const user = auth(req)
  const email: string = user?.name ?? ''
  const password: string = user?.pass ?? ''
  if (!email || !password) {
    return res.status(401).send({
      message: 'Aplicación no autorizada',
      data: null,
    })
  }
  if (
    email !== process.env.BASIC_AUTH_EMAIL ||
    password !== process.env.BASIC_AUTH_PASSWORD
  ) {
    return res.status(401).send({
      message: 'Aplicación no autorizada',
      data: null,
    })
  }
  return next()
}

export default authBasic
