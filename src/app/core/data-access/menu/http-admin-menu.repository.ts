import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { apiUrl } from '../../http/api-endpoints';
import { AdminCategorySummary, AdminDishListRequest, AdminDishSummary, CategoryDraft, DishDraft, PageResult } from '../../../shared/models/admin-menu.model';
import { Category, CategoryId, Dish, DishId, RestaurantId } from '../../../shared/models/menu.model';
import { AdminMenuRepository } from './admin-menu.repository';

@Service()
export class HttpAdminMenuRepository implements AdminMenuRepository {
  private readonly http = inject(HttpClient);

  getCategories(restaurantId: RestaurantId): Promise<readonly AdminCategorySummary[]> {
    return firstValueFrom(this.http.get<readonly AdminCategorySummary[]>(apiUrl(`/api/admin/restaurants/${restaurantId}/categories`)));
  }

  createCategory(restaurantId: RestaurantId, draft: CategoryDraft): Promise<Category> {
    return firstValueFrom(this.http.post<Category>(apiUrl(`/api/admin/restaurants/${restaurantId}/categories`), draft));
  }

  updateCategory(restaurantId: RestaurantId, categoryId: CategoryId, draft: CategoryDraft): Promise<Category> {
    return firstValueFrom(this.http.post<Category>(apiUrl(`/api/admin/restaurants/${restaurantId}/categories/${categoryId}`), draft));
  }

  async deleteCategory(restaurantId: RestaurantId, categoryId: CategoryId): Promise<void> {
    await firstValueFrom(this.http.post<void>(apiUrl(`/api/admin/restaurants/${restaurantId}/categories/${categoryId}/delete`), {}));
  }

  async reorderCategories(restaurantId: RestaurantId, categoryIds: readonly CategoryId[]): Promise<void> {
    await firstValueFrom(this.http.post<void>(apiUrl(`/api/admin/restaurants/${restaurantId}/categories/order`), { categoryIds }));
  }

  getDishes(restaurantId: RestaurantId, request: AdminDishListRequest): Promise<PageResult<AdminDishSummary>> {
    const params = new HttpParams()
      .set('page', request.page)
      .set('pageSize', request.pageSize)
      .set('categoryId', request.categoryId)
      .set('query', request.query)
      .set('status', request.status);
    return firstValueFrom(this.http.get<PageResult<AdminDishSummary>>(apiUrl(`/api/admin/restaurants/${restaurantId}/dishes`), { params }));
  }

  createDish(restaurantId: RestaurantId, draft: DishDraft): Promise<Dish> {
    return firstValueFrom(this.http.post<Dish>(apiUrl(`/api/admin/restaurants/${restaurantId}/dishes`), draft));
  }

  updateDish(restaurantId: RestaurantId, dishId: DishId, draft: DishDraft): Promise<Dish> {
    return firstValueFrom(this.http.post<Dish>(apiUrl(`/api/admin/restaurants/${restaurantId}/dishes/${dishId}`), draft));
  }

  setDishStatus(restaurantId: RestaurantId, dishId: DishId, status: Pick<Dish, 'isAvailable' | 'isPublished'>): Promise<Dish> {
    return firstValueFrom(this.http.post<Dish>(apiUrl(`/api/admin/restaurants/${restaurantId}/dishes/${dishId}/status`), status));
  }

  async deleteDish(restaurantId: RestaurantId, dishId: DishId): Promise<void> {
    await firstValueFrom(this.http.post<void>(apiUrl(`/api/admin/restaurants/${restaurantId}/dishes/${dishId}/delete`), {}));
  }

  async reorderDishes(restaurantId: RestaurantId, categoryId: CategoryId, dishIds: readonly DishId[]): Promise<void> {
    await firstValueFrom(this.http.post<void>(apiUrl(`/api/admin/restaurants/${restaurantId}/categories/${categoryId}/dishes/order`), { dishIds }));
  }

  async moveDish(restaurantId: RestaurantId, categoryId: CategoryId, dishId: DishId, targetDishId: DishId, placeAfter: boolean): Promise<void> {
    await firstValueFrom(this.http.post<void>(apiUrl(`/api/admin/restaurants/${restaurantId}/categories/${categoryId}/dishes/move`), { dishId, targetDishId, placeAfter }));
  }
}
