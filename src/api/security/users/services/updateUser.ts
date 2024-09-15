import { UserModel } from '@models'
import { CustomError } from '@common'
import { Types } from 'mongoose'

interface InfoUser {
  idUser: string
  firstName: string
  lastName: string
  email: string
  state: boolean
}

export const updateUser = async (currentIdUser: string, infoUser: InfoUser) => {
  // Verify user
  const { idUser, firstName, lastName, email, state } = infoUser
  const user = await UserModel.findById(idUser).populate('roleIds')
  if (user == null) throw CustomError('USER_NOT_FOUND', 404)
  if (user.id === currentIdUser && !state)
    throw CustomError('USER_DISABLE_YOURSELF', 400)

  // Verify another user
  const anotherUser = await UserModel.findOne({ email })
  if (anotherUser?.email != null && anotherUser.email !== user.email)
    throw CustomError('USER_ALREADY_EXISTS', 409)

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
  user.firstName = firstName ?? user.firstName
  user.lastName = lastName ?? user.lastName
  if (user.email !== email) {
    user.passwordVersion = user.passwordVersion + 1
  }
  user.email = email ?? user.email
  user.updated_at = new Date()
  user.updated_by = new Types.ObjectId(currentIdUser)
  user.state = state ?? user.state
  await user.save()

  return user.toObject()
}
