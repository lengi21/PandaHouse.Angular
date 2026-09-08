import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard-page',
  imports: [TranslatePipe],
  template: `
    <main>
      <h1>{{ 'ADMIN.DASHBOARD.TITLE' | translate }}</h1>
    </main>
  `,
})
export class DashboardPage {}
