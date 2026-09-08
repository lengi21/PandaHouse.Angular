import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-dishes-page',
  imports: [TranslatePipe],
  template: `
    <main>
      <h1>{{ 'ADMIN.DISHES.TITLE' | translate }}</h1>
    </main>
  `,
})
export class AdminDishesPage {}
