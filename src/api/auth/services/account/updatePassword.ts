import { compare, hash } from 'bcrypt'
import { UserModel } from '@models'
import { CustomError, BCRYPT_SALT } from '@common'
import { Types } from 'mongoose'

export const resetPassword = async (email: string, newPassword: string) => {
  // Verify user
  const user = await UserModel.findOne({ email, state: true })
  if (!user) throw CustomError('AUTH_ACCOUNT_NOT_FOUND', 404)

  // Verify old password
  const oldPasswordHash: string = user.password ?? ''
  const checkOldPassword = await compare(newPassword, oldPasswordHash)
  if (checkOldPassword) throw CustomError('AUTH_OLD_PASSWORD', 400)
  if (newPassword.length < 8) throw CustomError('AUTH_INSECURE_PASSWORD', 400)

  // Update password
  const newPasswordHash = await hash(newPassword, BCRYPT_SALT)
  user.password = newPasswordHash
  user.updated_at = new Date()
  user.updated_by = new Types.ObjectId(user.id)
  user.passwordVersion = user.passwordVersion + 1
  user.incorrectPassword = 0
  await user.save()

  return user.toObject()
}
