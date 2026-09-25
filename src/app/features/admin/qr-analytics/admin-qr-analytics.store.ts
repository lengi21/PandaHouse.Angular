import { inject, Service, signal } from '@angular/core';
import { QR_ANALYTICS_REPOSITORY } from '../../../core/data-access/qr-analytics/qr-analytics.repository';
import { QrAnalyticsReport } from '../../../shared/models/qr-analytics.model';
import { DEFAULT_RESTAURANT_ID } from '../../customer/menu/customer-menu.store';

@Service()
export class AdminQrAnalyticsStore {
  private readonly repository = inject(QR_ANALYTICS_REPOSITORY);
  private readonly reportState = signal<QrAnalyticsReport | null>(null);
  private readonly loadingState = signal(false);
  private readonly errorState = signal(false);

  readonly report = this.reportState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly hasError = this.errorState.asReadonly();

  load(days: number): void {
    this.loadingState.set(true);
    this.errorState.set(false);
    void this.repository.getReport(DEFAULT_RESTAURANT_ID, days)
      .then((report) => this.reportState.set(report))
      .catch(() => this.errorState.set(true))
      .finally(() => this.loadingState.set(false));
  }
}
