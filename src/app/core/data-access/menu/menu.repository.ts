import { InjectionToken } from '@angular/core';
import {
  CustomerMenuOverview,
  Dish,
  RestaurantId,
} from '../../../shared/models/menu.model';

export interface MenuRepository {
  getCustomerMenuOverview(restaurantId: RestaurantId): Promise<CustomerMenuOverview>;
  getMenuDishes(restaurantId: RestaurantId): Promise<readonly Dish[]>;
}

export const MENU_REPOSITORY = new InjectionToken<MenuRepository>('MENU_REPOSITORY');
