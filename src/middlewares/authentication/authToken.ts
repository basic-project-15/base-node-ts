import { Response, NextFunction, Request } from 'express'
import { usersModels } from '@common/models'
import { jwt } from '@core/helpers'
import { DataResponse } from '@interfaces'

const authToken = async (req: Request, res: Response, next: NextFunction) => {
  const dataResponse: DataResponse = { message: '', data: null }
  try {
    // Validation token
    const headerToken: string = req.headers.authorization ?? ''
    if (!headerToken?.toLowerCase().startsWith('bearer')) {
      dataResponse.message = 'Token no válido'
      return res.status(401).send(dataResponse)
    }
    const token: string = headerToken.replace('Bearer ', '')
    if (!token) {
      dataResponse.message = 'Token no válido'
      return res.status(401).send(dataResponse)
    }
    // Validation with JWT
    const userToken = jwt.verifyToken(token)

    // Validation user
    const user = await usersModels.findById(userToken.id).exec()
    if (!user) {
      dataResponse.message = 'Token no válido'
      return res.status(401).send(dataResponse)
    }
    req.user = userToken
    return next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      dataResponse.message = 'Token expirado'
      return res.status(401).send(dataResponse)
    }
    if (error.name === 'JsonWebTokenError') {
      dataResponse.message = 'Token no válido'
      return res.status(401).send(dataResponse)
    }
    dataResponse.message = 'Problema interno del servidor'
    return res.status(500).send(dataResponse)
  }
}

export default authToken
