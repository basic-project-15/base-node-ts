import { UserModel } from '@models'

export const verifyExistEmail = async (email: string) => {
  // Verify another email
  const user = await UserModel.findOne({ email })

  return user?.toObject()
}
