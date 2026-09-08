import { inject, Service } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AdminDashboardSummary } from '../../../shared/models/admin-dashboard.model';
import { RestaurantId } from '../../../shared/models/menu.model';
import { apiUrl } from '../../http/api-endpoints';
import { MockHttpClient } from '../../http/mock-http-client.service';
import { pandaHouseMenu } from '../menu/mock-menu.repository';
import { AdminDashboardRepository } from './admin-dashboard.repository';

@Service()
export class MockAdminDashboardRepository implements AdminDashboardRepository {
  private readonly http = inject(MockHttpClient);

  getDashboard(restaurantId: RestaurantId): Promise<AdminDashboardSummary> {
    return firstValueFrom(this.http.get(apiUrl(`/api/admin/restaurants/${restaurantId}/dashboard`), () => {
      if (restaurantId !== pandaHouseMenu.restaurant.id) throw new Error('Restaurant was not found.');
      const dishes = pandaHouseMenu.categories.flatMap(({ category, dishes: categoryDishes }) => categoryDishes.map((dish) => ({ category, dish })));
      return {
        categoryCount: pandaHouseMenu.categories.length,
        dishCount: dishes.length,
        publishedDishCount: dishes.filter(({ dish }) => dish.isPublished).length,
        availableDishCount: dishes.filter(({ dish }) => dish.isAvailable).length,
        recentDishes: dishes.slice(-5).reverse(),
      };
    }));
  }
}
