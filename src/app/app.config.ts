import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { routes } from './app.routes';
import { MENU_REPOSITORY } from './core/data-access/menu/menu.repository';
import { MockMenuRepository } from './core/data-access/menu/mock-menu.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(routes),
    {
      provide: MENU_REPOSITORY,
      useExisting: MockMenuRepository,
    },
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
