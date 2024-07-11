import type { Roles } from '@common/types'
import type { Types } from 'mongoose'
import type { Permission } from './permissions'

export interface Role {
  _id?: Types.ObjectId
  type: Roles
  description: string
  permissions: Permission[]
}
