import { Request, Response, NextFunction } from 'express'
import Languages from '@languages'

const languages = async (req: Request, _res: Response, next: NextFunction) => {
  let defaultLanguage: string = Object.keys(Languages)[0]
  let defaultTranslation = Object.values(Languages)[0]
  let language: string = req.headers['accept-language'] ?? defaultLanguage
  if (!Object.keys(Languages).includes(language)) {
    language = defaultLanguage
  }
  const translation = (property: string): string => {
    const translation = Languages[language as keyof typeof Languages]
    return translation[property as keyof typeof defaultTranslation]
  }
  req.t = translation
  return next()
}

export default languages
