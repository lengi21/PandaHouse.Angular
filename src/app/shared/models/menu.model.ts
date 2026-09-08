import { MediaAsset } from './media.model';
import { Money } from './money.model';
import { DescribedTranslation, NamedTranslation } from './translation.model';

export type RestaurantId = string;
export type CategoryId = string;
export type DishId = string;

export type Weekday =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export interface RestaurantTranslation extends NamedTranslation {
  readonly description: string;
}

export interface OpeningHours {
  readonly day: Weekday;
  readonly opensAt: string;
  readonly closesAt: string;
}

export interface SocialLink {
  readonly platform: 'facebook' | 'instagram';
  readonly url: string;
}

export interface Restaurant {
  readonly id: RestaurantId;
  readonly logo: MediaAsset | null;
  readonly coverImage: MediaAsset | null;
  readonly translations: readonly RestaurantTranslation[];
  readonly address: string;
  readonly phone: string;
  readonly openingHours: readonly OpeningHours[];
  readonly socialLinks: readonly SocialLink[];
}

export interface CategoryTranslation extends NamedTranslation {}

export interface Category {
  readonly id: CategoryId;
  readonly restaurantId: RestaurantId;
  readonly image: MediaAsset | null;
  readonly isVisible: boolean;
  readonly sortOrder: number;
  readonly translations: readonly CategoryTranslation[];
}

export interface DishTranslation extends DescribedTranslation {}

export interface Dish {
  readonly id: DishId;
  readonly restaurantId: RestaurantId;
  readonly categoryId: CategoryId;
  readonly image: MediaAsset | null;
  readonly price: Money;
  readonly isPublished: boolean;
  readonly isAvailable: boolean;
  readonly sortOrder: number;
  readonly translations: readonly DishTranslation[];
}

export interface MenuCategory {
  readonly category: Category;
  readonly dishes: readonly Dish[];
}

export interface CustomerMenu {
  readonly restaurant: Restaurant;
  readonly categories: readonly MenuCategory[];
}
