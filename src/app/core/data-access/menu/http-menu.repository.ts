import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { apiUrl } from '../../http/api-endpoints';
import { CustomerMenu, RestaurantId } from '../../../shared/models/menu.model';
import { MenuRepository } from './menu.repository';

@Service()
export class HttpMenuRepository implements MenuRepository {
  private readonly http = inject(HttpClient);

  getCustomerMenu(restaurantId: RestaurantId): Promise<CustomerMenu> {
    return firstValueFrom(this.http.get<CustomerMenu>(apiUrl(`/api/restaurants/${restaurantId}/customer-menu`)));
  }
}
