import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CustomerMenuStore } from '../../features/customer/menu/customer-menu.store';
import { CustomerHeader } from './customer-header';
import { CustomerNavigation } from './customer-navigation';

@Component({
  selector: 'app-customer-layout',
  imports: [CustomerHeader, CustomerNavigation, RouterOutlet],
  styles: `
    .content {
      padding-block-start: var(--customer-header-height);
    }
  `,
  template: `
    <app-customer-header />
    <div class="content"><router-outlet /></div>
    <app-customer-navigation />
  `,
})
export class CustomerLayout {
  private readonly customerMenuStore = inject(CustomerMenuStore);

  constructor() {
    this.customerMenuStore.load();
  }
}
