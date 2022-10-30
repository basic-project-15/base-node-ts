import jwt, { Secret } from 'jsonwebtoken'
import { DataResponse, TokenResponse, UserToken } from '@interfaces/index'
import { jwtSingOptions, jwtVerifyOptions } from '@config/index'
import { privateKeyFile, publicKeyFile } from '@common/constants'

const generateToken = (payload: UserToken): TokenResponse => {
  const response: TokenResponse = {
    statusCode: 200,
    message: '',
    token: '',
  }
  try {
    const key: Secret = {
      key: privateKeyFile,
      passphrase: process.env.JWT_PASSPHRASE ?? '',
    }
    response.token = jwt.sign(payload, key, jwtSingOptions)
  } catch (error) {
    response.statusCode = 500
    response.message = 'Error al generar token'
    response.token = error
  }
  return response
}

const verifyToken = (token: string): DataResponse => {
  const response: DataResponse = {
    statusCode: 200,
    message: '',
    data: null,
  }
  try {
    const userToken = jwt.verify(token, publicKeyFile, jwtVerifyOptions)
    response.data = userToken
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      response.statusCode = 401
      response.message = 'Token expirado'
    } else if (error.name === 'JsonWebTokenError') {
      response.statusCode = 401
      response.message = 'Token no válido'
    } else {
      response.statusCode = 500
      response.message = 'Problema interno del servidor'
    }
    response.data = error
  }
  return response
}

export default { generateToken, verifyToken }
