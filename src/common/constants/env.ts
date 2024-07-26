import dotenv from 'dotenv'

dotenv.config()

const env = process.env

export const SERVER_PORT = env.SERVER_PORT ?? ''
export const SERVER_URL_NAME = env.SERVER_URL_NAME ?? ''

export const JWT_PASSPHRASE = env.JWT_PASSPHRASE ?? ''
export const JWT_EXPIRED_ACCESS_TOKEN = env.JWT_EXPIRED_ACCESS_TOKEN ?? ''
export const JWT_EXPIRED_REFRESH_TOKEN = env.JWT_EXPIRED_REFRESH_TOKEN ?? ''

export const MONGODB_URL = env.MONGODB_URL ?? ''

export const SEED_USER_NAME = env.SEED_USER_NAME ?? ''
export const SEED_USER_SURNAME = env.SEED_USER_SURNAME ?? ''
export const SEED_USER_EMAIL = env.SEED_USER_EMAIL ?? ''
export const SEED_USER_PASSWORD = env.SEED_USER_PASSWORD ?? ''

export const NODEMAILER_HOST = env.NODEMAILER_HOST ?? ''
export const NODEMAILER_PORT = env.NODEMAILER_PORT ?? ''
export const NODEMAILER_NAME = env.NODEMAILER_NAME ?? ''
export const NODEMAILER_MAIL = env.NODEMAILER_MAIL ?? ''
export const NODEMAILER_PASS = env.NODEMAILER_PASS ?? ''

export const CLOUDINARY_CLOUD_NAME = env.CLOUDINARY_CLOUD_NAME ?? ''
export const CLOUDINARY_API_KEY = env.CLOUDINARY_API_KEY ?? ''
export const CLOUDINARY_API_SECRET = env.CLOUDINARY_API_SECRET ?? ''

export const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID ?? ''
export const GOOGLE_CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET ?? ''
