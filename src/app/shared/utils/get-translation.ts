import { LanguageCode } from '../models/language.model';
import { Translation } from '../models/translation.model';

export function getTranslation<T extends Translation>(
  translations: readonly T[],
  language: LanguageCode,
  fallbackLanguage = 'en',
): T | undefined {
  return (
    translations.find((translation) => translation.languageCode === language) ??
    translations.find((translation) => translation.languageCode === fallbackLanguage) ??
    translations.at(0)
  );
}
