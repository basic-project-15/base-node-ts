import { Schema, model, Types } from 'mongoose'
import type { IUser } from '@interfaces'

const schema = new Schema({
  firstName: { type: String, required: true, maxLenght: 100 },
  lastName: { type: String, required: true, maxLenght: 100 },
  userName: { type: String, required: false, maxLenght: 100 },
  email: { type: String, required: true, maxLenght: 50 },
  phoneNumber: { type: String, required: false, maxLenght: 30 },
  password: { type: String, required: true, maxLenght: 100 },
  passwordVersion: { type: Number, required: true, default: 0 },
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
