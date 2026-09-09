import { Component, inject, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../core/i18n/language.service';
import { PaletteName } from '../../../core/theme/theme.config';
import { ThemeService } from '../../../core/theme/theme.service';

interface PaletteOption {
  readonly name: PaletteName;
  readonly label: string;
}

const palettes: readonly PaletteOption[] = [
  { name: 'olive', label: 'Olive' },
  { name: 'wine', label: 'Wine' },
  { name: 'ocean', label: 'Ocean' },
  { name: 'sunset', label: 'Sunset' },
  { name: 'forest', label: 'Forest' },
  { name: 'royal', label: 'Royal' },
];

@Component({
  selector: 'app-admin-account-menu',
  imports: [MatIcon, MatMenu, MatMenuItem, MatMenuTrigger, TranslatePipe],
  styles: `
    :host {
      display: block;
    }
    .trigger {
      display: flex;
      align-items: center;
      gap: 0.55rem;
      inline-size: 100%;
      min-block-size: 2.35rem;
      border: 0;
      border-radius: 0.5rem;
      padding: 0.25rem;
      background: transparent;
      color: inherit;
      font: inherit;
      cursor: pointer;
      text-align: start;
    }
    .trigger:hover,
    .trigger:focus-visible {
      background: color-mix(in srgb, currentColor 12%, transparent);
    }
    .trigger:focus-visible {
      outline: 3px solid var(--color-focus);
      outline-offset: 2px;
    }
    .avatar {
      display: grid;
      flex: 0 0 auto;
      inline-size: 1.8rem;
      block-size: 1.8rem;
      place-items: center;
      border-radius: 50%;
      background: var(--color-primary);
      color: #fff;
      font-size: 0.7rem;
      font-weight: 700;
    }
    .email {
      overflow: hidden;
      flex: 1;
      color: color-mix(in srgb, currentColor 78%, transparent);
      font-size: 0.67rem;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .trigger mat-icon {
      inline-size: 1.1rem;
      block-size: 1.1rem;
      font-size: 1.1rem;
    }
    .trigger.compact {
      inline-size: 2.35rem;
      justify-content: center;
      padding: 0.2rem;
    }
    .trigger.compact .more {
      display: none;
    }
    .flag {
      inline-size: 1.4rem;
      block-size: 0.95rem;
      border-radius: 0.1rem;
      object-fit: cover;
    }
    .selected {
      color: var(--color-primary);
      margin-inline-start: auto;
    }
  `,
  template: `
    <button
      class="trigger"
      [class.compact]="compact()"
      type="button"
      [attr.aria-label]="email()"
      [matMenuTriggerFor]="accountMenu"
    >
      <span class="avatar">{{ email().charAt(0).toUpperCase() }}</span>
      @if (!compact()) {
        <span class="email">{{ email() }}</span>
      }
      <mat-icon class="more" aria-hidden="true">more_vert</mat-icon>
    </button>
    <mat-menu #accountMenu="matMenu" class="admin-context-menu">
      <button mat-menu-item [matMenuTriggerFor]="paletteMenu">
        <mat-icon>palette</mat-icon>{{ 'CUSTOMER.APPEARANCE.PALETTE' | translate }}
      </button>
      <button mat-menu-item [matMenuTriggerFor]="themeMenu">
        <mat-icon>contrast</mat-icon>{{ 'CUSTOMER.APPEARANCE.MODE' | translate }}
      </button>
      <button mat-menu-item [matMenuTriggerFor]="languageMenu">
        <mat-icon>language</mat-icon>{{ 'CUSTOMER.APPEARANCE.LANGUAGE' | translate }}
      </button>
      <button class="sign-out-item" mat-menu-item (click)="signOut.emit()">
        <mat-icon>logout</mat-icon>{{ 'ADMIN.NAVIGATION.SIGN_OUT' | translate }}
      </button>
    </mat-menu>
    <mat-menu #paletteMenu="matMenu" class="admin-context-menu">
      @for (palette of palettes; track palette.name) {
        <button mat-menu-item (click)="themeService.setPalette(palette.name)">
          <mat-icon>{{
            themeService.theme().palette === palette.name ? 'check' : 'circle'
          }}</mat-icon
          >{{ palette.label }}
        </button>
      }
    </mat-menu>
    <mat-menu #themeMenu="matMenu" class="admin-context-menu">
      <button mat-menu-item (click)="themeService.setColorMode('light')">
        <mat-icon>{{ themeService.theme().mode === 'light' ? 'check' : 'light_mode' }}</mat-icon
        >{{ 'CUSTOMER.APPEARANCE.LIGHT' | translate }}
      </button>
      <button mat-menu-item (click)="themeService.setColorMode('dark')">
        <mat-icon>{{ themeService.theme().mode === 'dark' ? 'check' : 'dark_mode' }}</mat-icon
        >{{ 'CUSTOMER.APPEARANCE.DARK' | translate }}
      </button>
    </mat-menu>
    <mat-menu #languageMenu="matMenu" class="admin-context-menu">
      @for (language of languageService.availableLanguages; track language.code) {
        <button mat-menu-item (click)="languageService.changeLanguage(language.code)">
          <img class="flag" [alt]="''" [src]="language.flagUrl" /><span>{{ language.label }}</span>
          @if (language.code === languageService.currentLanguage()) {
            <mat-icon class="selected">check</mat-icon>
          }
        </button>
      }
    </mat-menu>
  `,
})
export class AdminAccountMenu {
  readonly email = input.required<string>();
  readonly compact = input(false);
  readonly signOut = output<void>();
  protected readonly themeService = inject(ThemeService);
  protected readonly languageService = inject(LanguageService);
  protected readonly palettes = palettes;
}
