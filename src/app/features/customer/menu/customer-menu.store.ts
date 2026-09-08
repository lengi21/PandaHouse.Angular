import { computed, inject, signal } from '@angular/core';
import { Service } from '@angular/core';
import { LanguageService } from '../../../core/i18n/language.service';
import { MENU_REPOSITORY } from '../../../core/data-access/menu/menu.repository';
import { CustomerMenu, MenuCategory, Restaurant } from '../../../shared/models/menu.model';
import { getTranslation } from '../../../shared/utils/get-translation';

export const DEFAULT_RESTAURANT_ID = 'panda-house';

@Service()
export class CustomerMenuStore {
  private readonly menuRepository = inject(MENU_REPOSITORY);
  private readonly languageService = inject(LanguageService);
  private readonly menu = signal<CustomerMenu | null>(null);
  private readonly loading = signal(false);
  private readonly loadError = signal<string | null>(null);
  private readonly query = signal('');

  readonly isLoading = this.loading.asReadonly();
  readonly error = this.loadError.asReadonly();
  readonly searchQuery = this.query.asReadonly();
  readonly restaurant = computed<Restaurant | null>(() => this.menu()?.restaurant ?? null);
  readonly categories = computed<readonly MenuCategory[]>(() =>
    [...(this.menu()?.categories ?? [])]
      .filter(({ category }) => category.isVisible)
      .map((menuCategory) => ({
        ...menuCategory,
        dishes: [...menuCategory.dishes].sort((first, second) => first.sortOrder - second.sortOrder),
      }))
      .sort((first, second) => first.category.sortOrder - second.category.sortOrder),
  );
  readonly filteredCategories = computed<readonly MenuCategory[]>(() => {
    const query = this.query().trim().toLocaleLowerCase(this.languageService.currentLanguage());

    if (!query) {
      return this.categories();
    }

    return this.categories()
      .map((menuCategory) => ({
        ...menuCategory,
        dishes: menuCategory.dishes.filter((dish) => {
          const translation = getTranslation(dish.translations, this.languageService.currentLanguage());
          const searchableText = `${translation?.name ?? ''} ${translation?.description ?? ''}`;
          return searchableText.toLocaleLowerCase(this.languageService.currentLanguage()).includes(query);
        }),
      }))
      .filter((menuCategory) => menuCategory.dishes.length > 0);
  });

  setSearchQuery(query: string): void {
    this.query.set(query);
  }

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
