import { MediaAsset } from './media.model';
import { Money } from './money.model';
import { DescribedTranslation, NamedTranslation } from './translation.model';

export type RestaurantId = string;
export type CategoryId = string;
export type DishId = string;

export interface Restaurant {
  readonly id: RestaurantId;
  readonly name: string;
  readonly logo: MediaAsset | null;
  readonly coverImage: MediaAsset | null;
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
