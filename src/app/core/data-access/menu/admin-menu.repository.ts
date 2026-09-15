import { InjectionToken } from '@angular/core';
import { AdminCategorySummary, AdminDishListRequest, AdminDishSummary, CategoryDraft, DishDraft, PageResult } from '../../../shared/models/admin-menu.model';
import { Category, CategoryId, Dish, DishId, RestaurantId } from '../../../shared/models/menu.model';

export interface AdminMenuRepository {
  getCategories(restaurantId: RestaurantId): Promise<readonly AdminCategorySummary[]>;
  createCategory(restaurantId: RestaurantId, draft: CategoryDraft): Promise<Category>;
  updateCategory(restaurantId: RestaurantId, categoryId: CategoryId, draft: CategoryDraft): Promise<Category>;
  deleteCategory(restaurantId: RestaurantId, categoryId: CategoryId): Promise<void>;
  reorderCategories(restaurantId: RestaurantId, categoryIds: readonly CategoryId[]): Promise<void>;
  getDishes(restaurantId: RestaurantId, request: AdminDishListRequest): Promise<PageResult<AdminDishSummary>>;
  createDish(restaurantId: RestaurantId, draft: DishDraft): Promise<Dish>;
  updateDish(restaurantId: RestaurantId, dishId: DishId, draft: DishDraft): Promise<Dish>;
  setDishStatus(restaurantId: RestaurantId, dishId: DishId, status: Pick<Dish, 'isAvailable' | 'isPublished'>): Promise<Dish>;
  deleteDish(restaurantId: RestaurantId, dishId: DishId): Promise<void>;
  reorderDishes(restaurantId: RestaurantId, categoryId: CategoryId, dishIds: readonly DishId[]): Promise<void>;
  moveDish(restaurantId: RestaurantId, categoryId: CategoryId, dishId: DishId, targetDishId: DishId, placeAfter: boolean): Promise<void>;
}

export const ADMIN_MENU_REPOSITORY = new InjectionToken<AdminMenuRepository>('ADMIN_MENU_REPOSITORY');
