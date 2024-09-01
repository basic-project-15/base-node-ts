import { Schema, model, Types } from 'mongoose'

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

const schema = new Schema({
  firstName: { type: String, required: true, maxLenght: 100 },
  lastName: { type: String, required: false, maxLenght: 100 },
  email: { type: String, required: true, maxLenght: 50 },
  phoneNumber: { type: String, required: false, maxLenght: 30 },
  password: { type: String, required: false, maxLenght: 100 },
  passwordVersion: { type: Number, required: true, default: 0 },
  incorrectPassword: { type: Number, required: false, default: 0 },
  photo: { type: String, required: false, maxLenght: 255 },
  roleIds: [{ type: Types.ObjectId, required: true, ref: 'Role' }],
  refreshToken: { type: String, required: false, maxLenght: 4000 },
  created_at: { type: Date, required: true, maxLenght: 50 },
  created_by: { type: Types.ObjectId, required: false, ref: 'User' },
  updated_at: { type: Date, required: false, maxLenght: 50 },
  updated_by: { type: Types.ObjectId, required: false, ref: 'User' },
  state: { type: Boolean, required: true },
})

export const UserModel = model<IUser>('User', schema)
