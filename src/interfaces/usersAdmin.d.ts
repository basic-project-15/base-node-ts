export interface UsersAdmin {
  id: string
  name: string
  email: string
  password: string
  role: string
}

export type UsersAdminCreate = Omit<UsersAdmin, 'id'>
