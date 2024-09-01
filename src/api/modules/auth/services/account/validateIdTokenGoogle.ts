import { OAuth2Client } from 'google-auth-library'
import { UserModel } from '@models'
import { GOOGLE_CLIENT_ID, CustomError } from '@common'

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
