import { InjectionToken } from '@angular/core';
import { AdminDashboardSummary } from '../../../shared/models/admin-dashboard.model';
import { RestaurantId } from '../../../shared/models/menu.model';

export interface AdminDashboardRepository {
  getDashboard(restaurantId: RestaurantId): Promise<AdminDashboardSummary>;
}

export const ADMIN_DASHBOARD_REPOSITORY = new InjectionToken<AdminDashboardRepository>('ADMIN_DASHBOARD_REPOSITORY');
