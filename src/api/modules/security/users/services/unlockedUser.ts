import { MAX_FAILED_PASSWORDS, UserModel } from '@common'
import { CustomError } from '@core'

import { Types } from 'mongoose'

export const unlockedUser = async (currentIdUser: string, idUser: string) => {
  // Verify user
  const user = await UserModel.findById(idUser).populate('roleIds')
  if (user == null) throw CustomError('USER_NOT_FOUND', 404)
  if (user.incorrectPassword! < MAX_FAILED_PASSWORDS)
    throw CustomError('USER_UNLOCKED', 200)

  // Verify edition owner
  const currentUser = await UserModel.findById(currentIdUser).populate(
    'roleIds',
  )
  const isOwnerEditUser = user.roleIds.some(role => role.type === 'owner')
  let isOwnerCurrentUser = false
  if (currentUser != null) {
    isOwnerCurrentUser = currentUser.roleIds.some(role => role.type === 'owner')
  }
  if (!isOwnerCurrentUser && isOwnerEditUser)
    throw CustomError('USER_OWNER_EDIT', 403)

  // Update user
  user.incorrectPassword = 0
  user.updated_at = new Date()
  user.updated_by = new Types.ObjectId(currentIdUser)
  await user.save()

  return user
}
