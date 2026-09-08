import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { routes } from './app.routes';
import { ADMIN_AUTH_REPOSITORY } from './core/data-access/auth/admin-auth.repository';
import { HttpAdminAuthRepository } from './core/data-access/auth/http-admin-auth.repository';
import { adminAuthInterceptor } from './core/http/admin-auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([adminAuthInterceptor])),
    provideRouter(routes),
    { provide: ADMIN_AUTH_REPOSITORY, useClass: HttpAdminAuthRepository },
    provideTranslateService({
      fallbackLang: 'en',
      lang: 'ka',
      loader: provideTranslateHttpLoader({
        prefix: '/i18n/',
        suffix: '.json',
      }),
    }),
  ],
};
