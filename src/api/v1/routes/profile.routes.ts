import { Router } from 'express'
import { ProfileControllers } from '@api/v1'

const routes = Router()

routes.get('/', ProfileControllers.getProfile)
routes.put('/', ProfileControllers.updateProfile)
routes.put('/email/send-otp', ProfileControllers.updateEmailSendOTP)
routes.put('/email', ProfileControllers.updateEmail)
routes.put('/password', ProfileControllers.updatePassword)

export default routes
