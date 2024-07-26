import { Router } from 'express'
import { multer } from '@config'
import { TestControllers } from '../controllers'

const routes = Router()

routes.get('/nodemailer/send-email', TestControllers.sendEmailTest)
routes.post(
  '/cloudinary/upload-file',
  multer.uploadImages.single('file'),
  TestControllers.updaloadFileTest,
)
routes.post(
  '/cloudinary/upload-files',
  multer.uploadDocs.array('files', 10),
  TestControllers.updaloadFilesTest,
)
routes.get(
  '/cloudinary/:folder/signature',
  TestControllers.getSignatureCloudinaryTest,
)

export default routes
