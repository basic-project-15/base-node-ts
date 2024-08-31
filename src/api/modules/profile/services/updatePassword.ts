import { BCRYPT_SALT, UserModel } from '@common'
import { CustomError } from '@core'
import { compare, hash } from 'bcrypt'
import { Types } from 'mongoose'

export const updatePassword = async (
  idUser: string,
  oldPassword: string,
  newPassword: string,
) => {
  // Verify user
  const user = await UserModel.findById(idUser)
  if (user == null) throw CustomError('USER_NOT_FOUND', 404)

  // Cehck passwords
  const checkPassword = await compare(oldPassword, user.password ?? '')
  if (!checkPassword) throw CustomError('USER_INVALID_CREDENTIALS', 401)
  if (newPassword.length < 8) throw CustomError('USER_INSECURE_PASSWORD', 400)
  if (oldPassword === newPassword) throw CustomError('USER_OLD_PASSWORD', 400)

  // Update password
  const newPasswordHash: string = await hash(newPassword, BCRYPT_SALT)
  user.password = newPasswordHash
  user.updated_at = new Date()
  user.updated_by = new Types.ObjectId(idUser)
  user.passwordVersion = user.passwordVersion + 1
  await user.save()

  return user.toObject()
}
