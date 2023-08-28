import { Types } from 'mongoose'

export interface Permission {
  _id?: Types.ObjectId
  module: string
  action: string
}
