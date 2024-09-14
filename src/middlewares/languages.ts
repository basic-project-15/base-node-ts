import type { Request, Response, NextFunction } from 'express'
import type { IDataResponse, ILanguages } from '@interfaces'
import { translations } from '@languages'

export const acceptLanguages = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const dataResponse: IDataResponse = { message: '', data: null }
  try {
    // Get user langues
    const userLanguage: string = req.headers['accept-language'] ?? ''
    const language: ILanguages = userLanguage as ILanguages
    const defaultLanguage: ILanguages = 'en'

    // Verify languages selected
    if (Object.keys(translations).includes(language)) {
      req.lng = language
      req.t = translations[language]
    } else {
      req.lng = defaultLanguage
      req.t = translations[defaultLanguage]
    }

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
