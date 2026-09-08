import { LanguageCode } from './language.model';

export interface Translation {
  readonly languageCode: LanguageCode;
}

export interface NamedTranslation extends Translation {
  readonly name: string;
}

export interface DescribedTranslation extends NamedTranslation {
  readonly description: string;
}
