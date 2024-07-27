import type { ITranslation, Languages } from '@interfaces'
import LanguagesFiles from '@languages'

interface TranslationSelected {
  lng: Languages
  translation: ITranslation
}

export const selectTranslation = (language: Languages): TranslationSelected => {
  const defaultLanguage: Languages = 'en'
  if (Object.keys(LanguagesFiles).includes(language)) {
    return {
      lng: language,
      translation: LanguagesFiles[language],
    }
  } else {
    return {
      lng: defaultLanguage,
      translation: LanguagesFiles[defaultLanguage],
    }
  }
}
