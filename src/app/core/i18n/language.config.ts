export const DEFAULT_LANGUAGE = 'en';

export const SUPPORTED_LANGUAGES = [
  { code: 'ka', label: 'ქართული' },
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];

export function isSupportedLanguage(language: string): language is LanguageCode {
  return SUPPORTED_LANGUAGES.some(({ code }) => code === language);
}
