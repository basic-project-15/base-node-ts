import * as fs from 'fs'
import jwt from 'jsonwebtoken'
import type { Secret, SignOptions, VerifyOptions } from 'jsonwebtoken'
import type { UserToken } from '@interfaces'
import dotenv from 'dotenv'

dotenv.config()

const privateKeyFile: Buffer = fs.readFileSync('./certs/private.key')
const publicKeyFile: Buffer = fs.readFileSync('./certs/public.key')

const jwtSingOptions: SignOptions = {
  algorithm: 'RS256',
  expiresIn: '1d',
}

const jwtVerifyOptions: VerifyOptions = {
  algorithms: ['RS256'],
}

export const generateToken = (payload: UserToken): string => {
  const key: Secret = {
    key: privateKeyFile,
    passphrase: process.env.JWT_PASSPHRASE ?? '',
  }
  return jwt.sign(payload, key, jwtSingOptions)
}

export const verifyToken = (token: string): UserToken => {
  const tokenVerificated: any = jwt.verify(
    token,
    publicKeyFile,
    jwtVerifyOptions,
  )
  const userToken: UserToken = {
    _id: tokenVerificated._id,
    passwordVersion: tokenVerificated.passwordVersion,
  }
  return userToken
}
