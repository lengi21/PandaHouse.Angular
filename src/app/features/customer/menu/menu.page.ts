import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-menu-page',
  imports: [TranslatePipe],
  template: `
    <main>
      <h1>{{ 'CUSTOMER.MENU.TITLE' | translate }}</h1>
    </main>
  `,
})
export class MenuPage {}
