import type { Attachment, Mail, Recipients } from '@interfaces'
import { NODEMAILER_MAIL, NODEMAILER_NAME } from '@common'
import { nodemailer } from '@config'

export const sendMail = async (
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
