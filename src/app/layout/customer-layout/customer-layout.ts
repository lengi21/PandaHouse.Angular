import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CustomerMenuStore } from '../../features/customer/menu/customer-menu.store';

@Component({
  selector: 'app-customer-layout',
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class CustomerLayout {
  private readonly customerMenuStore = inject(CustomerMenuStore);

  constructor() {
    this.customerMenuStore.load();
  }
}
