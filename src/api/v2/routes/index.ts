import { Router } from 'express'
import type { Request, Response } from 'express'
import type { DataResponse, Mail, Recipients } from '@interfaces'
import { EmailTemplate, sendEmail } from '@core'
import { cloudinary, multer } from '@config'
import fs from 'fs'

const routes = Router()

routes.get('/nodemailer/send-email', async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { t, userToken } = req
  try {
    const recipients: Recipients = {
      to: [userToken.email],
    }
    const subject = 'Test 4'
    const title = 'Test email with HTML template'
    const description = 'This is an example of an email with an HTML template.'
    const html = EmailTemplate.testEmail(title, description)
    const mail: Mail = { subject, html }
    const result = await sendEmail(recipients, mail)
    if (result.success) {
      return res.status(200).send(dataResponse)
    } else {
      dataResponse.message = result.message
      return res.status(500).send(dataResponse)
    }
  } catch (error) {
    dataResponse.message = t('RES_SERVER_ERROR')
    dataResponse.data = error
    return res.status(500).send(dataResponse)
  }
})

routes.post(
  '/cloudinary/upload-file',
  multer.uploadImages.single('file'),
  async (req: Request, res: Response) => {
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
      dataResponse.message = t('RES_SERVER_ERROR')
      dataResponse.data = error
      return res.status(500).send(dataResponse)
    }
  },
)

routes.post(
  '/cloudinary/upload-files',
  multer.uploadDocs.array('files', 10),
  async (req: Request, res: Response) => {
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
      dataResponse.message = t('RES_SERVER_ERROR')
      dataResponse.data = error
      return res.status(500).send(dataResponse)
    }
  },
)

routes.get(
  '/cloudinary/:folder/signature',
  async (req: Request, res: Response) => {
    const dataResponse: DataResponse = { message: '', data: null }
    const { params, t } = req
    const folder: string = params.folder
    try {
      const timestamp = Math.round(new Date().getTime() / 1000)
      const paramsToSign = { timestamp, folder }
      const signature = cloudinary.config.utils.api_sign_request(
        paramsToSign,
        cloudinary.CLOUDINARY_API_SECRET,
      )
      dataResponse.data = {
        signature,
        timestamp,
        api_key: cloudinary.CLOUDINARY_API_KEY,
        cloud_name: cloudinary.CLOUDINARY_CLOUD_NAME,
        folder,
      }
      return res.status(200).send(dataResponse)
    } catch (error) {
      dataResponse.message = t('RES_SERVER_ERROR')
      dataResponse.data = error
      return res.status(500).send(dataResponse)
    }
  },
)

export default routes
