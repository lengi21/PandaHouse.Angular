import { DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Service } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  DEFAULT_LANGUAGE,
  isSupportedLanguage,
  LanguageCode,
  SUPPORTED_LANGUAGES,
} from './language.config';

@Service()
export class LanguageService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly translate = inject(TranslateService);

  readonly availableLanguages = SUPPORTED_LANGUAGES;
  readonly currentLanguage = signal<LanguageCode>(DEFAULT_LANGUAGE);
  readonly currentLanguageDetails = computed(() =>
    this.availableLanguages.find(({ code }) => code === this.currentLanguage()),
  );

  constructor() {
    this.translate.addLangs(this.availableLanguages.map(({ code }) => code));
    this.translate.onLangChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(({ lang }) => {
      if (isSupportedLanguage(lang)) {
        this.currentLanguage.set(lang);
      }
    });
  }

  changeLanguage(language: LanguageCode): void {
    this.translate.use(language).subscribe();
  }
}
