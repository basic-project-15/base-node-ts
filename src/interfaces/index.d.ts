import type { UserToken } from './endpoint'
import type { Languages, ITranslation } from './languages'

declare global {
  namespace Express {
    interface Request {
      userToken: UserToken
      lng: Languages
      t: ITranslation
    }
  }
}

declare namespace Express {
  interface Request {
    file?: Express.Multer.File
  }
}

export type * from './models'
export type * from './languages'
export type * from './endpoint'
export type * from './sendEmails'
