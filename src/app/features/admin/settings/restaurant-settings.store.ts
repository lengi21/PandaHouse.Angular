import { inject, Service, signal } from '@angular/core';
import { ADMIN_RESTAURANT_REPOSITORY } from '../../../core/data-access/restaurant/admin-restaurant.repository';
import { RestaurantSettingsDraft } from '../../../shared/models/restaurant-settings.model';
import { Restaurant } from '../../../shared/models/menu.model';
import { DEFAULT_RESTAURANT_ID } from '../../customer/menu/customer-menu.store';

@Service()
export class RestaurantSettingsStore {
  private readonly repository = inject(ADMIN_RESTAURANT_REPOSITORY);
  private readonly restaurantState = signal<Restaurant | null>(null);
  private readonly loadingState = signal(false);
  readonly restaurant = this.restaurantState.asReadonly();
  readonly loading = this.loadingState.asReadonly();

  load(): void {
    if (this.loadingState()) return;
    this.loadingState.set(true);
    void this.repository.getRestaurant(DEFAULT_RESTAURANT_ID).then((restaurant) => this.restaurantState.set(restaurant)).finally(() => this.loadingState.set(false));
  }

  save(draft: RestaurantSettingsDraft): Promise<Restaurant> {
    return this.repository.updateRestaurant(DEFAULT_RESTAURANT_ID, draft).then((restaurant) => { this.restaurantState.set(restaurant); return restaurant; });
  }
}
