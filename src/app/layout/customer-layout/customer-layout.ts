import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CustomerMenuStore } from '../../features/customer/menu/customer-menu.store';
import { CustomerHeader } from './customer-header';
import { CustomerNavigation } from './customer-navigation';
import { AppearanceSheet } from '../../shared/ui/appearance-sheet/appearance-sheet';

@Component({
  selector: 'app-customer-layout',
  imports: [AppearanceSheet, CustomerHeader, CustomerNavigation, RouterOutlet],
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
  protected readonly appearanceOpen = signal(false);

  constructor() {
    this.customerMenuStore.load();
  }
}
