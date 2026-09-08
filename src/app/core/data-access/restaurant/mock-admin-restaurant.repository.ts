import { inject, Service } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { RestaurantSettingsDraft } from '../../../shared/models/restaurant-settings.model';
import { Restaurant, RestaurantId } from '../../../shared/models/menu.model';
import { apiUrl } from '../../http/api-endpoints';
import { MockHttpClient } from '../../http/mock-http-client.service';
import { pandaHouseMenu, replaceMockRestaurant } from '../menu/mock-menu.repository';
import { AdminRestaurantRepository } from './admin-restaurant.repository';

@Service()
export class MockAdminRestaurantRepository implements AdminRestaurantRepository {
  private readonly http = inject(MockHttpClient);

  getRestaurant(restaurantId: RestaurantId): Promise<Restaurant> {
    return firstValueFrom(this.http.get(apiUrl(`/api/admin/restaurants/${restaurantId}`), () => this.restaurant(restaurantId)));
  }

  updateRestaurant(restaurantId: RestaurantId, draft: RestaurantSettingsDraft): Promise<Restaurant> {
    return firstValueFrom(this.http.post(apiUrl(`/api/admin/restaurants/${restaurantId}`), draft, (request) => {
      const current = this.restaurant(restaurantId);
      const restaurant: Restaurant = {
        ...current,
        logo: request.logoUrl.trim() ? { url: request.logoUrl.trim(), width: 600, height: 600 } : null,
        coverImage: request.coverImageUrl.trim() ? { url: request.coverImageUrl.trim(), width: 1600, height: 900 } : null,
        translations: request.translations,
        address: request.address,
        phone: request.phone,
        openingHours: request.openingHours,
        socialLinks: request.socialLinks,
      };
      replaceMockRestaurant(restaurant);
      return restaurant;
    }));
  }

  private restaurant(restaurantId: RestaurantId): Restaurant {
    if (restaurantId !== pandaHouseMenu.restaurant.id) throw new Error('Restaurant was not found.');
    return pandaHouseMenu.restaurant;
  }
}
