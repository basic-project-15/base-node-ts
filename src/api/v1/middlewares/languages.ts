import type { Request, Response, NextFunction } from 'express'
import type { DataResponse, Languages } from '@interfaces'
import { selectTranslation } from '@core'

export const languages = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const dataResponse: DataResponse = { message: '', data: null }
  try {
    const userLanguage: string = req.headers['accept-language'] ?? ''
    const language: Languages = userLanguage as Languages
    const { lng, translation } = selectTranslation(language)
    req.t = translation
    req.lng = lng
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
