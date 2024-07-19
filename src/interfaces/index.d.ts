import type { UserToken } from './token'

declare global {
  namespace Express {
    interface Request {
      userToken: UserToken
      t: (string) => string
    }
  }
}

export type * from './models'
export type * from './methods'
export type * from './response'
export type * from './token'
