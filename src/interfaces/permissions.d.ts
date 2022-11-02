import { Types } from 'mongoose'

export interface Permission {
  _id?: Types.ObjectId
  id?: string
  path: string
  method: string
}
