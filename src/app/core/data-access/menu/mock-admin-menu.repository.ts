import { inject, Service } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AdminCategorySummary, AdminDishListRequest, AdminDishSummary, CategoryDraft, DishDraft, PageResult } from '../../../shared/models/admin-menu.model';
import { Category, CategoryId, Dish, DishId, RestaurantId } from '../../../shared/models/menu.model';
import { MockHttpClient } from '../../http/mock-http-client.service';
import { apiUrl } from '../../http/api-endpoints';
import { AdminMenuRepository } from './admin-menu.repository';
import { pandaHouseMenu, replaceMockMenuCategories } from './mock-menu.repository';

@Service()
export class MockAdminMenuRepository implements AdminMenuRepository {
  private readonly http = inject(MockHttpClient);

  getCategories(restaurantId: RestaurantId): Promise<readonly AdminCategorySummary[]> {
    return firstValueFrom(
      this.http.get(apiUrl(`/api/admin/restaurants/${restaurantId}/categories`), () => {
        if (restaurantId !== pandaHouseMenu.restaurant.id) {
          throw new Error(`Restaurant \"${restaurantId}\" was not found.`);
        }

        return pandaHouseMenu.categories
          .map<AdminCategorySummary>(({ category, dishes }) => ({
            category,
            dishCount: dishes.length,
          }))
          .sort((first, second) => first.category.sortOrder - second.category.sortOrder);
      }),
    );
  }

  createCategory(restaurantId: RestaurantId, draft: CategoryDraft): Promise<Category> {
    return firstValueFrom(
      this.http.post(apiUrl(`/api/admin/restaurants/${restaurantId}/categories`), draft, (request) => {
        this.assertRestaurant(restaurantId);
        const sortOrder = Math.max(0, ...pandaHouseMenu.categories.map(({ category }) => category.sortOrder)) + 1;
        const fallbackName = request.translations.find(({ languageCode }) => languageCode === 'en')?.name || 'category';
        const category: Category = {
          id: `${this.slugify(fallbackName)}-${Date.now()}`,
          restaurantId,
          image: request.imageUrl.trim() ? { url: request.imageUrl.trim(), width: 1200, height: 800 } : null,
          isVisible: request.isVisible,
          sortOrder,
          translations: request.translations,
        };
        replaceMockMenuCategories([...pandaHouseMenu.categories, { category, dishes: [] }]);
        return category;
      }),
    );
  }

  updateCategory(
    restaurantId: RestaurantId,
    categoryId: CategoryId,
    draft: CategoryDraft,
  ): Promise<Category> {
    return firstValueFrom(
      this.http.post(apiUrl(`/api/admin/restaurants/${restaurantId}/categories/${categoryId}`), draft, (request) => {
        this.assertRestaurant(restaurantId);
        let updatedCategory: Category | null = null;
        const categories = pandaHouseMenu.categories.map((menuCategory) => {
          if (menuCategory.category.id !== categoryId) {
            return menuCategory;
          }

          updatedCategory = {
            ...menuCategory.category,
            image: request.imageUrl.trim()
              ? { url: request.imageUrl.trim(), width: 1200, height: 800 }
              : null,
            isVisible: request.isVisible,
            translations: request.translations,
          };
          return { ...menuCategory, category: updatedCategory };
        });

        if (!updatedCategory) {
          throw new Error(`Category \"${categoryId}\" was not found.`);
        }
        replaceMockMenuCategories(categories);
        return updatedCategory;
      }),
    );
  }

  reorderCategories(restaurantId: RestaurantId, categoryIds: readonly CategoryId[]): Promise<void> {
    return firstValueFrom(
      this.http.post(apiUrl(`/api/admin/restaurants/${restaurantId}/categories/order`), { categoryIds }, (request) => {
        this.assertRestaurant(restaurantId);
        if (request.categoryIds.length !== pandaHouseMenu.categories.length) {
          throw new Error('The category order is incomplete.');
        }

        const byId = new Map(pandaHouseMenu.categories.map((menuCategory) => [menuCategory.category.id, menuCategory]));
        const reordered = request.categoryIds.map((categoryId, index) => {
          const menuCategory = byId.get(categoryId);
          if (!menuCategory) {
            throw new Error(`Category \"${categoryId}\" was not found.`);
          }
          return { ...menuCategory, category: { ...menuCategory.category, sortOrder: index + 1 } };
        });
        replaceMockMenuCategories(reordered);
      }),
    );
  }

