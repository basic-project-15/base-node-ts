import { Router } from 'express'
import {
  getProfile,
  updateProfile,
  updateEmailSendOTP,
  updateEmail,
  updatePassword,
  deleteAccount,
} from '@api/profile/controllers'

const routes = Router()

routes.get('/', getProfile)
routes.put('/', updateProfile)
routes.put('/email/send-otp', updateEmailSendOTP)
routes.put('/email', updateEmail)
routes.put('/password', updatePassword)
routes.delete('/', deleteAccount)

export { routes as ProfileRoutes }
