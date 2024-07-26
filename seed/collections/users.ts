import { hash } from 'bcrypt'
import * as dotenv from 'dotenv'
import { bcrypt } from '@config'
import { RoleModel, UserModel } from '@common'

dotenv.config()

const SEED_USER_NAME = process.env.SEED_USER_NAME ?? ''
const SEED_USER_SURNAME = process.env.SEED_USER_SURNAME ?? ''
const USER_EMAIL = process.env.SEED_USER_EMAIL ?? ''
const USER_PASSWORD = process.env.SEED_USER_PASSWORD ?? ''

export const createUser = async () => {
  const newPassword = await hash(USER_PASSWORD, bcrypt.SALT)
  try {
    const isUsers = await UserModel.countDocuments({})
    if (isUsers === 0) {
      const role = await RoleModel.findOne({ type: 'owner' })
      if (role != null) {
        const newUser = new UserModel({
          firstName: SEED_USER_NAME,
          lastName: SEED_USER_SURNAME,
          email: USER_EMAIL,
          password: newPassword,
          passwordVersion: 1,
          roleIds: [role?._id],
          created_at: new Date(),
          state: true,
        })
        await newUser.save()
        console.log('Created user')
      }
    }
  } catch (err) {
    console.error('Error:', err)
  }
}
