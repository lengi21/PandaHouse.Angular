import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { RestaurantSettingsDraft } from '../../../shared/models/restaurant-settings.model';
import { Restaurant, RestaurantId } from '../../../shared/models/menu.model';
import { apiUrl } from '../../http/api-endpoints';
import { AdminRestaurantRepository } from './admin-restaurant.repository';

@Service()
export class HttpAdminRestaurantRepository implements AdminRestaurantRepository {
  private readonly http = inject(HttpClient);

  getRestaurant(restaurantId: RestaurantId): Promise<Restaurant> {
    return firstValueFrom(this.http.get<Restaurant>(apiUrl(`/api/admin/restaurants/${restaurantId}`)));
  }

  updateRestaurant(restaurantId: RestaurantId, draft: RestaurantSettingsDraft): Promise<Restaurant> {
    return firstValueFrom(this.http.post<Restaurant>(apiUrl(`/api/admin/restaurants/${restaurantId}`), draft));
  }
}
