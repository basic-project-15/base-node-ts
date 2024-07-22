import * as fs from 'fs'
import jwt from 'jsonwebtoken'
import type { Secret } from 'jsonwebtoken'
import type { UserToken } from '@interfaces'
import dotenv from 'dotenv'

dotenv.config()

const privateKeyFile: Buffer = fs.readFileSync('./certs/private.key')
const publicKeyFile: Buffer = fs.readFileSync('./certs/public.key')
const ALGORITHM = 'RS256'

export const generateAccessToken = (payload: UserToken): string => {
  const key: Secret = {
    key: privateKeyFile,
    passphrase: process.env.JWT_PASSPHRASE ?? '',
  }
  return jwt.sign(payload, key, {
    algorithm: ALGORITHM,
    expiresIn: '1h',
  })
}

export const generateRefreshToken = (
  payload: Pick<UserToken, '_id'>,
): string => {
  const key: Secret = {
    key: privateKeyFile,
    passphrase: process.env.JWT_PASSPHRASE ?? '',
  }
  return jwt.sign(payload, key, {
    algorithm: ALGORITHM,
    expiresIn: '1d',
  })
}

export const verifyAccessToken = (token: string): UserToken => {
  const tokenVerificated: any = jwt.verify(token, publicKeyFile, {
    algorithms: [ALGORITHM],
  })
  const userToken: UserToken = {
    _id: tokenVerificated._id,
    email: tokenVerificated.email,
    passwordVersion: tokenVerificated.passwordVersion,
  }
  return userToken
}

export const verifyRefreshToken = (token: string): Pick<UserToken, '_id'> => {
  const tokenVerificated: any = jwt.verify(token, publicKeyFile, {
    algorithms: [ALGORITHM],
  })
  return tokenVerificated
}
