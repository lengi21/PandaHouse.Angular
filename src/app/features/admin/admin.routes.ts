import { Routes } from '@angular/router';
import { AdminLayout } from '../../layout/admin-layout/admin-layout';

export const adminRoutes: Routes = [
  {
    path: 'sign-in',
    title: 'Panda House | Admin sign in',
    loadComponent: () => import('./auth/admin-sign-in.page').then((module) => module.AdminSignInPage),
  },
  {
    path: '',
    component: AdminLayout,
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
