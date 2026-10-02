import { Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CustomerMenuStore } from '../../features/customer/menu/customer-menu.store';
import { CartStore } from '../../features/customer/cart/cart.store';
import { CustomerHeader } from './customer-header';
import { CustomerNavigation } from './customer-navigation';
import { AppearanceSheet } from '../../shared/ui/appearance-sheet/appearance-sheet';
import { QrAnalyticsTracker } from '../../core/analytics/qr-analytics-tracker';
import { QrCatalogEventsService } from '../../core/realtime/qr-catalog-events.service';
import { DEFAULT_RESTAURANT_ID } from '../../features/customer/menu/customer-menu.store';

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
  private readonly catalogEvents = inject(QrCatalogEventsService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly appearanceOpen = signal(false);

  constructor() {
    this.customerMenuStore.load();
    this.analytics.track('SCAN');

    const refresh = () => this.customerMenuStore.refresh();
    const disconnect = this.catalogEvents.connect(DEFAULT_RESTAURANT_ID, refresh);
    this.destroyRef.onDestroy(() => {
      disconnect();
    });
  }
}
