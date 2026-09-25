export type QrAnalyticsLanguage = 'ka' | 'en' | 'ru';
export type QrAnalyticsEventType = 'SCAN' | 'CATEGORY_VIEW' | 'DISH_VIEW';

export interface QrAnalyticsReport {
  readonly days: number;
  readonly since: string;
  readonly scanCount: number;
  readonly dishViewCount: number;
  readonly categoryVisitCount: number;
  readonly mostViewedDishes: readonly { readonly dishId: string; readonly views: number; readonly translations: readonly QrAnalyticsTranslation[] }[];
  readonly categoryVisits: readonly { readonly categoryId: string; readonly visits: number; readonly translations: readonly QrAnalyticsTranslation[] }[];
  readonly languages: readonly { readonly languageCode: QrAnalyticsLanguage; readonly count: number }[];
  readonly devices: readonly { readonly deviceType: string; readonly count: number }[];
}

export interface QrAnalyticsTranslation {
  readonly languageCode: QrAnalyticsLanguage;
  readonly name: string;
}