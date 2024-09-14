import { compare, hash } from 'bcrypt'
import { UserModel } from '@models'
import { BCRYPT_SALT, CustomError } from '@common'
import { Types } from 'mongoose'

export const updatePassword = async (
  idUser: string,
  oldPassword: string,
  newPassword: string,
) => {
  // Verify user
  const user = await UserModel.findOne({ _id: idUser, state: true })
  if (user == null) throw CustomError('PROFILE_NOT_FOUND', 404)

  // Check passwords
  const oldPasswordHash: string = user.password ?? ''
  const checkOldPassword = await compare(oldPassword, oldPasswordHash)
  if (!checkOldPassword) throw CustomError('PROFILE_INVALID_CREDENTIALS', 401)
  if (oldPassword === newPassword)
    throw CustomError('PROFILE_OLD_PASSWORD', 400)
  if (newPassword.length < 8)
    throw CustomError('PROFILE_INSECURE_PASSWORD', 400)

  // Update password
  const newPasswordHash: string = await hash(newPassword, BCRYPT_SALT)
  user.password = newPasswordHash
  user.updated_at = new Date()
  user.updated_by = new Types.ObjectId(idUser)
  user.passwordVersion = user.passwordVersion + 1
  user.incorrectPassword = 0
  await user.save()

  return user.toObject()
}
