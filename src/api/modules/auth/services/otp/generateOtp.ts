import { OtpModel } from '@models'
import { generateOTPCrypto } from '@common'

export const generateOtp = async (email: string) => {
  // Generate otp
  const newOtp = generateOTPCrypto()
  const otpEntry = new OtpModel({ email, otp: newOtp })
  await otpEntry.save()

  return otpEntry.toObject()
}
