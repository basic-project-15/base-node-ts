import { OtpModel } from '@models'
import { CustomError } from '@common'

export const verifyOtp = async (email: string, otp: string) => {
  // Verify otp
  const otpEntry = await OtpModel.findOne({ email, otp })
  if (!otpEntry) throw CustomError('AUTH_OTP_INVALID_OR_EXPIRED', 400)

  return otpEntry.toObject()
}
