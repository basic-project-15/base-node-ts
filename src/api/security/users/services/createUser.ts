import { UserModel } from '@models'
import { BCRYPT_SALT, CustomError } from '@common'
import { hash } from 'bcrypt'
import { Types } from 'mongoose'

interface InfoUser {
  idUser: string
  firstName: string
  lastName: string
  email: string
  state: boolean
}

export const createUser = async (
  currentIdUser: string,
  infoUser: Omit<InfoUser, 'idUser' | 'state'>,
) => {
  // Verify user
  const { firstName, lastName, email } = infoUser
  const anotherUser = await UserModel.findOne({ email })
  if (anotherUser != null) throw CustomError('USER_ALREADY_EXISTS', 409)

  // Create user
  const temporaryPassword = Math.random().toString(36).slice(-10)
  const newPassword = await hash(temporaryPassword, BCRYPT_SALT)
  const user = new UserModel({
    firstName,
    lastName,
    email,
    password: newPassword,
    passwordVersion: 1,
    roleIds: [],
    created_at: new Date(),
    created_by: new Types.ObjectId(currentIdUser),
    state: true,
  })
  await user.save()

  return { user: user.toObject(), temporaryPassword }
}
