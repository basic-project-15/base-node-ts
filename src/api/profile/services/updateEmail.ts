import { UserModel } from '@models'
import { CustomError } from '@common'
import { Types } from 'mongoose'

export const updateEmail = async (idUser: string, newEmail: string) => {
  // Verify user
  const user = await UserModel.findById(idUser)
  if (user == null) throw CustomError('PROFILE_NOT_FOUND', 404)

  // Verify used email
  const anotherUser = await UserModel.findOne({ email: newEmail })
  if (anotherUser != null)
    throw CustomError('PROFILE_EMAIL_ALREADY_EXISTS', 409)

  // Update email
  user.email = newEmail ?? user.email
  user.updated_at = new Date()
  user.updated_by = new Types.ObjectId(idUser)
  user.passwordVersion = user.passwordVersion + 1
  await user.save()

  return user.toObject()
}
