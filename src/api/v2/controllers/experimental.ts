import fs from 'fs'
import type { Request, Response } from 'express'
import type { DataResponse, Mail, Recipients } from '@interfaces'
import { sendMail } from '@services'
import { cloudinary } from '@config'
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
  NODEMAILER_MAIL,
  NODEMAILER_NAME,
} from '@common'

export const sendEmailTest = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { t } = req
  try {
    const recipients: Recipients = {
      to: [`${NODEMAILER_NAME} <${NODEMAILER_MAIL}>`],
    }
    const subject = 'Test 4'
    const title = 'Test email with HTML template'
    const description = 'This is an example of an email with an HTML template.'
    const html = `
      <html>
        <body>
          <h1>${title}</h1>
          <p>Hello,</p>
          <p>${description}</p>
          <p>Regards,</p>
        </body>
      </html>
    `
    const mail: Mail = { subject, html }
    await sendMail(recipients, mail)
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

export const updaloadFileTest = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { t } = req
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }
    const result = await cloudinary.config.uploader.upload(req.file.path, {
      folder: 'test',
      resource_type: 'auto',
    })
    fs.unlinkSync(req.file.path)
    dataResponse.data = result
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

export const updaloadFilesTest = async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { t } = req
  try {
    if (!req.files || !Array.isArray(req.files)) {
      return res.status(400).json({ message: 'No file uploaded' })
    }
    const uploadPromises = req.files.map(async file => {
      return await cloudinary.config.uploader
        .upload(file.path, {
          folder: 'test',
          resource_type: 'auto',
        })
        .then(result => {
          fs.unlinkSync(file.path)
          return result.secure_url
        })
    })
    const urls = await Promise.all(uploadPromises)
    dataResponse.data = urls
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

export const getSignatureCloudinaryTest = async (
  req: Request,
  res: Response,
) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { params, t } = req
  const folder: string = params.folder
  try {
    const timestamp = Math.round(new Date().getTime() / 1000)
    const paramsToSign = { timestamp, folder }
    const signature = cloudinary.config.utils.api_sign_request(
      paramsToSign,
      CLOUDINARY_API_SECRET,
    )
    dataResponse.data = {
      signature,
      timestamp,
      api_key: CLOUDINARY_API_KEY,
      cloud_name: CLOUDINARY_CLOUD_NAME,
      folder,
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
