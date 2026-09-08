export const PALETTES = ['olive', 'wine'] as const;
export const COLOR_MODES = ['light', 'dark'] as const;

export type PaletteName = (typeof PALETTES)[number];
export type ColorMode = (typeof COLOR_MODES)[number];

export interface ThemePreference {
  readonly palette: PaletteName;
  readonly mode: ColorMode;
}

export const DEFAULT_THEME: ThemePreference = {
  palette: 'olive',
  mode: 'light',
};

export function isThemePreference(value: string | null): value is `${PaletteName}:${ColorMode}` {
  return value !== null && PALETTES.some((palette) => value.startsWith(`${palette}:`));
}
