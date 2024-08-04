import { Router } from 'express'
import { ProfileControllers } from '@api/v1'

const routes = Router()
const {
  getProfile,
  updateProfile,
  updateEmailSendOTP,
  updateEmail,
  updatePassword,
} = ProfileControllers

routes.get('/', getProfile)
routes.put('/', updateProfile)
routes.put('/email/send-otp', updateEmailSendOTP)
routes.put('/email', updateEmail)
routes.put('/password', updatePassword)

export { routes as ProfileRoutes }
