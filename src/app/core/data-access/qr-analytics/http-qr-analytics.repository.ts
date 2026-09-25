import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { QrAnalyticsRepository } from './qr-analytics.repository';
import { RestaurantId } from '../../../shared/models/menu.model';
import { QrAnalyticsReport } from '../../../shared/models/qr-analytics.model';
import { apiUrl } from '../../http/api-endpoints';

@Service()
export class HttpQrAnalyticsRepository implements QrAnalyticsRepository {
  private readonly http = inject(HttpClient);

  getReport(restaurantId: RestaurantId, days: number): Promise<QrAnalyticsReport> {
    return firstValueFrom(this.http.get<QrAnalyticsReport>(apiUrl(`/api/admin/restaurants/${restaurantId}/qr-analytics?days=${days}`)));
  }
}
