import { Schema, model } from 'mongoose'
import type { Types } from 'mongoose'

export interface IOtp {
  _id?: Types.ObjectId
  email: string
  otp: string
  createdAt: Date
}

const schema = new Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now, expires: 300 },
})

export const OtpModel = model<IOtp>('Otp', schema)
