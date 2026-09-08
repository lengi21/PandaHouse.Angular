import { Component, computed, ElementRef, input, output, viewChild } from '@angular/core';
import { LanguageCode, SupportedLanguage } from '../../models/language.model';

@Component({
  selector: 'app-language-picker',
  styles: `
    :host { display: block; }
    details { position: relative; }
    summary { display: grid; inline-size: 2.7rem; block-size: 2.7rem; place-items: center; border: 1px solid rgb(255 255 255 / 16%); border-radius: .75rem; background: rgb(255 255 255 / 8%); cursor: pointer; list-style: none; }
    summary::-webkit-details-marker { display: none; }
    summary:focus-visible, button:focus-visible { outline: 3px solid var(--color-focus); outline-offset: 2px; }
    .flag { inline-size: 1.5rem; block-size: 1rem; border-radius: .12rem; box-shadow: 0 0 0 1px rgb(0 0 0 / 12%); object-fit: cover; }
    .options { position: absolute; z-index: 20; inset: calc(100% + .4rem) 0 auto auto; display: grid; gap: .25rem; padding: .35rem; border: 1px solid color-mix(in srgb, var(--color-text) 14%, transparent); border-radius: .85rem; background: var(--color-panel); box-shadow: 0 .65rem 1.5rem rgb(0 0 0 / 22%); }
    .option { display: grid; inline-size: 2.45rem; block-size: 2.45rem; place-items: center; border: 1px solid transparent; border-radius: .6rem; background: transparent; cursor: pointer; }
    .option.active { border-color: var(--color-primary); background: color-mix(in srgb, var(--color-primary) 12%, transparent); }
    .visually-hidden { position: absolute; inline-size: 1px; block-size: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
  `,
  template: `
    <details #picker>
      <summary [attr.aria-label]="label()">@if (currentLanguage(); as language) { <img [alt]="''" class="flag" [src]="language.flagUrl" /> }</summary>
      <div class="options">
        @for (language of languages(); track language.code) {
          <button class="option" type="button" [attr.aria-label]="language.label" [class.active]="language.code === value()" (click)="selectLanguage(language.code)">
            <img [alt]="''" class="flag" [src]="language.flagUrl" /><span class="visually-hidden">{{ language.label }}</span>
          </button>
        }
      </div>
    </details>
  `,
})
export class LanguagePicker {
  readonly label = input.required<string>();
  readonly languages = input.required<readonly SupportedLanguage[]>();
  readonly value = input.required<LanguageCode>();
  readonly valueChange = output<LanguageCode>();
  private readonly picker = viewChild<ElementRef<HTMLDetailsElement>>('picker');
  protected readonly currentLanguage = computed(() =>
    this.languages().find((language) => language.code === this.value()),
  );

  protected selectLanguage(language: LanguageCode): void {
    this.valueChange.emit(language);
    const picker = this.picker()?.nativeElement;
    if (picker) picker.open = false;
  }
}
