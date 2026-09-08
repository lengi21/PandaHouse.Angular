import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-restaurant-info-page',
  imports: [TranslatePipe],
  template: `
    <main>
      <h1>{{ 'CUSTOMER.INFO.TITLE' | translate }}</h1>
    </main>
  `,
})
export class RestaurantInfoPage {}
