import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-settings-page',
  imports: [TranslatePipe],
  template: `
    <main>
      <h1>{{ 'ADMIN.SETTINGS.TITLE' | translate }}</h1>
    </main>
  `,
})
export class AdminSettingsPage {}
