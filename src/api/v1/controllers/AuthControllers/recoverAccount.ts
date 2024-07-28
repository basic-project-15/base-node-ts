import type { Request, Response } from 'express'
import type { DataResponse } from '@interfaces'
import { OtpModel, UserModel } from '@common'
import { generateOTPCrypto, SendEmails } from '@core'
import { bcrypt } from '@config'
import { hash } from 'bcrypt'

export const sendOtp = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { body, t, lng } = req
  try {
    const user = await UserModel.findOne({ email: body.email, state: true })
    if (!user) {
      dataResponse.message = t.USER_NOT_FOUND
      return res.status(404).send(dataResponse)
    }
    const newOtp = generateOTPCrypto()
    const otpEntry = new OtpModel({ email: body.email, otp: newOtp })
    await otpEntry.save()

    const result = await SendEmails.recoveryAccount(
      lng,
      { name: user.firstName, email: user.email },
      { newOtp },
    )
    if (!result.success) {
      dataResponse.message = t.RES_SERVER_ERROR
      dataResponse.data = result.data
      return res.status(500).send(dataResponse)
    }
    dataResponse.message = t.USER_OTP_SENT
    return res.status(200).send(dataResponse)
  } catch (error) {
    dataResponse.message = t.RES_SERVER_ERROR
    dataResponse.data = {
      name: error.name,
      message: error.message,
    }
    return res.status(500).send(dataResponse)
  }
}

export const verifyOtp = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { body, t } = req
  try {
    const otpEntry = await OtpModel.findOne({
      email: body.email,
      otp: body.otp,
    })
    if (!otpEntry) {
      dataResponse.message = t.USER_OTP_INVALID_OR_EXPIRED
      return res.status(400).send(dataResponse)
    }
    dataResponse.message = t.USER_OTP_VALID
    return res.status(200).send(dataResponse)
  } catch (error) {
    dataResponse.message = t.RES_SERVER_ERROR
    dataResponse.data = {
      name: error.name,
      message: error.message,
    }
    return res.status(500).send(dataResponse)
  }
}

export const recoveryAccount = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { body, t } = req
  try {
    const otpEntry = await OtpModel.findOne({
      email: body.email,
      otp: body.otp,
    })
    if (!otpEntry) {
      dataResponse.message = t.USER_OTP_INVALID_OR_EXPIRED
      return res.status(400).send(dataResponse)
    }
    const user = await UserModel.findOne({ email: body.email, state: true })
    if (!user) {
      dataResponse.message = t.USER_NOT_FOUND
      return res.status(404).send(dataResponse)
    }
    const newPassword = await hash(body.newPassword, bcrypt.SALT)
    user.password = newPassword
    user.passwordVersion = user.passwordVersion + 1
    user.incorrectPassword = 0
    await user.save()
    await otpEntry.deleteOne()
    dataResponse.message = t.USER_ACCOUNT_RECOVERED
    return res.status(200).send(dataResponse)
  } catch (error) {
    dataResponse.message = t.RES_SERVER_ERROR
    dataResponse.data = {
      name: error.name,
      message: error.message,
    }
    return res.status(500).send(dataResponse)
  }
}
