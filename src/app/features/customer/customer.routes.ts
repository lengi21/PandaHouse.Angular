import { Routes } from '@angular/router';
import { CustomerLayout } from '../../layout/customer-layout/customer-layout';
import { MENU_REPOSITORY } from '../../core/data-access/menu/menu.repository';
import { HttpMenuRepository } from '../../core/data-access/menu/http-menu.repository';

export const customerRoutes: Routes = [
  {
    path: '',
    component: CustomerLayout,
    providers: [{ provide: MENU_REPOSITORY, useClass: HttpMenuRepository }],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'categories',
      },
      {
        path: 'categories',
        title: 'Panda House | Categories',
        loadComponent: () =>
          import('./categories/category-list.page').then((module) => module.CategoryListPage),
      },
      {
        path: 'menu',
        title: 'Panda House | Menu',
        loadComponent: () => import('./menu/menu.page').then((module) => module.MenuPage),
      },
      {
        path: 'cart',
        title: 'Panda House | Cart',
        loadComponent: () => import('./cart/cart.page').then((module) => module.CartPage),
      },
      {
        path: 'info',
        title: 'Panda House | Information',
        loadComponent: () =>
          import('./info/restaurant-info.page').then((module) => module.RestaurantInfoPage),
      },
    ],
  },
];
