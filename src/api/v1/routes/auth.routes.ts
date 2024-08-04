import { Router } from 'express'
import { AuthControllers } from '@api/v1'

const routes = Router()
const {
  loginWithEmailAndPass,
  loginWithGoogle,
  loginRefreshTokens,
  registerWithEmailAndPass,
  recoveryAccountSendOtp,
  recoveryAccountVerifyOtp,
  recoveryAccount,
} = AuthControllers

routes.post('/login/email-and-pass', loginWithEmailAndPass)
routes.post('/login/google', loginWithGoogle)
routes.post('/refresh-tokens', loginRefreshTokens)
routes.post('/register/email-and-pass', registerWithEmailAndPass)
routes.post('/recovery-account/send-otp', recoveryAccountSendOtp)
routes.post('/recovery-account/verify-otp', recoveryAccountVerifyOtp)
routes.post('/recovery-account', recoveryAccount)

export { routes as AuthRoutes }
