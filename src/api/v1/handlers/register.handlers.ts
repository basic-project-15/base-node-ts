import { hash } from 'bcrypt'
import { UserModel } from '@common'
import { bcrypt } from '@config'

interface CreateUser {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  photo: string
  password: string
}

export const registerUser = async (newUser: CreateUser) => {
  // Register user
  const { firstName, lastName, email, password, phoneNumber, photo } = newUser
  const newPasswordHash = await hash(password, bcrypt.SALT)
  const user = new UserModel({
    firstName,
    lastName,
    email,
    phoneNumber,
    photo,
    password: newPasswordHash,
    passwordVersion: 1,
    roleIds: [],
    created_at: new Date(),
    state: true,
  })
  await user.save()

  return user.$clone()
}
