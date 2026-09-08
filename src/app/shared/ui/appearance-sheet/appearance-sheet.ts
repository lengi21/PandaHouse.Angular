import { Component, inject, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { LanguageService } from '../../../core/i18n/language.service';
import { PaletteName } from '../../../core/theme/theme.config';
import { ThemeService } from '../../../core/theme/theme.service';
import { BottomSheet } from '../bottom-sheet/bottom-sheet';

interface PaletteOption {
  readonly name: PaletteName;
  readonly label: string;
  readonly color: string;
}

const paletteOptions: readonly PaletteOption[] = [
  { name: 'olive', label: 'Olive', color: '#285b28' },
  { name: 'wine', label: 'Wine', color: '#7b2639' },
  { name: 'ocean', label: 'Ocean', color: '#174a7a' },
  { name: 'sunset', label: 'Sunset', color: '#f16e45' },
  { name: 'forest', label: 'Forest', color: '#16603d' },
  { name: 'royal', label: 'Royal', color: '#4b2d8e' },
];

@Component({
  selector: 'app-appearance-sheet',
  imports: [BottomSheet, MatIcon, TranslatePipe],
  styles: `
    h2, h3 { margin: 0; } h2 { font-size: 1.25rem; } h3 { margin-block-start: 1.2rem; font-size: .85rem; }
    .close { position: absolute; inset: .65rem .65rem auto auto; display: grid; inline-size: 2.4rem; block-size: 2.4rem; place-items: center; border: 0; border-radius: 50%; background: transparent; color: var(--color-text); }
    .close mat-icon { inline-size: 1.3rem; block-size: 1.3rem; font-size: 1.3rem; } .close:focus-visible, button:focus-visible { outline: 3px solid var(--color-focus); outline-offset: 2px; }
    .palette-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .85rem .5rem; margin-block-start: .85rem; }
    .palette { display: grid; justify-items: center; gap: .35rem; border: 0; background: transparent; color: var(--color-text); font: inherit; font-size: .68rem; }
    .swatch { display: block; inline-size: 2.35rem; block-size: 2.35rem; border: 2px solid transparent; border-radius: 50%; background: var(--swatch); box-shadow: 0 0 0 1px color-mix(in srgb, var(--color-text) 14%, transparent); }
    .palette.active .swatch { border-color: var(--color-panel); box-shadow: 0 0 0 2px var(--color-primary); }
    .mode-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .65rem; margin-block-start: .7rem; }
    .mode { display: flex; align-items: center; justify-content: center; gap: .5rem; min-block-size: 2.8rem; border: 1px solid color-mix(in srgb, var(--color-text) 10%, transparent); border-radius: .7rem; background: color-mix(in srgb, var(--color-text) 4%, transparent); color: var(--color-text); font: inherit; font-size: .82rem; font-weight: 700; }
    .mode mat-icon { inline-size: 1.2rem; block-size: 1.2rem; font-size: 1.2rem; } .mode.active { border-color: var(--color-primary); background: var(--color-shell); color: var(--color-shell-text); }
    .languages { display: grid; margin-block-start: .7rem; border: 1px solid color-mix(in srgb, var(--color-text) 11%, transparent); border-radius: .75rem; overflow: hidden; }
    .language { display: grid; grid-template-columns: 2rem minmax(0, 1fr) 1.4rem; align-items: center; min-block-size: 3.1rem; gap: .55rem; border: 0; border-bottom: 1px solid color-mix(in srgb, var(--color-text) 9%, transparent); padding: .4rem .7rem; background: transparent; color: var(--color-text); font: inherit; text-align: start; }
    .language:last-child { border-bottom: 0; } .flag { inline-size: 1.55rem; block-size: 1.05rem; border-radius: .12rem; box-shadow: 0 0 0 1px rgb(0 0 0 / 12%); object-fit: cover; } .language mat-icon { color: var(--color-primary); font-size: 1.2rem; }
    .admin-login { display: flex; align-items: center; justify-content: center; gap: .5rem; inline-size: 100%; min-block-size: 2.9rem; margin-block-start: 1.2rem; border: 1px solid var(--color-primary); border-radius: .7rem; background: transparent; color: var(--color-primary); font: inherit; font-size: .85rem; font-weight: 700; }
    .admin-login mat-icon { inline-size: 1.2rem; block-size: 1.2rem; font-size: 1.2rem; }
  `,
  template: `
    <app-bottom-sheet [ariaLabel]="'CUSTOMER.APPEARANCE.TITLE' | translate" (closed)="closed.emit()">
      <h2>{{ 'CUSTOMER.APPEARANCE.TITLE' | translate }}</h2>
      <button class="close" type="button" [attr.aria-label]="'CUSTOMER.APPEARANCE.CLOSE' | translate" (click)="closed.emit()"><mat-icon aria-hidden="true">close</mat-icon></button>
      <h3>{{ 'CUSTOMER.APPEARANCE.PALETTE' | translate }}</h3>
      <div class="palette-grid">
        @for (palette of paletteOptions; track palette.name) {
          <button class="palette" type="button" [attr.aria-pressed]="themeService.theme().palette === palette.name" [class.active]="themeService.theme().palette === palette.name" (click)="themeService.setPalette(palette.name)"><span aria-hidden="true" class="swatch" [style.--swatch]="palette.color"></span><span>{{ palette.label }}</span></button>
        }
      </div>
      <h3>{{ 'CUSTOMER.APPEARANCE.MODE' | translate }}</h3>
      <div class="mode-grid">
        <button class="mode" type="button" [class.active]="themeService.theme().mode === 'light'" (click)="themeService.setColorMode('light')"><mat-icon aria-hidden="true">light_mode</mat-icon>{{ 'CUSTOMER.APPEARANCE.LIGHT' | translate }}</button>
        <button class="mode" type="button" [class.active]="themeService.theme().mode === 'dark'" (click)="themeService.setColorMode('dark')"><mat-icon aria-hidden="true">dark_mode</mat-icon>{{ 'CUSTOMER.APPEARANCE.DARK' | translate }}</button>
      </div>
      <h3>{{ 'CUSTOMER.APPEARANCE.LANGUAGE' | translate }}</h3>
      <div class="languages">
        @for (language of languageService.availableLanguages; track language.code) {
          <button class="language" type="button" [attr.aria-pressed]="language.code === languageService.currentLanguage()" (click)="languageService.changeLanguage(language.code)"><img [alt]="''" class="flag" [src]="language.flagUrl" /><span>{{ language.label }}</span>@if (language.code === languageService.currentLanguage()) { <mat-icon aria-label="Selected">check_circle</mat-icon> }</button>
        }
      </div>
      <button class="admin-login" type="button" (click)="openAdminLogin()"><mat-icon aria-hidden="true">admin_panel_settings</mat-icon>{{ 'CUSTOMER.APPEARANCE.ADMIN_LOGIN' | translate }}</button>
    </app-bottom-sheet>
  `,
})
export class AppearanceSheet {
  protected readonly themeService = inject(ThemeService);
  protected readonly languageService = inject(LanguageService);
  private readonly router = inject(Router);
  protected readonly paletteOptions = paletteOptions;
  readonly closed = output<void>();

  protected openAdminLogin(): void {
    this.closed.emit();
    void this.router.navigate(['/admin/sign-in']);
  }
}