  getDishes(restaurantId: RestaurantId, request: AdminDishListRequest): Promise<PageResult<AdminDishSummary>> {
    return firstValueFrom(
      this.http.get(apiUrl(`/api/admin/restaurants/${restaurantId}/dishes?page=${request.page}&pageSize=${request.pageSize}`), () => {
        this.assertRestaurant(restaurantId);
        const filtered = pandaHouseMenu.categories.flatMap(({ category, dishes }) =>
          dishes.map<AdminDishSummary>((dish) => ({ dish, category })),
        ).filter(({ dish, category }) => {
          const searchable = dish.translations.map(({ name }) => name).join(' ').toLocaleLowerCase();
          const matchesQuery = !request.query.trim() || searchable.includes(request.query.trim().toLocaleLowerCase());
          const matchesCategory = request.categoryId === 'all' || category.id === request.categoryId;
          const active = dish.isPublished && dish.isAvailable;
          const matchesStatus = request.status === 'all' || (request.status === 'active' ? active : !active);
          return matchesQuery && matchesCategory && matchesStatus;
        }).sort((first, second) => first.category.sortOrder - second.category.sortOrder || first.dish.sortOrder - second.dish.sortOrder);
        const start = (request.page - 1) * request.pageSize;
        return { page: request.page, pageSize: request.pageSize, totalItems: filtered.length, items: filtered.slice(start, start + request.pageSize) };
      }),
    );
  }

  createDish(restaurantId: RestaurantId, draft: DishDraft): Promise<Dish> {
    return firstValueFrom(
      this.http.post(apiUrl(`/api/admin/restaurants/${restaurantId}/dishes`), draft, (request) => {
        this.assertRestaurant(restaurantId);
        const target = pandaHouseMenu.categories.find(({ category }) => category.id === request.categoryId);
        if (!target) {
          throw new Error(`Category \"${request.categoryId}\" was not found.`);
        }
        const fallbackName = request.translations.find(({ languageCode }) => languageCode === 'en')?.name || 'dish';
        const dish: Dish = {
          id: `${this.slugify(fallbackName)}-${Date.now()}`,
          restaurantId,
          categoryId: target.category.id,
          image: request.imageUrl.trim() ? { url: request.imageUrl.trim(), width: 900, height: 600 } : null,
          price: { amountMinor: request.priceAmountMinor, currency: 'GEL' },
          calories: request.calories,
          isPublished: request.isPublished,
          isAvailable: request.isAvailable,
          sortOrder: Math.max(0, ...target.dishes.map(({ sortOrder }) => sortOrder)) + 1,
          translations: request.translations,
        };
        replaceMockMenuCategories(pandaHouseMenu.categories.map((menuCategory) =>
          menuCategory.category.id === target.category.id
            ? { ...menuCategory, dishes: [...menuCategory.dishes, dish] }
            : menuCategory,
        ));
        return dish;
      }),
    );
  }

