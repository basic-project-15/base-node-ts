import { Types } from 'mongoose'

export interface User {
  _id?: Types.ObjectId
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  password: string
  photo: string
  created_at: Date
  created_by: Types.ObjectId
  updated_at: Date
  updated_by: Types.ObjectId
  idRole: Types.ObjectId
}

export type UserCreate = Omit<User, '_id'>

export type UserProfile = Omit<User, 'password'>

export type UserLogin = Pick<User, 'email', 'password'>
