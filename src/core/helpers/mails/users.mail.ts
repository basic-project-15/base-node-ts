import type { Languages, Recipients, Result } from '@interfaces'
import { sendMail } from '@services'
import { readTemplateHTML, selectTranslation } from '@core'
import { APPLICATION_NAME } from '@common'

interface MailFor {
  name: string
  email: string
}

export const createUser = async (
  lng: Languages,
  to: MailFor,
  newPassword: string,
): Promise<Result> => {
  const result: Result = { success: false, message: '', data: null }
  try {
    const recipients: Recipients = { to: [`${to.name} <${to.email}>`] }
    const { translation: t } = selectTranslation(lng)
    const subject = `${APPLICATION_NAME} - ${t.USER_CREATED}`
    const html = readTemplateHTML(lng, 'createAccount', {
      name: to.name,
      newPassword,
    })
    await sendMail(recipients, {
      subject,
      html,
    })
    result.success = true
  } catch (error) {
    result.data = {
      name: error.name,
      message: error.message,
    }
  }
  return result
}

export const blockedAccount = async (
  lng: Languages,
  to: MailFor,
): Promise<Result> => {
  const result: Result = { success: false, message: '', data: null }
  try {
    const recipients: Recipients = { to: [`${to.name} <${to.email}>`] }
    const { translation: t } = selectTranslation(lng)
    const subject = `${APPLICATION_NAME} - ${t.USER_BLOCKED}`
    const html = readTemplateHTML(lng, 'blockedAccount', { name: to.name })
    await sendMail(recipients, {
      subject,
      html,
    })
    result.success = true
  } catch (error) {
    result.data = {
      name: error.name,
      message: error.message,
    }
  }
  return result
}
