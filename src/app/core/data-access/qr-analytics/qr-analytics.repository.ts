import { InjectionToken } from '@angular/core';
import { RestaurantId } from '../../../shared/models/menu.model';
import { QrAnalyticsReport } from '../../../shared/models/qr-analytics.model';

export interface QrAnalyticsRepository {
  getReport(restaurantId: RestaurantId, days: number): Promise<QrAnalyticsReport>;
}

export const QR_ANALYTICS_REPOSITORY = new InjectionToken<QrAnalyticsRepository>('QR_ANALYTICS_REPOSITORY');
