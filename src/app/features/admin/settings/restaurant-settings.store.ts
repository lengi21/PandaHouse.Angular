import { inject, Service, signal } from '@angular/core';
import { ADMIN_RESTAURANT_REPOSITORY } from '../../../core/data-access/restaurant/admin-restaurant.repository';
import { RestaurantSettingsDraft } from '../../../shared/models/restaurant-settings.model';
import { Restaurant } from '../../../shared/models/menu.model';
import { DEFAULT_RESTAURANT_ID } from '../../customer/menu/customer-menu.store';
import { RequestExecutor } from '../../../core/http/request-executor.service';

@Service()
export class RestaurantSettingsStore {
  private readonly repository = inject(ADMIN_RESTAURANT_REPOSITORY);
  private readonly requests = inject(RequestExecutor);
  private readonly restaurantState = signal<Restaurant | null>(null);
  private readonly loadingState = signal(false);
  private readonly errorState = signal(false);
  readonly restaurant = this.restaurantState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly hasError = this.errorState.asReadonly();

  load(): void {
    if (this.loadingState()) return;
    this.loadingState.set(true);
    this.errorState.set(false);
    void this.requests.run(() => this.repository.getRestaurant(DEFAULT_RESTAURANT_ID)).then((restaurant) => this.restaurantState.set(restaurant)).catch(() => this.errorState.set(true)).finally(() => this.loadingState.set(false));
  }

  save(draft: RestaurantSettingsDraft): Promise<Restaurant> {
    return this.requests.run(() => this.repository.updateRestaurant(DEFAULT_RESTAURANT_ID, draft), { action: true, successKey: 'ADMIN.FEEDBACK.SAVED' }).then((restaurant) => { this.restaurantState.set(restaurant); return restaurant; });
  }
}
