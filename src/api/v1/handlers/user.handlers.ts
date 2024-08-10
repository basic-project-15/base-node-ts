import { MAX_FAILED_PASSWORDS, RoleModel, UserModel } from '@common'
import { bcrypt } from '@config'
import { CustomError } from '@core'
import type { FilterQuery, PaginationQuery } from '@interfaces'
import { hash } from 'bcrypt'
import { Types } from 'mongoose'

interface InfoUser {
  idUser: string
  firstName: string
  lastName: string
  email: string
  state: boolean
}

export const getUsers = async (
  filters: FilterQuery,
  pagination: PaginationQuery,
) => {
  // Get filters
  const { searchQuery, sortField, sortOrder } = filters
  const order = sortOrder === 'desc' ? -1 : 1
  const { page, limit } = pagination
  const skip = (page - 1) * limit
  const matchStage = {
    $match: {
      $or: [
        { firstName: { $regex: searchQuery, $options: 'i' } },
        { lastName: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } },
        { phoneNumber: { $regex: searchQuery, $options: 'i' } },
      ],
    },
  }

  // Get users
  const users = await UserModel.aggregate([
    matchStage,
    {
      $project: {
        id: 1,
        firstName: 1,
        lastName: 1,
        email: 1,
        phoneNumber: 1,
        state: 1,
      },
    },
    { $sort: { [sortField]: order } },
    { $skip: skip },
    { $limit: limit },
  ])

  // Get users quantity
  const totalUsers = await UserModel.countDocuments(matchStage.$match)

  return { totalUsers, users }
}

export const getUserById = async (idUser: string) => {
  const user = await UserModel.findById(idUser).populate([
    {
      path: 'created_by',
      select: '_id email',
    },
    {
      path: 'updated_by',
      select: '_id email',
    },
  ])
  if (user == null) throw CustomError('USER_NOT_FOUND', 404)

  return user
}

export const createUser = async (
  currentIdUser: string,
  infoUser: Omit<InfoUser, 'idUser' | 'state'>,
) => {
  // Verify user
  const { firstName, lastName, email } = infoUser
  const user = await UserModel.findOne({ email })
  if (user != null) throw CustomError('USER_ALREADY_EXISTS', 409)

  // Create user
  const temporaryPassword = Math.random().toString(36).slice(-10)
  const newPassword = await hash(temporaryPassword, bcrypt.SALT)
  const userModel = new UserModel({
    firstName,
    lastName,
    email,
    password: newPassword,
    passwordVersion: 1,
    roleIds: [],
    created_at: new Date(),
    created_by: new Types.ObjectId(currentIdUser),
    state: true,
  })
  await userModel.save()

  return null
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
  user.email = email ?? user.email
  user.updated_at = new Date()
  user.updated_by = new Types.ObjectId(currentIdUser)
  user.state = state ?? user.state
  await user.save()

  return user
}

export const disableUser = async (currentIdUser: string, idUser: string) => {
  // Verify user
  const user = await UserModel.findById(idUser).populate('roleIds')
  if (user == null) throw CustomError('USER_NOT_FOUND', 404)
  if (user.id === currentIdUser) throw CustomError('USER_DISABLE_YOURSELF', 400)

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
  user.updated_at = new Date()
  user.updated_by = new Types.ObjectId(currentIdUser)
  user.state = false
  await user.save()

  return user
}

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

export const deleteUser = async (currentIdUser: string, idUser: string) => {
  // Verify user
  const user = await UserModel.findById(idUser).populate('roleIds')
  if (user == null) throw CustomError('USER_NOT_FOUND', 404)
  if (user.id === currentIdUser) throw CustomError('USER_DELETE_YOURSELF', 400)

  // Verify deletion owner
  const currentUser = await UserModel.findById(currentIdUser).populate(
    'roleIds',
  )
  const isOwnerDeleteUser = user.roleIds.some(role => role.type === 'owner')
  let isOwnerCurrentUser = false
  if (currentUser != null) {
    isOwnerCurrentUser = currentUser.roleIds.some(role => role.type === 'owner')
  }
  if (!isOwnerCurrentUser && isOwnerDeleteUser)
    throw CustomError('USER_OWNER_DELETE', 403)

  // Delete user
  await user.deleteOne()

  return null
}

export const assignRole = async (
  currentIdUser: string,
  idUser: string,
  idRole: string,
) => {
  // Verify user
  const user = await UserModel.findById(idUser).populate('roleIds')
  if (user == null) throw CustomError('USER_NOT_FOUND', 404)
  if (user.id === currentIdUser) throw CustomError('USER_CHANGE_YOURSELF', 400)

  // Verify edit owner
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

  // Verify role
  const role = await RoleModel.findById(idRole)
  if (role == null) throw CustomError('ROLE_NOT_FOUND', 404)
  const hasRole = user.roleIds.some(role => role._id.equals(idRole))
  if (hasRole) throw CustomError('USER_ALREADY_ASSIGN_ROLE', 409)

  // Assign role and update user
  user.updated_at = new Date()
  user.updated_by = new Types.ObjectId(currentIdUser)
  user.roleIds.push(new Types.ObjectId(idRole))
  await user.save()

  return role
}

export const removeRole = async (
  currentIdUser: string,
  idUser: string,
  idRole: string,
) => {
  // Verify user
  const user = await UserModel.findById(idUser).populate('roleIds')
  if (user == null) throw CustomError('USER_NOT_FOUND', 404)
  if (user.id === currentIdUser) throw CustomError('USER_CHANGE_YOURSELF', 400)

  // Verify edit owner
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

  // Verify role
  const role = await RoleModel.findById(idRole)
  if (role == null) throw CustomError('ROLE_NOT_FOUND', 404)
  const hasRole = user.roleIds.some(role => role._id.equals(idRole))
  if (hasRole) throw CustomError('USER_ALREADY_REMOVE_ROLE', 409)

  // Remove role and update user
  user.roleIds = user.roleIds.filter(role => !role._id.equals(idRole))
  user.updated_at = new Date()
  user.updated_by = new Types.ObjectId(currentIdUser)
  await user.save()

  return role
}
