import { Response, NextFunction, Request } from 'express'
import { usersModels } from '@common/models'
import { jwt } from '@core/helpers'

const authToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
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
    const userToken = jwt.verifyToken(token)

    // Validation user
    const user = await usersModels.findById(userToken.id).exec()
    if (!user) {
      return res.status(401).send({
        message: 'Token no válido',
        data: null,
      })
    }
    req.user = userToken
    return next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).send({
        message: 'Token expirado',
        data: error,
      })
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).send({
        message: 'Token no válido',
        data: error,
      })
    }
    return res.status(500).send({
      message: 'Problema interno del servidor',
      data: error,
    })
  }
}

export default authToken
