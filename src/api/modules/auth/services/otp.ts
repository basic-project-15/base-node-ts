import { OtpModel } from '@common'
import { CustomError, generateOTPCrypto } from '@core'

export const generateOtp = async (email: string) => {
  // Generate otp
  const newOtp = generateOTPCrypto()
  const otpEntry = new OtpModel({ email, otp: newOtp })
  await otpEntry.save()

  return otpEntry.toObject()
}

export const verifyOtp = async (email: string, otp: string) => {
  // Verify otp
  const otpEntry = await OtpModel.findOne({ email, otp })
  if (!otpEntry) throw CustomError('USER_OTP_INVALID_OR_EXPIRED', 400)

  return otpEntry.toObject()
}

export const destroyOtp = async (email: string, otp: string) => {
  // Delete otp
  await OtpModel.deleteOne({ email, otp })
}
