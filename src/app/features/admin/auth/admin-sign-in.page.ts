import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-sign-in-page',
  imports: [TranslatePipe],
  template: `
    <main>
      <h1>{{ 'ADMIN.SIGN_IN.TITLE' | translate }}</h1>
    </main>
  `,
})
export class AdminSignInPage {}
