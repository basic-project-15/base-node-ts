import { Response, NextFunction, Request } from 'express'
import { usersAdminModels } from '@common/models'
import { jwt } from '@core/helpers'

const authToken = async (req: Request, res: Response, next: NextFunction) => {
  // Validation token
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

  // Validation with JWT
  const response = jwt.verifyToken(token)
  const { statusCode, message, data } = response
  if (statusCode !== 200) {
    return res.status(statusCode).send({ message, data })
  }

  // Validation user
  const userAdmin = await usersAdminModels.findById(data.id).exec()
  if (!userAdmin) {
    return res.status(401).send({
      message: 'Token no válido',
      data: null,
    })
  }
  req.user = data
  return next()
}

export default authToken
