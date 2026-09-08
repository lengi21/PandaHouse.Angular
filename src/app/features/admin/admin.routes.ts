import { Routes } from '@angular/router';
import { AdminLayout } from '../../layout/admin-layout/admin-layout';
import { adminAuthGuard } from '../../core/auth/admin-auth.guard';
import { ADMIN_DASHBOARD_REPOSITORY } from '../../core/data-access/dashboard/admin-dashboard.repository';
import { HttpAdminDashboardRepository } from '../../core/data-access/dashboard/http-admin-dashboard.repository';
import { ADMIN_MENU_REPOSITORY } from '../../core/data-access/menu/admin-menu.repository';
import { HttpAdminMenuRepository } from '../../core/data-access/menu/http-admin-menu.repository';
import { ADMIN_RESTAURANT_REPOSITORY } from '../../core/data-access/restaurant/admin-restaurant.repository';
import { HttpAdminRestaurantRepository } from '../../core/data-access/restaurant/http-admin-restaurant.repository';
import { MEDIA_STORAGE_REPOSITORY } from '../../core/data-access/storage/media-storage.repository';
import { HttpMediaStorageRepository } from '../../core/data-access/storage/http-media-storage.repository';

const adminPanelProviders = [
  { provide: ADMIN_DASHBOARD_REPOSITORY, useClass: HttpAdminDashboardRepository },
  { provide: ADMIN_MENU_REPOSITORY, useClass: HttpAdminMenuRepository },
  { provide: ADMIN_RESTAURANT_REPOSITORY, useClass: HttpAdminRestaurantRepository },
  { provide: MEDIA_STORAGE_REPOSITORY, useClass: HttpMediaStorageRepository },
];

export const adminRoutes: Routes = [
  {
    path: 'sign-in',
    title: 'Panda House | Admin sign in',
    loadComponent: () => import('./auth/admin-sign-in.page').then((module) => module.AdminSignInPage),
  },
  {
    path: '',
    component: AdminLayout,
    canActivate: [adminAuthGuard],
    providers: adminPanelProviders,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        title: 'Panda House | Admin dashboard',
        loadComponent: () => import('./dashboard/dashboard.page').then((module) => module.DashboardPage),
      },
      {
        path: 'categories',
        title: 'Panda House | Admin categories',
        loadComponent: () =>
          import('./categories/admin-categories.page').then((module) => module.AdminCategoriesPage),
      },
      {
        path: 'dishes',
        title: 'Panda House | Admin dishes',
        loadComponent: () => import('./dishes/admin-dishes.page').then((module) => module.AdminDishesPage),
      },
      {
        path: 'settings',
        title: 'Panda House | Admin settings',
        loadComponent: () => import('./settings/admin-settings.page').then((module) => module.AdminSettingsPage),
      },
    ],
  },
];
