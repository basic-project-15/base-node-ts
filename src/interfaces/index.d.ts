import { UserToken } from './token'

declare global {
  namespace Express {
    interface Request {
      user: UserToken
      t: (string) => string
    }
  }
}

export { DataResponse, TokenResponse } from './response'
export { UserToken } from './token'
export { User, UserCreate, UserProfile, UserLogin } from './users'
export { Permission } from './permissions'
