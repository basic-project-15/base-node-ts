import fs from 'fs'
import { NODEMAILER_MAIL, NODEMAILER_NAME } from '@common'
import { nodemailer } from '@config'

export interface Attachment {
  filename: string
  path: string
}

export interface Recipients {
  to: string[]
  cc?: string[]
  bcc?: string[]
}

export interface Mail {
  recipients: Recipients
  subject: string
  body?: any
}

export const sendEmail = async (
  pathTemplateBody: string,
  mail: Mail,
  files?: Attachment[],
) => {
  const { recipients, subject, body } = mail

  // Get html template
  let html = fs.readFileSync(pathTemplateBody, 'utf8')

  // Setting variables
  for (const key in body) {
    const value = body[key]
    const regex = new RegExp(`{{${key}}}`, 'g')
    html = html.replace(regex, value)
  }

  // Email construction
  const mailOptions = {
    from: `${NODEMAILER_NAME} <${NODEMAILER_MAIL}>`,
    to: recipients.to.join(', '),
    cc: recipients.cc ? recipients.cc.join(', ') : undefined,
    bcc: recipients.bcc ? recipients.bcc.join(', ') : undefined,
    subject,
    html,
    attachments: files ?? [],
  }

  // Send email
  await nodemailer.transporter.sendMail(mailOptions)
}
