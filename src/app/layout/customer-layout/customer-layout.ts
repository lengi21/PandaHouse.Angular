import { Component, DestroyRef, inject, signal } from '@angular/core';
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
  private readonly destroyRef = inject(DestroyRef);
  protected readonly appearanceOpen = signal(false);

  constructor() {
    this.customerMenuStore.load();
    this.analytics.track('SCAN');

    // The catalog is no longer HTTP-cached. Poll only while this QR menu is
    // visible so staff edits become visible to active guests within seconds.
    const refresh = () => this.customerMenuStore.refresh();
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') refresh();
    }, 3_000);
    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    document.addEventListener('visibilitychange', refreshWhenVisible);
    window.addEventListener('focus', refresh);
    this.destroyRef.onDestroy(() => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
      window.removeEventListener('focus', refresh);
    });
  }
}
