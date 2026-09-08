import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-cart-page',
  imports: [TranslatePipe],
  template: `
    <main>
      <h1>{{ 'CUSTOMER.CART.TITLE' | translate }}</h1>
    </main>
  `,
})
export class CartPage {}
