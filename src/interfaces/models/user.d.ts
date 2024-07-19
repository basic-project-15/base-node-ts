import type { Types } from 'mongoose'

export interface IUser {
  _id?: Types.ObjectId
  name: string
  surname: string
  userName?: string
  email: string
  phoneNumber?: string
  password: string
  passwordVersion: number
  photo?: string
  roleIds: any[]
  created_at: Date
  created_by?: Types.ObjectId
  updated_at?: Date
  updated_by?: Types.ObjectId
  state: boolean
}
