import fs from 'fs'
import type { DataResponse, ITranslation, Languages } from '@interfaces'

export const readTemplateHTML = (
  lng: Languages,
  templateName: string,
  variables: any,
): string => {
  let htmlFile = fs.readFileSync(
    `./src/languages/${lng}/${templateName}.html`,
    'utf8',
  )
  for (const key in variables) {
    const value = variables[key]
    const regex = new RegExp(`{{${key}}}`, 'g')
    htmlFile = htmlFile.replace(regex, value)
  }
  return htmlFile
}

export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const CustomError = (keyMsg: keyof ITranslation, code: number) => {
  const error: any = new Error(keyMsg as string)
  error.code = code
  error.name = 'CustomError'
  return error
}

export const getErrorResponse = (t: ITranslation, error: any): DataResponse => {
  const name = error.name
  const message: keyof ITranslation = error.message
  return {
    message: name === 'CustomError' ? t[message] : t.RES_SERVER_ERROR,
    data: name !== 'CustomError' ? message : null,
  }
}
