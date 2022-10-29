import { SignOptions, VerifyOptions } from 'jsonwebtoken'
import * as fs from 'fs'

export const jwtSingOptions: SignOptions = {
  algorithm: 'RS256',
  expiresIn: '10m',
}

export const jwtVerifyOptions: VerifyOptions = {
  algorithms: ['RS256'],
}

export const jwtPrivateKey: Buffer = fs.readFileSync('./certs/private.key')

export const jwtPublicKey: Buffer = fs.readFileSync('./certs/public.key')
