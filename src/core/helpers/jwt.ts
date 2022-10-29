import jwt, { SignOptions, Secret, VerifyOptions } from 'jsonwebtoken'
import * as fs from 'fs'
import { DataResponse, TokenResponse, UserToken } from '@interfaces/index'

const generateToken = (payload: UserToken): TokenResponse => {
  const response: TokenResponse = {
    statusCode: 200,
    message: '',
    token: '',
  }
  try {
    const jwtOptions: SignOptions = {
      algorithm: 'RS256',
      expiresIn: '10m',
    }
    const privateKey: Buffer = fs.readFileSync('./certs/private.key')
    const key: Secret = {
      key: privateKey,
      passphrase: process.env.JWT_PASSPHRASE ?? '',
    }
    response.token = jwt.sign(payload, key, jwtOptions)
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
    data: '',
  }
  try {
    const publicKey = fs.readFileSync('./certs/public.key')
    const jwtOptions: VerifyOptions = {
      algorithms: ['RS256'],
    }
    const userToken = jwt.verify(token, publicKey, jwtOptions)
    console.log(userToken)
  } catch (error) {
    response.statusCode = 500
    response.message = 'Error al generar token'
    response.data = error
  }
  return response
}

export default { generateToken, verifyToken }
