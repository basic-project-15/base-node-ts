import type { UserToken } from './token'

declare global {
  namespace Express {
    interface Request {
      userToken: UserToken
      t: (string) => string
    }
  }
}

export type * from './permissions'
export type * from './response'
export type * from './roles'
export type * from './token'
export type * from './users'
