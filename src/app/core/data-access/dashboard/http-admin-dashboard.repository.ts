import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AdminDashboardSummary } from '../../../shared/models/admin-dashboard.model';
import { RestaurantId } from '../../../shared/models/menu.model';
import { apiUrl } from '../../http/api-endpoints';
import { AdminDashboardRepository } from './admin-dashboard.repository';

@Service()
export class HttpAdminDashboardRepository implements AdminDashboardRepository {
  private readonly http = inject(HttpClient);

  getDashboard(restaurantId: RestaurantId): Promise<AdminDashboardSummary> {
    return firstValueFrom(this.http.get<AdminDashboardSummary>(apiUrl(`/api/admin/restaurants/${restaurantId}/dashboard`)));
  }
}
