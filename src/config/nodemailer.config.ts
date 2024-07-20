import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

dotenv.config()

export const NODEMAILER_NAME = process.env.NODEMAILER_NAME ?? ''
export const NODEMAILER_MAIL = process.env.NODEMAILER_MAIL ?? ''
export const NODEMAILER_PASS = process.env.NODEMAILER_PASS ?? ''

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: NODEMAILER_MAIL,
    pass: NODEMAILER_PASS,
  },
})
