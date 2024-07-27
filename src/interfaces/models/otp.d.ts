import type { Types } from 'mongoose'

export interface IOtp {
  _id?: Types.ObjectId
  email: string
  otp: string
  createdAt: Date
}
