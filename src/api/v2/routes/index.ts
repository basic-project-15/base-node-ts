import { Router } from 'express'
import type { Request, Response } from 'express'
import type { DataResponse, Mail, Recipients } from '@interfaces'
import { EmailTemplate, sendEmail } from '@core'
import { cloudinary, multer } from '@config'
import fs from 'fs'

const routes = Router()

routes.get('/test/send-email', async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { userToken } = req
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
    dataResponse.message = 'Error al enviar el correo:'
    dataResponse.data = error
    return res.status(500).send(dataResponse)
  }
})

routes.post(
  '/test/upload-file',
  multer.uploadImages.single('file'),
  async (req: Request, res: Response) => {
    try {
      console.log(req.file)
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' })
      }
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'test',
        resource_type: 'auto',
      })
      fs.unlinkSync(req.file.path)
      return res.status(200).json({
        message: 'Image uploaded successfully',
        url: result.secure_url,
      })
    } catch (error) {
      return res.status(500).json({ message: 'Error uploading image', error })
    }
  },
)

routes.post(
  '/test/upload-files',
  multer.uploadDocs.array('files', 10),
  async (req: Request, res: Response) => {
    try {
      console.log(req.file)
      if (!req.files || !Array.isArray(req.files)) {
        return res.status(400).json({ message: 'No file uploaded' })
      }
      const uploadPromises = req.files.map(async file => {
        return await cloudinary.uploader
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
      return res.status(200).json({
        message: 'Files uploaded successfully',
        urls,
      })
    } catch (error) {
      return res.status(500).json({ message: 'Error uploading image', error })
    }
  },
)

export default routes
