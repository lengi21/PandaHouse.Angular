import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { apiUrl } from '../../http/api-endpoints';
import {
  CustomerMenuOverview,
  Dish,
  RestaurantId,
} from '../../../shared/models/menu.model';
import { MenuRepository } from './menu.repository';

@Service()
export class HttpMenuRepository implements MenuRepository {
  private readonly http = inject(HttpClient);

  getCustomerMenuOverview(restaurantId: RestaurantId): Promise<CustomerMenuOverview> {
    return firstValueFrom(
      this.http.get<CustomerMenuOverview>(apiUrl(`/api/restaurants/${restaurantId}/menu-overview`)),
    );
  }

  getMenuDishes(restaurantId: RestaurantId): Promise<readonly Dish[]> {
    return firstValueFrom(
      this.http.get<readonly Dish[]>(apiUrl(`/api/restaurants/${restaurantId}/dishes`)),
    );
  }
}
