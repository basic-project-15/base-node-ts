import type { Types } from 'mongoose'

export type Actions = 'read' | 'create' | 'update' | 'delete'

export type Modules = 'security'

export interface IPermission {
  _id: Types.ObjectId
  module: Modules
  action: Actions
}
