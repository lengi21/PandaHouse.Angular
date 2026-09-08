import { AdminDishSummary } from './admin-menu.model';

export interface AdminDashboardSummary {
  readonly categoryCount: number;
  readonly dishCount: number;
  readonly publishedDishCount: number;
  readonly availableDishCount: number;
  readonly recentDishes: readonly AdminDishSummary[];
}
