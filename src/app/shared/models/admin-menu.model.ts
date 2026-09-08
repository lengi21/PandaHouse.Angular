import { Category, CategoryId, CategoryTranslation, Dish, DishTranslation } from './menu.model';

export interface AdminCategorySummary {
  readonly category: Category;
  readonly dishCount: number;
}

export interface CategoryDraft {
  readonly imageUrl: string;
  readonly isVisible: boolean;
  readonly translations: readonly CategoryTranslation[];
}

export interface AdminDishSummary {
  readonly dish: Dish;
  readonly category: Category;
}

export interface DishDraft {
  readonly categoryId: CategoryId;
  readonly imageUrl: string;
  readonly priceAmountMinor: number;
  readonly calories: number | null;
  readonly isPublished: boolean;
  readonly isAvailable: boolean;
  readonly translations: readonly DishTranslation[];
}

export interface PageRequest {
  readonly page: number;
  readonly pageSize: number;
}

export interface PageResult<T> extends PageRequest {
  readonly items: readonly T[];
  readonly totalItems: number;
}

export interface AdminDishListRequest extends PageRequest {
  readonly categoryId: string;
  readonly query: string;
  readonly status: 'all' | 'active' | 'paused';
}
