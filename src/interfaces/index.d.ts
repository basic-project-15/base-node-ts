import { UserToken } from './token'

declare global {
  namespace Express {
    interface Request {
      user: UserToken
    }
  }
}

export { DataResponse, TokenResponse } from './response'
export { UserToken } from './token'
export {
  UserAdmin,
  UserAdminCreate,
  UserAdminProfile,
  UserAdminLogin,
} from './usersAdmin'
