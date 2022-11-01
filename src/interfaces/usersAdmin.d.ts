export interface UserAdmin {
  id: string
  name: string
  email: string
  password: string
  role: string
  permissions: string
}

export type UserAdminCreate = Omit<UsersAdmin, 'id'>

export type UserAdminProfile = Omit<UsersAdmin, 'password'>

export type UserAdminLogin = Pick<UsersAdmin, 'email', 'password'>
