import type { Types } from 'mongoose'

export interface IUser {
  _id: Types.ObjectId
  firstName: string
  lastName?: string
  email: string
  phoneNumber?: string
  password?: string
  passwordVersion: number
  incorrectPassword?: number
  photo?: string
  roleIds: any[]
  refreshToken?: string
  created_at: Date
  created_by?: Types.ObjectId
  updated_at?: Date
  updated_by?: Types.ObjectId
  state: boolean
}
