import { SignOptions, VerifyOptions } from 'jsonwebtoken'

export const jwtSingOptions: SignOptions = {
  algorithm: 'RS256',
  expiresIn: '30d',
}

export const jwtVerifyOptions: VerifyOptions = {
  algorithms: ['RS256'],
}
