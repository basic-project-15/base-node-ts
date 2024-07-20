import { nodemialer } from '@config'
import type { Attachment, Mail, Recipients, Result } from '@interfaces'

const { NODEMAILER_MAIL, NODEMAILER_NAME, transporter } = nodemialer

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

export const testEmailTemplate = (title: string, description: string) => {
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
