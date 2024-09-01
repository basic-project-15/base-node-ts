import { OtpModel } from '@models'

export const destroyOtp = async (email: string, otp: string) => {
  // Delete otp
  await OtpModel.deleteOne({ email, otp })
}
