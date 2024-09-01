import { UserModel } from '@models'
import { CustomError } from '@common'
import { Types } from 'mongoose'

export const updateEmail = async (idUser: string, newEmail: string) => {
  // Verify user
  const user = await UserModel.findOne({ _id: idUser, state: true })
  if (user == null) throw CustomError('USER_NOT_FOUND', 404)

  // Update email
  user.email = newEmail ?? user.email
  user.updated_at = new Date()
  user.updated_by = new Types.ObjectId(idUser)
  user.passwordVersion = user.passwordVersion + 1
  await user.save()

  return user.toObject()
}
