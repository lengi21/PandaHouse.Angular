import { InjectionToken } from '@angular/core';
import { RestaurantSettingsDraft } from '../../../shared/models/restaurant-settings.model';
import { Restaurant, RestaurantId } from '../../../shared/models/menu.model';

export interface AdminRestaurantRepository {
  getRestaurant(restaurantId: RestaurantId): Promise<Restaurant>;
  updateRestaurant(restaurantId: RestaurantId, draft: RestaurantSettingsDraft): Promise<Restaurant>;
}

export const ADMIN_RESTAURANT_REPOSITORY = new InjectionToken<AdminRestaurantRepository>('ADMIN_RESTAURANT_REPOSITORY');
