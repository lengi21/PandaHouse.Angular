import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-categories-page',
  imports: [TranslatePipe],
  template: `
    <main>
      <h1>{{ 'ADMIN.CATEGORIES.TITLE' | translate }}</h1>
    </main>
  `,
})
export class AdminCategoriesPage {}
