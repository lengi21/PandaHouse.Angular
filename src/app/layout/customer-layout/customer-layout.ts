import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CustomerMenuStore } from '../../features/customer/menu/customer-menu.store';
import { CartStore } from '../../features/customer/cart/cart.store';
import { CustomerHeader } from './customer-header';
import { CustomerNavigation } from './customer-navigation';
import { AppearanceSheet } from '../../shared/ui/appearance-sheet/appearance-sheet';
import { QrAnalyticsTracker } from '../../core/analytics/qr-analytics-tracker';

@Component({
  selector: 'app-customer-layout',
  imports: [AppearanceSheet, CustomerHeader, CustomerNavigation, RouterOutlet],
  providers: [CartStore, CustomerMenuStore],
  styles: `
    :host { display: block; min-block-size: 100dvh; background: var(--color-shell); }
    .content {
      min-block-size: 100dvh;
      padding-block-start: var(--customer-header-height);
    }
  `,
  template: `
    <app-customer-header />
    <div class="content"><router-outlet /></div>
    <app-customer-navigation (appearanceRequested)="appearanceOpen.set(true)" />
    @if (appearanceOpen()) { <app-appearance-sheet (closed)="appearanceOpen.set(false)" /> }
  `,
})
export class CustomerLayout {
  private readonly customerMenuStore = inject(CustomerMenuStore);
  private readonly analytics = inject(QrAnalyticsTracker);
  protected readonly appearanceOpen = signal(false);

  constructor() {
    this.customerMenuStore.load();
    this.analytics.track('SCAN');
  }
}
