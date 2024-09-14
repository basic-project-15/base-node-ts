import { compare } from 'bcrypt'
import { MAX_FAILED_PASSWORDS, CustomError } from '@common'
import { UserModel } from '@models'

export const validateEmailAndPass = async (email: string, password: string) => {
  // Verify user
  const user = await UserModel.findOne({ email, state: true })
  if (user == null) throw CustomError('AUTH_INVALID_CREDENTIALS', 401)

  // Verify user is blocked
  let incorrectPassword: number = user.incorrectPassword!
  if (incorrectPassword >= MAX_FAILED_PASSWORDS)
    throw CustomError('AUTH_ACCOUNT_BLOCKED_DETAILS', 401)

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
    throw CustomError('AUTH_INVALID_CREDENTIALS', 401)
  }

  // Unlock user
  user.incorrectPassword = 0
  await user.save()

  return { user: user.toObject(), isSendEmail }
}
