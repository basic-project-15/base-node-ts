import type { Request, Response } from 'express'
import { Types } from 'mongoose'
import type { DataResponse } from '@interfaces'
import { OtpModel, UserModel } from '@common'
import { generateOTPCrypto, SendEmails } from '@core'
import { bcrypt, jwt } from '@config'
import { compare, hash } from 'bcrypt'

export const updateEmailSendOTP = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { body, t, lng, userToken } = req
  try {
    const userFoundById = await UserModel.findById(userToken._id)
    const userFoundByEmail = await UserModel.findOne({
      email: body.email,
    })
    if (userFoundById == null) {
      dataResponse.message = t.USER_NOT_FOUND
      return res.status(404).send(dataResponse)
    }
    if (
      userFoundByEmail?.email != null &&
      userFoundByEmail.email !== userFoundById.email
    ) {
      dataResponse.message = t.USER_ALREADY_EXISTS
      return res.status(409).send(dataResponse)
    }
    if (userFoundById.email === body.email) {
      dataResponse.message = t.USER_UPDATED
      return res.status(200).send(dataResponse)
    }

    const newOtp = generateOTPCrypto()
    const otpEntry = new OtpModel({ email: body.email, otp: newOtp })
    await otpEntry.save()

    const result = await SendEmails.verifyEmail(
      lng,
      { name: userFoundById.firstName, email: body.email },
      { newOtp },
    )
    if (!result.success) {
      dataResponse.message = t.RES_SERVER_ERROR
      dataResponse.data = result.data
      return res.status(500).send(dataResponse)
    }
    dataResponse.message = t.USER_EMAIL_VERIFICATION_SENT
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

export const updateEmail = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { body, t, userToken } = req
  try {
    const userFoundById = await UserModel.findById(userToken._id)
    const userFoundByEmail = await UserModel.findOne({
      email: body.email,
    })
    const otpEntry = await OtpModel.findOne({
      email: body.email,
      otp: body.otp,
    })
    if (userFoundById == null) {
      dataResponse.message = t.USER_NOT_FOUND
      return res.status(404).send(dataResponse)
    }
    if (
      userFoundByEmail?.email != null &&
      userFoundByEmail.email !== userFoundById.email
    ) {
      dataResponse.message = t.USER_ALREADY_EXISTS
      return res.status(409).send(dataResponse)
    }
    if (!otpEntry) {
      dataResponse.message = t.USER_OTP_INVALID_OR_EXPIRED
      return res.status(400).send(dataResponse)
    }

    const newPasswordVersion = userFoundById.passwordVersion + 1
    const accessToken = jwt.generateAccessToken({
      _id: userFoundById.id,
      email: body.email,
      passwordVersion: newPasswordVersion,
    })
    const refreshToken = jwt.generateRefreshToken({ _id: userFoundById.id })

    userFoundById.email = body.email ?? userFoundById.email
    userFoundById.updated_at = new Date()
    userFoundById.updated_by = new Types.ObjectId(userToken._id)
    userFoundById.passwordVersion = newPasswordVersion
    userFoundById.refreshToken = refreshToken

    await userFoundById.save()
    dataResponse.message = t.USER_UPDATED
    dataResponse.data = {
      user: {
        firstName: userFoundById.firstName,
        lastName: userFoundById.lastName,
        email: userFoundById.email,
        phoneNumber: userFoundById.phoneNumber,
        photo: userFoundById.photo,
      },
      accessToken,
      refreshToken,
    }
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

export const updatePassword = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { body, t, userToken } = req
  try {
    const userFoundById = await UserModel.findById(userToken._id)

    if (userFoundById == null) {
      dataResponse.message = t.USER_NOT_FOUND
      return res.status(404).send(dataResponse)
    }
    const oldPasswordHash: string = userFoundById.password ?? ''
    const oldPassword: string = body.password ?? ''
    const newPassword: string = body.newPassword ?? ''
    const checkPassword = await compare(oldPassword, oldPasswordHash)
    if (!checkPassword) {
      dataResponse.message = t.USER_INVALID_CREDENTIALS
      return res.status(401).send(dataResponse)
    }
    if (newPassword.length < 8) {
      dataResponse.message = t.USER_INSECURE_PASSWORD
      return res.status(400).send(dataResponse)
    }
    if (oldPassword === newPassword) {
      dataResponse.message = t.USER_OLD_PASSWORD
      return res.status(400).send(dataResponse)
    }

    const newPasswordHash: string = await hash(newPassword, bcrypt.SALT)
    const newPasswordVersion = userFoundById.passwordVersion + 1
    const accessToken = jwt.generateAccessToken({
      _id: userFoundById.id,
      email: userFoundById.email,
      passwordVersion: newPasswordVersion,
    })
    const refreshToken = jwt.generateRefreshToken({ _id: userFoundById.id })

    userFoundById.password = newPasswordHash
    userFoundById.updated_at = new Date()
    userFoundById.updated_by = new Types.ObjectId(userToken._id)
    userFoundById.passwordVersion = userFoundById.passwordVersion + 1
    userFoundById.refreshToken = refreshToken

    await userFoundById.save()
    dataResponse.message = t.USER_UPDATED
    dataResponse.data = {
      user: {
        firstName: userFoundById.firstName,
        lastName: userFoundById.lastName,
        email: userFoundById.email,
        phoneNumber: userFoundById.phoneNumber,
        photo: userFoundById.photo,
      },
      accessToken,
      refreshToken,
    }
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
