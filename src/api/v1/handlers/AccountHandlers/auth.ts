import { OAuth2Client } from 'google-auth-library'
import { compare, hash } from 'bcrypt'
import { bcrypt } from '@config'
import { GOOGLE_CLIENT_ID, MAX_FAILED_PASSWORDS, UserModel } from '@common'
import { capitalizeFirstLetter, CustomError } from '@core'

interface CreateUser {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  photo: string
  password: string
}

export const validateEmailAndPass = async (email: string, password: string) => {
  // Verify user
  const user = await UserModel.findOne({ email, state: true })
  if (user == null) throw CustomError('USER_INVALID_CREDENTIALS', 401)

  // Verify user is blocked
  let incorrectPassword: number = user.incorrectPassword!
  if (incorrectPassword >= MAX_FAILED_PASSWORDS)
    throw CustomError('USER_BLOCKED_DETAILS', 401)

  // Check password and update user if password is incorrect
  const checkPassword = await compare(password, user.password ?? '')
  if (!checkPassword) {
    incorrectPassword++
    if (incorrectPassword <= MAX_FAILED_PASSWORDS) {
      user.incorrectPassword = incorrectPassword
      await user.save()
    }
  }

  // Verify user is blocked and send email once
  let isSendEmail = false
  if (!checkPassword && incorrectPassword === MAX_FAILED_PASSWORDS) {
    isSendEmail = true
    return { user: user.toObject(), isSendEmail }
  } else if (!checkPassword) {
    throw CustomError('USER_INVALID_CREDENTIALS', 401)
  }

  // Unlock user
  user.incorrectPassword = 0
  await user.save()

  return { user: user.toObject(), isSendEmail }
}

export const validateIdTokenGoogle = async (idToken: string) => {
  // Verify idToken
  const audience = GOOGLE_CLIENT_ID
  const client = new OAuth2Client(audience)
  const ticket = await client.verifyIdToken({ idToken, audience })
  const payload = ticket.getPayload()
  if (!payload) throw CustomError('USER_INVALID_CREDENTIALS', 401)

  // Verify user, if it is not found, it will register it
  const email = payload.email ?? ''
  const user = await UserModel.findOne({ email, state: true })
  if (user == null) throw CustomError('USER_NOT_FOUND', 404)

  return user?.toObject()
}

export const registerWithEmailAndPass = async (newUser: CreateUser) => {
  // Register user
  const { firstName, lastName, email, password, phoneNumber, photo } = newUser
  const newPasswordHash = await hash(password, bcrypt.SALT)
  const user = new UserModel({
    firstName,
    lastName,
    email,
    phoneNumber,
    photo,
    password: newPasswordHash,
    passwordVersion: 1,
    incorrectPassword: 0,
    roleIds: [],
    created_at: new Date(),
    state: true,
  })
  await user.save()

  return user.toObject()
}

export const registerWithGoogle = async (idToken: string) => {
  // Verify idToken
  const audience = GOOGLE_CLIENT_ID
  const client = new OAuth2Client(audience)
  const ticket = await client.verifyIdToken({ idToken, audience })
  const payload = ticket.getPayload()
  if (!payload) throw CustomError('USER_INVALID_CREDENTIALS', 401)

  // Verify user, if it is not found, it will register it
  const email = payload.email ?? ''
  const anotherUser = await UserModel.findOne({ email })
  if (anotherUser != null) throw CustomError('USER_ALREADY_EXISTS', 409)

  // Register user
  const firstName = payload.given_name ?? ''
  const lastName = payload.family_name ?? ''
  const photo = payload.picture ?? ''
  const user = new UserModel({
    firstName: capitalizeFirstLetter(firstName),
    lastName: capitalizeFirstLetter(lastName),
    email,
    photo,
    passwordVersion: 0,
    roleIds: [],
    created_at: new Date(),
    state: true,
  })
  await user.save()

  return user.toObject()
}
