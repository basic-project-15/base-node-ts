import { Types } from 'mongoose'

export interface Permission {
  _id?: Types.ObjectId
  id?: Types.ObjectId
  path: string
  method: string
}
