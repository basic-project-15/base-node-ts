import { UserModel } from '@models'
import { CustomError } from '@common'
import { Types } from 'mongoose'

interface IProfile {
  firstName: string
  lastName: string
  phoneNumber: string
  photo: string
}

export const updateProfile = async (idUser: string, profile: IProfile) => {
  // Verify user
  const user = await UserModel.findOne({ _id: idUser, state: true })
  if (user == null) throw CustomError('USER_NOT_FOUND', 404)

  // Update profile
  user.firstName = profile.firstName ?? user.firstName
  user.lastName = profile.lastName ?? user.lastName
  user.phoneNumber = profile.phoneNumber ?? user.phoneNumber
  user.photo = profile.photo ?? user.photo
  user.updated_at = new Date()
  user.updated_by = new Types.ObjectId(idUser)
  await user.save()

  return user.toObject()
}
