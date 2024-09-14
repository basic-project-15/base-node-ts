import en from './en/translation.json'
import es from './es/translation.json'
import { AuthLanguages } from '@api/auth/languages'
import { ProfileLanguages } from '@api/profile/languages'
import { UserLanguages } from '@api/security/users/languages'
import { RoleLanguages } from '@api/security/roles/languages'
import { PermissionLanguages } from '@api/security/permissions/languages'

const GeneralLanguages = { en, es }

export const translations = {
  en: {
    ...GeneralLanguages.en,
    ...AuthLanguages.en,
    ...ProfileLanguages.en,
    ...UserLanguages.en,
    ...RoleLanguages.en,
    ...PermissionLanguages.en,
  },
  es: {
    ...GeneralLanguages.es,
    ...AuthLanguages.es,
    ...ProfileLanguages.es,
    ...UserLanguages.es,
    ...RoleLanguages.es,
    ...PermissionLanguages.es,
  },
}

export type ITranslation = typeof translations.en
export type ILanguages = 'en' | 'es'
