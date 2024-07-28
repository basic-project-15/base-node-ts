import { Router } from 'express'
import { AuthControllers } from '@api/v1'

const routes = Router()

routes.post('/email-and-pass', AuthControllers.emailAndPassAuth)
routes.post('/google-token', AuthControllers.googleAuth)
routes.post('/refresh-token', AuthControllers.refreshToken)
routes.post('/send-otp', AuthControllers.sendOtp)
routes.post('/verify-otp', AuthControllers.verifyOtp)
routes.post('/recovery-account', AuthControllers.recoveryAccount)

export default routes
