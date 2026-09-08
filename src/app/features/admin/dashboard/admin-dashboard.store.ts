import { inject, Service, signal } from '@angular/core';
import { ADMIN_DASHBOARD_REPOSITORY } from '../../../core/data-access/dashboard/admin-dashboard.repository';
import { AdminDashboardSummary } from '../../../shared/models/admin-dashboard.model';
import { DEFAULT_RESTAURANT_ID } from '../../customer/menu/customer-menu.store';

@Service()
export class AdminDashboardStore {
  private readonly repository = inject(ADMIN_DASHBOARD_REPOSITORY);
  private readonly dashboardState = signal<AdminDashboardSummary | null>(null);
  private readonly loadingState = signal(false);
  readonly dashboard = this.dashboardState.asReadonly();
  readonly loading = this.loadingState.asReadonly();

  load(): void {
    if (this.loadingState()) return;
    this.loadingState.set(true);
    void this.repository.getDashboard(DEFAULT_RESTAURANT_ID).then((dashboard) => this.dashboardState.set(dashboard)).finally(() => this.loadingState.set(false));
  }
}
