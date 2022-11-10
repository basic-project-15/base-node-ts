import jwt, { Secret } from 'jsonwebtoken'
import { UserToken } from '@interfaces'
import { jwtSingOptions, jwtVerifyOptions } from '@config'
import { privateKeyFile, publicKeyFile } from '@common/constants'

const generateToken = (payload: UserToken): string => {
  const key: Secret = {
    key: privateKeyFile,
    passphrase: process.env.JWT_PASSPHRASE ?? '',
  }
  return jwt.sign(payload, key, jwtSingOptions)
}

const verifyToken = (token: string): UserToken => {
  const tokenVerificated: any = jwt.verify(
    token,
    publicKeyFile,
    jwtVerifyOptions,
  )
  const userToken: UserToken = {
    id: tokenVerificated.id,
    email: tokenVerificated.email,
    role: tokenVerificated.role,
  }
  return userToken
}

export default { generateToken, verifyToken }
