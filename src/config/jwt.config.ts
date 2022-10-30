import { SignOptions, VerifyOptions } from 'jsonwebtoken'

export const jwtSingOptions: SignOptions = {
  algorithm: 'RS256',
  expiresIn: '10m',
}

export const jwtVerifyOptions: VerifyOptions = {
  algorithms: ['RS256'],
}
