import { LanguageCode, SupportedLanguage } from '../../shared/models/language.model';

export const DEFAULT_LANGUAGE: LanguageCode = 'en';

export const SUPPORTED_LANGUAGES = [
  { code: 'ka', label: 'ქართული' },
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
] as const satisfies readonly SupportedLanguage[];

export function isSupportedLanguage(language: string): language is LanguageCode {
  return SUPPORTED_LANGUAGES.some(({ code }) => code === language);
}
