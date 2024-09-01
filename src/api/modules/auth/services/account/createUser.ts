import { hash } from 'bcrypt'
import { BCRYPT_SALT } from '@common'
import { UserModel } from '@models'

interface CreateUser {
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  photo: string
  password?: string
}

export const createUser = async (newUser: CreateUser) => {
  // Register user
  const { firstName, lastName, email, password, phoneNumber, photo } = newUser
  let newPasswordHash
  if (password) {
    newPasswordHash = await hash(password, BCRYPT_SALT)
  }
  const user = new UserModel({
    firstName,
    lastName,
    email,
    phoneNumber,
    photo,
    password: newPasswordHash,
    passwordVersion: newPasswordHash ? 1 : 0,
    incorrectPassword: 0,
    roleIds: [],
    created_at: new Date(),
    state: true,
  })
  await user.save()

  return user.toObject()
}