  updateDish(restaurantId: RestaurantId, dishId: DishId, draft: DishDraft): Promise<Dish> {
    return firstValueFrom(
      this.http.post(apiUrl(`/api/admin/restaurants/${restaurantId}/dishes/${dishId}`), draft, (request) => {
        this.assertRestaurant(restaurantId);
        const source = pandaHouseMenu.categories.find(({ dishes }) => dishes.some(({ id }) => id === dishId));
        const target = pandaHouseMenu.categories.find(({ category }) => category.id === request.categoryId);
        const existing = source?.dishes.find(({ id }) => id === dishId);
        if (!source || !target || !existing) {
          throw new Error(`Dish \"${dishId}\" or its category was not found.`);
        }
        const moved = source.category.id !== target.category.id;
        const dish: Dish = {
          ...existing,
          categoryId: target.category.id,
          image: request.imageUrl.trim() ? { url: request.imageUrl.trim(), width: 900, height: 600 } : null,
          price: { amountMinor: request.priceAmountMinor, currency: 'GEL' },
          calories: request.calories,
          isPublished: request.isPublished,
          isAvailable: request.isAvailable,
          sortOrder: moved ? Math.max(0, ...target.dishes.map(({ sortOrder }) => sortOrder)) + 1 : existing.sortOrder,
          translations: request.translations,
        };
        replaceMockMenuCategories(pandaHouseMenu.categories.map((menuCategory) => {
          if (source.category.id === target.category.id && menuCategory.category.id === source.category.id) {
            return { ...menuCategory, dishes: menuCategory.dishes.map((candidate) => candidate.id === dishId ? dish : candidate) };
          }
          if (menuCategory.category.id === source.category.id) {
            return { ...menuCategory, dishes: menuCategory.dishes.filter(({ id }) => id !== dishId) };
          }
          if (menuCategory.category.id === target.category.id) {
            return { ...menuCategory, dishes: [...menuCategory.dishes, dish] };
          }
          return menuCategory;
        }));
        return dish;
      }),
    );
  }

  reorderDishes(restaurantId: RestaurantId, categoryId: CategoryId, dishIds: readonly DishId[]): Promise<void> {
    return firstValueFrom(
      this.http.post(apiUrl(`/api/admin/restaurants/${restaurantId}/categories/${categoryId}/dishes/order`), { dishIds }, (request) => {
        this.assertRestaurant(restaurantId);
        replaceMockMenuCategories(pandaHouseMenu.categories.map((menuCategory) => {
          if (menuCategory.category.id !== categoryId) {
            return menuCategory;
          }
          if (request.dishIds.length !== menuCategory.dishes.length) {
            throw new Error('The dish order is incomplete.');
          }
          const dishesById = new Map(menuCategory.dishes.map((dish) => [dish.id, dish]));
          return {
            ...menuCategory,
            dishes: request.dishIds.map((id, index) => {
              const dish = dishesById.get(id);
              if (!dish) {
                throw new Error(`Dish \"${id}\" was not found.`);
              }
              return { ...dish, sortOrder: index + 1 };
            }),
          };
        }));
      }),
    );
  }

  moveDish(restaurantId: RestaurantId, categoryId: CategoryId, dishId: DishId, targetDishId: DishId, placeAfter: boolean): Promise<void> {
    return firstValueFrom(
      this.http.post(apiUrl(`/api/admin/restaurants/${restaurantId}/categories/${categoryId}/dishes/move`), { dishId, targetDishId, placeAfter }, (request) => {
        this.assertRestaurant(restaurantId);
        replaceMockMenuCategories(pandaHouseMenu.categories.map((menuCategory) => {
          if (menuCategory.category.id !== categoryId) return menuCategory;
          const ordered = [...menuCategory.dishes].sort((first, second) => first.sortOrder - second.sortOrder);
          const fromIndex = ordered.findIndex(({ id }) => id === request.dishId);
          const targetIndex = ordered.findIndex(({ id }) => id === request.targetDishId);
          if (fromIndex < 0 || targetIndex < 0) throw new Error('The dish move target was not found.');
          const [moved] = ordered.splice(fromIndex, 1);
          const adjustedTarget = ordered.findIndex(({ id }) => id === request.targetDishId);
          ordered.splice(adjustedTarget + (request.placeAfter ? 1 : 0), 0, moved);
          return { ...menuCategory, dishes: ordered.map((dish, index) => ({ ...dish, sortOrder: index + 1 })) };
        }));
      }),
    );
  }

  private assertRestaurant(restaurantId: RestaurantId): void {
    if (restaurantId !== pandaHouseMenu.restaurant.id) {
      throw new Error(`Restaurant \"${restaurantId}\" was not found.`);
    }
  }

  private slugify(value: string): string {
    return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'category';
  }
}
