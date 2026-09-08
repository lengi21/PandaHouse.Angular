import { DOCUMENT } from '@angular/common';
import { effect, inject, signal } from '@angular/core';
import {
  COLOR_MODES,
  ColorMode,
  DEFAULT_THEME,
  PALETTES,
  PaletteName,
  ThemePreference,
} from './theme.config';
import { LocalStorageService } from '../storage/local-storage.service';
import { Service } from '@angular/core';

const themeStorageKey = 'panda-house.theme';

@Service()
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly storage = inject(LocalStorageService);
  private readonly preference = signal<ThemePreference>(this.restorePreference());

  readonly theme = this.preference.asReadonly();
  readonly palettes = PALETTES;
  readonly colorModes = COLOR_MODES;

  constructor() {
    effect(() => {
      const { mode, palette } = this.preference();
      this.document.documentElement.dataset['colorMode'] = mode;
      this.document.documentElement.dataset['palette'] = palette;
      this.storage.set(themeStorageKey, `${palette}:${mode}`);
    });
  }

  setPalette(palette: PaletteName): void {
    this.preference.update((theme) => ({ ...theme, palette }));
  }

  setColorMode(mode: ColorMode): void {
    this.preference.update((theme) => ({ ...theme, mode }));
  }

  toggleColorMode(): void {
    this.preference.update((theme) => ({
      ...theme,
      mode: theme.mode === 'light' ? 'dark' : 'light',
    }));
  }

  private restorePreference(): ThemePreference {
    const [palette, mode] = this.storage.get(themeStorageKey)?.split(':') ?? [];

    if (PALETTES.includes(palette as PaletteName) && COLOR_MODES.includes(mode as ColorMode)) {
      return { palette: palette as PaletteName, mode: mode as ColorMode };
    }

    return DEFAULT_THEME;
  }
}
