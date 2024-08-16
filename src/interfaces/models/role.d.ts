import type { Types } from 'mongoose'
import type { IModule } from './permission'

export type Roles = 'admin' | 'owner'

export interface IRole {
  _id: Types.ObjectId
  type: Roles
  name: string
  description: string
  permissions: IModule[]
  created_at: Date
  created_by?: Types.ObjectId
  updated_at?: Date
  updated_by?: Types.ObjectId
  state: boolean
}
