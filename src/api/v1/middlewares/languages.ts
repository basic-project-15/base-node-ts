import type { Request, Response, NextFunction } from 'express'
import type { DataResponse } from '@interfaces'
import Languages from '@languages'

export const languages = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const dataResponse: DataResponse = { message: '', data: null }
  try {
    const defaultLanguage: string = Object.keys(Languages)[0]
    const defaultTranslation = Object.values(Languages)[0]
    let language: string = req.headers['accept-language'] ?? defaultLanguage
    if (!Object.keys(Languages).includes(language)) {
      language = defaultLanguage
    }
    const translation = (property: string): string => {
      const translation = Languages[language as keyof typeof Languages]
      return translation[property as keyof typeof defaultTranslation]
    }
    req.t = translation
    next()
  } catch (error) {
    dataResponse.message = 'Language error'
    dataResponse.data = {
      name: error.name,
      message: error.message,
    }
    return res.status(500).send(dataResponse)
  }
}
