import type { Languages, Recipients } from '@interfaces'
import { sendMail } from '@services'
import { readTemplateHTML, selectTranslation } from '@core'
import { APPLICATION_NAME } from '@common'

interface MailFor {
  name: string
  email: string
}

interface BodyOTP {
  newOtp: string
}

export const createAccount = async (
  lng: Languages,
  to: MailFor,
  newPassword: string,
) => {
  const recipients: Recipients = { to: [`${to.name} <${to.email}>`] }
  const { translation: t } = selectTranslation(lng)
  const subject = `${APPLICATION_NAME} - ${t.USER_CREATED}`
  const html = readTemplateHTML(lng, 'createAccount', {
    name: to.name,
    newPassword,
  })
  await sendMail(recipients, { subject, html })
}

export const blockedAccount = async (lng: Languages, to: MailFor) => {
  const recipients: Recipients = { to: [`${to.name} <${to.email}>`] }
  const { translation: t } = selectTranslation(lng)
  const subject = `${APPLICATION_NAME} - ${t.USER_BLOCKED}`
  const html = readTemplateHTML(lng, 'blockedAccount', { name: to.name })
  await sendMail(recipients, { subject, html })
}

export const recoveryAccount = async (
  lng: Languages,
  to: MailFor,
  body: BodyOTP,
) => {
  const recipients: Recipients = { to: [`${to.name} <${to.email}>`] }
  const { translation: t } = selectTranslation(lng)
  const subject = `${APPLICATION_NAME} - ${t.USER_ACCOUNT_RECOVERY}`
  const html = readTemplateHTML(lng, 'recoveryAccount', {
    name: to.name,
    ...body,
  })
  await sendMail(recipients, { subject, html })
}

export const verifyEmail = async (
  lng: Languages,
  to: MailFor,
  body: BodyOTP,
) => {
  const recipients: Recipients = { to: [`${to.name} <${to.email}>`] }
  const { translation: t } = selectTranslation(lng)
  const subject = `${APPLICATION_NAME} - ${t.USER_EMAIL_VERIFICATION}`
  const html = readTemplateHTML(lng, 'verifyEmail', {
    name: to.name,
    ...body,
  })
  await sendMail(recipients, { subject, html })
}

export const registerUser = async (lng: Languages, to: MailFor) => {
  const recipients: Recipients = { to: [`${to.name} <${to.email}>`] }
  const { translation: t } = selectTranslation(lng)
  const subject = `${APPLICATION_NAME} - ${t.USER_CREATED}`
  const html = readTemplateHTML(lng, 'registerUser', {
    name: to.name,
  })
  await sendMail(recipients, { subject, html })
}
