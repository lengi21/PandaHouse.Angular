export type LanguageCode = string;

export interface SupportedLanguage {
  readonly code: LanguageCode;
  readonly label: string;
  readonly flagUrl: string;
}
