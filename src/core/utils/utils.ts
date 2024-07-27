import fs from 'fs'
import type { Languages } from '@interfaces'

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
