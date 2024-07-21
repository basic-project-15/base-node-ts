import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

const fileFilterImages = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedFileTypes = /jpeg|jpg|png/
  const mimetype = allowedFileTypes.test(file.mimetype)
  const extname = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase(),
  )

  if (mimetype && extname) {
    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    return cb(null, true)
  } else {
    cb(
      new Error(
        'Invalid file type. Only JPEG, JPG, and PNG files are allowed.',
      ),
    )
  }
}

const fileFilterDocs = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedFileTypes = /jpeg|jpg|png|pdf/
  const mimetype = allowedFileTypes.test(file.mimetype)
  const extname = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase(),
  )

  if (mimetype && extname) {
    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    return cb(null, true)
  } else {
    cb(
      new Error(
        'Invalid file type. Only JPEG, JPG, PNG, and PDF files are allowed.',
      ),
    )
  }
}

export const uploadImages = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter: fileFilterImages,
})

export const uploadDocs = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fileFilter: fileFilterDocs,
})
