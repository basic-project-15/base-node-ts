import { Schema, model } from 'mongoose'
import type { IPermission } from '@interfaces'

const schema = new Schema({
  module: { type: String, required: true, minLength: 2, maxLenght: 30 },
  action: { type: String, required: true, minLength: 3, maxLenght: 10 },
})

export const PermissionModel = model<IPermission>('Permission', schema)
