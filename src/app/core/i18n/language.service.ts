import { DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Service } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  DEFAULT_LANGUAGE,
  isSupportedLanguage,
  SUPPORTED_LANGUAGES,
} from './language.config';
import { LanguageCode } from '../../shared/models/language.model';
import { LocalStorageService } from '../storage/local-storage.service';

const languageStorageKey = 'panda-house.language';

@Service()
export class LanguageService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly translate = inject(TranslateService);
  private readonly storage = inject(LocalStorageService);

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
        this.storage.set(languageStorageKey, lang);
      }
    });

    const savedLanguage = this.storage.get(languageStorageKey) ?? DEFAULT_LANGUAGE;
    this.translate.use(isSupportedLanguage(savedLanguage) ? savedLanguage : DEFAULT_LANGUAGE).subscribe();
  }

  changeLanguage(language: LanguageCode): void {
    this.translate.use(language).subscribe();
  }
}
