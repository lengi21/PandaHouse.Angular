import { OpeningHours, RestaurantTranslation, SocialLink } from './menu.model';

export interface RestaurantSettingsDraft {
  readonly logoUrl: string;
  readonly coverImageUrl: string;
  readonly translations: readonly RestaurantTranslation[];
  readonly address: string;
  readonly phone: string;
  readonly openingHours: readonly OpeningHours[];
  readonly socialLinks: readonly SocialLink[];
}
