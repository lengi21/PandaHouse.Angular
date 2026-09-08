import { InjectionToken } from '@angular/core';
import { CustomerMenu, RestaurantId } from '../../../shared/models/menu.model';

export interface MenuRepository {
  getCustomerMenu(restaurantId: RestaurantId): Promise<CustomerMenu>;
}

export const MENU_REPOSITORY = new InjectionToken<MenuRepository>('MENU_REPOSITORY');
