import { Schema, Types, model } from 'mongoose'
import type { IRole } from '@interfaces'

const schema = new Schema({
  type: { type: String, required: true, maxLenght: 25 },
  description: { type: String, required: true, maxLenght: 50 },
  permissions: [
    new Schema(
      {
        module: { type: String, required: true },
        action: { type: String, required: true },
      },
      { _id: false },
    ),
  ],
  created_at: { type: Date, required: true, maxLenght: 50 },
  created_by: { type: Types.ObjectId, required: false, ref: 'User' },
  updated_at: { type: Date, required: false, maxLenght: 50 },
  updated_by: { type: Types.ObjectId, required: false, ref: 'User' },
  state: { type: Boolean, required: true },
})

export const RoleModel = model<IRole>('Role', schema)
