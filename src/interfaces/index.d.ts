import type { UserToken } from './token'

declare global {
  namespace Express {
    interface Request {
      userToken: UserToken
      t: (string) => string
    }
  }
}

declare namespace Express {
  interface Request {
    file?: Express.Multer.File
  }
}

export type * from './models'
export type * from './methods'
export type * from './response'
export type * from './sendEmails'
export type * from './token'
