import { Roles } from '@common/types'
import { Types } from 'mongoose'
import { Permission } from './permissions'

export interface Role {
  _id?: Types.ObjectId
  type: Roles
  description: string
  permissions: Permission[]
}
