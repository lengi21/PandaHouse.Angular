import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { routes } from './app.routes';
import { MENU_REPOSITORY } from './core/data-access/menu/menu.repository';
import { HttpMenuRepository } from './core/data-access/menu/http-menu.repository';
import { ADMIN_AUTH_REPOSITORY } from './core/data-access/auth/admin-auth.repository';
import { HttpAdminAuthRepository } from './core/data-access/auth/http-admin-auth.repository';
import { ADMIN_MENU_REPOSITORY } from './core/data-access/menu/admin-menu.repository';
import { HttpAdminMenuRepository } from './core/data-access/menu/http-admin-menu.repository';
import { MEDIA_STORAGE_REPOSITORY } from './core/data-access/storage/media-storage.repository';
import { HttpMediaStorageRepository } from './core/data-access/storage/http-media-storage.repository';
import { ADMIN_DASHBOARD_REPOSITORY } from './core/data-access/dashboard/admin-dashboard.repository';
import { HttpAdminDashboardRepository } from './core/data-access/dashboard/http-admin-dashboard.repository';
import { ADMIN_RESTAURANT_REPOSITORY } from './core/data-access/restaurant/admin-restaurant.repository';
import { HttpAdminRestaurantRepository } from './core/data-access/restaurant/http-admin-restaurant.repository';
import { adminAuthInterceptor } from './core/http/admin-auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptors([adminAuthInterceptor])),
    provideRouter(routes),
    {
      provide: MENU_REPOSITORY,
      useExisting: HttpMenuRepository,
    },
    {
      provide: ADMIN_AUTH_REPOSITORY,
      useExisting: HttpAdminAuthRepository,
    },
    {
      provide: ADMIN_MENU_REPOSITORY,
      useExisting: HttpAdminMenuRepository,
    },
    {
      provide: MEDIA_STORAGE_REPOSITORY,
      useExisting: HttpMediaStorageRepository,
    },
    { provide: ADMIN_DASHBOARD_REPOSITORY, useExisting: HttpAdminDashboardRepository },
    { provide: ADMIN_RESTAURANT_REPOSITORY, useExisting: HttpAdminRestaurantRepository },
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
