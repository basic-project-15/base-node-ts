import { Router } from 'express'
import type { Request, Response } from 'express'
import type { DataResponse, Mail, Recipients } from '@interfaces'
import { sendEmail, testEmailTemplate } from '@core'

const routes = Router()

routes.get('/test/send-email', async (req: Request, res: Response) => {
  const dataResponse: DataResponse = { message: '', data: null }
  const { userToken } = req
  try {
    const recipients: Recipients = {
      to: [userToken.email],
    }
    const subject = 'Test 4'
    const title = 'Test email with HTML template'
    const description = 'This is an example of an email with an HTML template.'
    const html = testEmailTemplate(title, description)
    const mail: Mail = { subject, html }
    const result = await sendEmail(recipients, mail)
    if (result.success) {
      return res.status(200).send(dataResponse)
    } else {
      dataResponse.message = result.message
      return res.status(500).send(dataResponse)
    }
  } catch (error) {
    dataResponse.message = 'Error al enviar el correo:'
    dataResponse.data = error
    return res.status(500).send(dataResponse)
  }
})

export default routes
