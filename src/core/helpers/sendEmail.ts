import type { Attachment, Mail, Recipients } from '@interfaces'
import { NODEMAILER_MAIL, NODEMAILER_NAME } from '@common'
import { nodemailer } from '@config'

export const sendEmail = async (
  recipients: Recipients,
  mail: Mail,
  files?: Attachment[],
) => {
  try {
    const mailOptions = {
      from: `${NODEMAILER_NAME} <${NODEMAILER_MAIL}>`,
      to: recipients.to.join(', '),
      cc: recipients.cc ? recipients.cc.join(', ') : undefined,
      bcc: recipients.bcc ? recipients.bcc.join(', ') : undefined,
      subject: mail.subject,
      html: mail.html,
      attachments: files ?? [],
    }
    await nodemailer.transporter.sendMail(mailOptions)
  } catch (error) {
    throw new Error(error)
  }
}

const testEmail = (title: string, description: string) => {
  const htmlTemplate = `
  <html>
    <body>
      <h1>${title}</h1>
      <p>Hello,</p>
      <p>${description}</p>
      <p>Regards,</p>
    </body>
  </html>
`
  return htmlTemplate
}

const createUser = (name: string, newPassword: string) => {
  const htmlTemplate = `
  <html>
    <body>
      <h2>Welcome to Base Symphony JS</h2>
      <br />
      <p>Hello, ${name}</p>
      <p>We inform you that your account has been created successfully. Next, your new password:<br /><b>${newPassword}</b></p>
      <b>For security, you must change your password upon your first login.</b>
      <br />
      <p>We will wait for you!</p>
      <br />
      <i>Please do not respond to this email.</i>
    </body>
  </html>
`
  return htmlTemplate
}

export const EmailTemplate = {
  testEmail,
  createUser,
}
