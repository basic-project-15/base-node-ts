import { Router } from 'express'
import {
  loginWithEmailAndPass,
  loginWithGoogle,
  loginRefreshTokens,
  registerWithEmailAndPass,
  registerWithGoogle,
  recoveryAccountSendOtp,
  recoveryAccountVerifyOtp,
  recoveryAccount,
} from '@authModule/controllers'

const routes = Router()

routes.post('/login/email-and-pass', loginWithEmailAndPass)
routes.post('/login/google', loginWithGoogle)
routes.post('/refresh-tokens', loginRefreshTokens)
routes.post('/register/email-and-pass', registerWithEmailAndPass)
routes.post('/register/google', registerWithGoogle)
routes.post('/recovery-account/send-otp', recoveryAccountSendOtp)
routes.post('/recovery-account/verify-otp', recoveryAccountVerifyOtp)
routes.post('/recovery-account', recoveryAccount)

export { routes as AuthRoutes }
