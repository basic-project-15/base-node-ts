import { hash } from 'bcrypt'
import { bcrypt } from '@config'
import {
  RoleModel,
  SEED_USER_EMAIL,
  SEED_USER_NAME,
  SEED_USER_PASSWORD,
  SEED_USER_SURNAME,
  UserModel,
} from '@common'

export const createUser = async () => {
  const newPassword = await hash(SEED_USER_PASSWORD, bcrypt.SALT)
  try {
    const isUsers = await UserModel.countDocuments({})
    if (isUsers === 0) {
      const role = await RoleModel.findOne({ type: 'owner' })
      if (role != null) {
        const newUser = new UserModel({
          firstName: SEED_USER_NAME,
          lastName: SEED_USER_SURNAME,
          email: SEED_USER_EMAIL,
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
