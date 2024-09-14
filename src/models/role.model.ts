import { Schema, Types, model } from 'mongoose'
import type { IModule } from '@models'

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

const schema = new Schema({
  type: { type: String, required: true, maxLenght: 25 },
  name: { type: String, required: true, maxLenght: 50 },
  description: { type: String, required: true, maxLenght: 500 },
  permissions: [
    new Schema(
      {
        module: { type: String, required: true },
        sections: [
          new Schema(
            {
              section: { type: String, required: true },
              actions: [{ type: String, required: true }],
            },
            { _id: false },
          ),
        ],
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
