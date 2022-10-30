import { jwt } from '@core/helpers'
import { Response, NextFunction, Request } from 'express'

const authToken = (req: Request, res: Response, next: NextFunction) => {
  const headerToken: string = req.headers.authorization ?? ''
  if (!headerToken?.toLowerCase().startsWith('bearer')) {
    return res.status(401).send({
      message: 'Token no válido',
      data: null,
    })
  }
  const token: string = headerToken.replace('Bearer ', '')
  if (!token) {
    return res.status(401).send({
      message: 'Token no válido',
      data: null,
    })
  }
  const response = jwt.verifyToken(token)
  const { statusCode, message, data } = response
  if (statusCode !== 200) {
    return res.status(statusCode).send({ message, data })
  }
  req.user = data
  return next()
}

export default authToken
