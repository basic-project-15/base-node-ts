import { nodemailer } from '@config'
import type { Attachment, Mail, Recipients, Result } from '@interfaces'

const { NODEMAILER_MAIL, NODEMAILER_NAME, transporter } = nodemailer

export const sendEmail = async (
  recipients: Recipients,
  mail: Mail,
  files?: Attachment[],
): Promise<Result> => {
  const result: Result = { success: false, message: '', data: null }
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
    await transporter.sendMail(mailOptions)
    result.success = true
  } catch (error) {
    result.message = 'Error al enviar el correo:'
    result.data = error
  }
  return result
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
