import { BCRYPT_SALT, UserModel } from '@common'
import { CustomError } from '@core'
import { compare, hash } from 'bcrypt'
import { Types } from 'mongoose'

interface Profile {
  firstName: string
  lastName: string
  phoneNumber: string
  photo: string
}

export const getProfile = async (email: string) => {
  // Get user
  const users = await UserModel.aggregate([
    {
      $match: { email, state: true },
    },
    {
      $project: {
        id: 1,
        firstName: 1,
        lastName: 1,
        email: 1,
        phoneNumber: 1,
        photo: 1,
      },
    },
  ])
  if (users.length === 0) throw CustomError('USER_NOT_FOUND', 404)

  return users[0]
}

export const updateProfile = async (idUser: string, profile: Profile) => {
  // Verify user
  const user = await UserModel.findById(idUser)
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

export const updateEmail = async (idUser: string, newEmail: string) => {
  // Verify user
  const user = await UserModel.findById(idUser)
  if (user == null) throw CustomError('USER_NOT_FOUND', 404)

  // Update email
  user.email = newEmail ?? user.email
  user.updated_at = new Date()
  user.updated_by = new Types.ObjectId(idUser)
  user.passwordVersion = user.passwordVersion + 1
  await user.save()

  return user.toObject()
}

export const updatePassword = async (
  idUser: string,
  oldPassword: string,
  newPassword: string,
) => {
  // Verify user
  const user = await UserModel.findById(idUser)
  if (user == null) throw CustomError('USER_NOT_FOUND', 404)

  // Cehck passwords
  const checkPassword = await compare(oldPassword, user.password ?? '')
  if (!checkPassword) throw CustomError('USER_INVALID_CREDENTIALS', 401)
  if (newPassword.length < 8) throw CustomError('USER_INSECURE_PASSWORD', 400)
  if (oldPassword === newPassword) throw CustomError('USER_OLD_PASSWORD', 400)

  // Update password
  const newPasswordHash: string = await hash(newPassword, BCRYPT_SALT)
  user.password = newPasswordHash
  user.updated_at = new Date()
  user.updated_by = new Types.ObjectId(idUser)
  user.passwordVersion = user.passwordVersion + 1
  await user.save()

  return user.toObject()
}

export const deleteAccount = async (idUser: string) => {
  // Verify user
  const user = await UserModel.findById(idUser).populate('roleIds')
  if (user == null) throw CustomError('USER_NOT_FOUND', 404)

  let isOwner = false
  isOwner = user.roleIds.some(role => role.type === 'owner')

  if (isOwner) throw CustomError('USER_OWNER_DELETE_PROFILE', 400)

  // Update password
  await user.deleteOne()

  return user.toObject()
}
