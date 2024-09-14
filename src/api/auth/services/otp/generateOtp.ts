import { OtpModel, UserModel } from '@models'
import { CustomError, generateOTPCrypto } from '@common'

export const generateOtp = async (email: string) => {
  // Generate otp
  const newOtp = generateOTPCrypto()
  const otpEntry = new OtpModel({ email, otp: newOtp })
  await otpEntry.save()

  return otpEntry.toObject()
}

export const generateOtpInternalUser = async (email: string) => {
  const user = await UserModel.findOne({ email, state: true })
  if (user == null) throw CustomError('AUTH_ACCOUNT_NOT_FOUND', 404)

  // Generate otp
  const newOtp = generateOTPCrypto()
  const otpEntry = new OtpModel({ email, otp: newOtp })
  await otpEntry.save()

  return { newOtp: otpEntry.toObject(), user: user.toObject() }
}

export const generateOtpExternalUser = async (email: string) => {
  const user = await UserModel.findOne({ email })
  if (user != null) throw CustomError('AUTH_ACCOUNT_ALREADY_EXISTS', 200)

  // Generate otp
  const newOtp = generateOTPCrypto()
  const otpEntry = new OtpModel({ email, otp: newOtp })
  await otpEntry.save()

  return otpEntry.toObject()
}
