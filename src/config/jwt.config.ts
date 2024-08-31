import jwt from 'jsonwebtoken'
import type { UserToken } from '@interfaces'
import {
  JWT_EXPIRED_ACCESS_TOKEN,
  JWT_EXPIRED_REFRESH_TOKEN,
  JWT_SECRET,
} from '@common'

const ALGORITHM = 'HS256'

export const generateAccessToken = (payload: UserToken): string => {
  return jwt.sign(payload, JWT_SECRET, {
    algorithm: ALGORITHM,
    expiresIn: JWT_EXPIRED_ACCESS_TOKEN,
  })
}

export const generateRefreshToken = (
  payload: Pick<UserToken, '_id'>,
): string => {
  return jwt.sign(payload, JWT_SECRET, {
    algorithm: ALGORITHM,
    expiresIn: JWT_EXPIRED_REFRESH_TOKEN,
  })
}

export const verifyAccessToken = (token: string): UserToken => {
  const tokenVerificated: any = jwt.verify(token, JWT_SECRET, {
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
  const tokenVerificated: any = jwt.verify(token, JWT_SECRET, {
    algorithms: [ALGORITHM],
  })
  return tokenVerificated
}
