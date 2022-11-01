import { Permission } from './permissions'

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: string
  permissions?: Permission[]
}

export type UserCreate = Omit<User, 'id'>

export type UserProfile = Omit<User, 'password'>

export type UserLogin = Pick<User, 'email', 'password'>
