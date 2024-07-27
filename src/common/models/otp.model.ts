import { Schema, model } from 'mongoose'
import type { IOtp } from '@interfaces'

const schema = new Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now, expires: 300 },
})

export const OtpModel = model<IOtp>('Otp', schema)
