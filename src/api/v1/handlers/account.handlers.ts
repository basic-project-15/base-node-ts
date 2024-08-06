import { OtpModel, UserModel } from '@common'
import { bcrypt } from '@config'
import { CustomError, generateOTPCrypto } from '@core'
import { compare, hash } from 'bcrypt'

export const generateOtp = async (email: string) => {
  // Verify user
  const user = await UserModel.findOne({ email, state: true })
  if (!user) throw CustomError('USER_NOT_FOUND', 404)

  // Generate otp
  const newOtp = generateOTPCrypto()
  const otpEntry = new OtpModel({ email, otp: newOtp })
  await otpEntry.save()

  return { newOtp, user: user.$clone() }
}

export const verifyOtp = async (email: string, otp: string) => {
  // Verify otp
  const otpEntry = await OtpModel.findOne({ email, otp })
  if (!otpEntry) throw CustomError('USER_OTP_INVALID_OR_EXPIRED', 400)
}

export const destroyOtp = async (email: string, otp: string) => {
  // Delete otp
  await OtpModel.deleteOne({ email, otp })
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
  const newPasswordHash = await hash(newPassword, bcrypt.SALT)
  user.password = newPasswordHash
  user.passwordVersion = user.passwordVersion + 1
  user.incorrectPassword = 0
  await user.save()

  return user.$clone()
}

export const verifyAnotherEmail = async (
  anotherEmail: string,
): Promise<boolean> => {
  // Verify another email
  const anotherUser = await UserModel.findOne({ email: anotherEmail })
  if (anotherUser != null) return true

  return false
}
