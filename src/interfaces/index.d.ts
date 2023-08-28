import { UserToken } from './token'

declare global {
  namespace Express {
    interface Request {
      userToken: UserToken
      t: (string) => string
    }
  }
}

export { Permission } from './permissions'
export { DataResponse } from './response'
export { Role } from './role'
export { UserToken } from './token'
export { User, UserCreate, UserProfile, UserLogin } from './users'
