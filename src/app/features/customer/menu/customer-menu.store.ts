import { computed, inject, signal } from '@angular/core';
import { Service } from '@angular/core';
import { MENU_REPOSITORY } from '../../../core/data-access/menu/menu.repository';
import { CustomerMenu, MenuCategory, Restaurant } from '../../../shared/models/menu.model';

export const DEFAULT_RESTAURANT_ID = 'panda-house';

@Service()
export class CustomerMenuStore {
  private readonly menuRepository = inject(MENU_REPOSITORY);
  private readonly menu = signal<CustomerMenu | null>(null);
  private readonly loading = signal(false);
  private readonly loadError = signal<string | null>(null);

  readonly isLoading = this.loading.asReadonly();
  readonly error = this.loadError.asReadonly();
  readonly restaurant = computed<Restaurant | null>(() => this.menu()?.restaurant ?? null);
  readonly categories = computed<readonly MenuCategory[]>(() =>
    [...(this.menu()?.categories ?? [])]
      .filter(({ category }) => category.isVisible)
      .sort((first, second) => first.category.sortOrder - second.category.sortOrder),
  );

  load(): void {
    if (this.menu() || this.loading()) {
      return;
    }

    this.loading.set(true);
    this.loadError.set(null);

    void this.menuRepository
      .getCustomerMenu(DEFAULT_RESTAURANT_ID)
      .then((menu) => this.menu.set(menu))
      .catch(() => this.loadError.set('Unable to load the menu.'))
      .finally(() => this.loading.set(false));
  }
}
