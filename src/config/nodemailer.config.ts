import {
  NODEMAILER_HOST,
  NODEMAILER_MAIL,
  NODEMAILER_PASS,
  NODEMAILER_PORT,
} from '@common'
import nodemailer from 'nodemailer'

const port = Number(NODEMAILER_PORT) || 0

export const transporter = nodemailer.createTransport({
  host: NODEMAILER_HOST,
  port,
  secure: port === 465,
  auth: {
    user: NODEMAILER_MAIL,
    pass: NODEMAILER_PASS,
  },
})
