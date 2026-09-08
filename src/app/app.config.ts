import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { routes } from './app.routes';
import { MENU_REPOSITORY } from './core/data-access/menu/menu.repository';
import { MockMenuRepository } from './core/data-access/menu/mock-menu.repository';
import { ADMIN_AUTH_REPOSITORY } from './core/data-access/auth/admin-auth.repository';
import { MockAdminAuthRepository } from './core/data-access/auth/mock-admin-auth.repository';
import { ADMIN_MENU_REPOSITORY } from './core/data-access/menu/admin-menu.repository';
import { MockAdminMenuRepository } from './core/data-access/menu/mock-admin-menu.repository';
import { MEDIA_STORAGE_REPOSITORY } from './core/data-access/storage/media-storage.repository';
import { MockMediaStorageRepository } from './core/data-access/storage/mock-media-storage.repository';
import { ADMIN_DASHBOARD_REPOSITORY } from './core/data-access/dashboard/admin-dashboard.repository';
import { MockAdminDashboardRepository } from './core/data-access/dashboard/mock-admin-dashboard.repository';
import { ADMIN_RESTAURANT_REPOSITORY } from './core/data-access/restaurant/admin-restaurant.repository';
import { MockAdminRestaurantRepository } from './core/data-access/restaurant/mock-admin-restaurant.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(routes),
    {
      provide: MENU_REPOSITORY,
      useExisting: MockMenuRepository,
    },
    {
      provide: ADMIN_AUTH_REPOSITORY,
      useExisting: MockAdminAuthRepository,
    },
    {
      provide: ADMIN_MENU_REPOSITORY,
      useExisting: MockAdminMenuRepository,
    },
    {
      provide: MEDIA_STORAGE_REPOSITORY,
      useExisting: MockMediaStorageRepository,
    },
    { provide: ADMIN_DASHBOARD_REPOSITORY, useExisting: MockAdminDashboardRepository },
    { provide: ADMIN_RESTAURANT_REPOSITORY, useExisting: MockAdminRestaurantRepository },
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
