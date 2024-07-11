import type { Role } from './roles'

export interface UserToken {
  _id: string
  email: string
  role: Role
}
