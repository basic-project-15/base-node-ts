import { compare, hash } from 'bcrypt'
import { BCRYPT_SALT, UserModel } from '@common'
import { CustomError } from '@core'

export const verifyExistEmail = async (email: string) => {
  // Verify another email
  const user = await UserModel.findOne({ email })

  return user?.toObject()
}

export const recoveryAccount = async (email: string, newPassword: string) => {
  // Verify user
  const user = await UserModel.findOne({ email, state: true })
  if (!user) throw CustomError('USER_NOT_FOUND', 404)

  // Verify old password
  const oldPassword: string = user.password ?? ''
  const checkOldPassword = await compare(newPassword, oldPassword)
  if (checkOldPassword) throw CustomError('USER_OLD_PASSWORD', 400)

  // Update password
  const newPasswordHash = await hash(newPassword, BCRYPT_SALT)
  user.password = newPasswordHash
  user.passwordVersion = user.passwordVersion + 1
  user.incorrectPassword = 0
  await user.save()

  return user.toObject()
}
