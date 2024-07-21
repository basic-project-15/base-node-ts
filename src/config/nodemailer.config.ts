import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

dotenv.config()

const NODEMAILER_HOST = process.env.NODEMAILER_HOST ?? ''
const NODEMAILER_PORT = Number(process.env.NODEMAILER_PORT) || 0
export const NODEMAILER_NAME = process.env.NODEMAILER_NAME ?? ''
export const NODEMAILER_MAIL = process.env.NODEMAILER_MAIL ?? ''
export const NODEMAILER_PASS = process.env.NODEMAILER_PASS ?? ''

export const transporter = nodemailer.createTransport({
  host: NODEMAILER_HOST,
  port: NODEMAILER_PORT,
  secure: NODEMAILER_PORT === 465,
  auth: {
    user: NODEMAILER_MAIL,
    pass: NODEMAILER_PASS,
  },
})
