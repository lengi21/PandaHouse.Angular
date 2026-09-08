import { computed, inject, signal } from '@angular/core';
import { Service } from '@angular/core';
import { LanguageService } from '../../../core/i18n/language.service';
import { MENU_REPOSITORY } from '../../../core/data-access/menu/menu.repository';
import {
  CustomerMenuOverview,
  Dish,
  DishId,
  MenuCategory,
  Restaurant,
} from '../../../shared/models/menu.model';
import { getTranslation } from '../../../shared/utils/get-translation';

export const DEFAULT_RESTAURANT_ID = 'panda-house';

@Service()
export class CustomerMenuStore {
  private readonly menuRepository = inject(MENU_REPOSITORY);
  private readonly languageService = inject(LanguageService);
  private readonly overview = signal<CustomerMenuOverview | null>(null);
  private readonly menuDishes = signal<readonly Dish[] | null>(null);
  private readonly loading = signal(false);
  private readonly dishesLoading = signal(false);
  private readonly loadError = signal<string | null>(null);
  private readonly query = signal('');

  readonly isLoading = this.loading.asReadonly();
  readonly isDishesLoading = this.dishesLoading.asReadonly();
  readonly error = this.loadError.asReadonly();
  readonly searchQuery = this.query.asReadonly();
  readonly restaurant = computed<Restaurant | null>(() => this.overview()?.restaurant ?? null);
  readonly categories = computed<readonly MenuCategory[]>(() => {
    const dishes = this.menuDishes() ?? [];

    return [...(this.overview()?.categories ?? [])]
      .filter((category) => category.isVisible)
      .sort((first, second) => first.sortOrder - second.sortOrder)
      .map((category) => ({
        category,
        dishes: dishes.filter((dish) => dish.categoryId === category.id).sort(
          (first, second) => first.sortOrder - second.sortOrder,
        ),
      }));
  });
  readonly dishes = computed<readonly Dish[]>(() => this.menuDishes() ?? []);
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
          return `${translation?.name ?? ''} ${translation?.description ?? ''}`
            .toLocaleLowerCase(this.languageService.currentLanguage())
            .includes(query);
        }),
      }))
      .filter((menuCategory) => menuCategory.dishes.length > 0);
  });

  setSearchQuery(query: string): void {
    this.query.set(query);
  }

  findDish(dishId: DishId): Dish | null {
    return this.dishes().find((dish) => dish.id === dishId) ?? null;
  }

  load(): void {
    if (this.overview() || this.loading()) {
      return;
    }

    this.loading.set(true);
    this.loadError.set(null);

    void this.menuRepository
      .getCustomerMenuOverview(DEFAULT_RESTAURANT_ID)
      .then((overview) => this.overview.set(overview))
      .catch(() => this.loadError.set('Unable to load the menu.'))
      .finally(() => this.loading.set(false));
  }

  loadDishes(): void {
    if (this.menuDishes() || this.dishesLoading()) {
      return;
    }

    this.dishesLoading.set(true);
    this.loadError.set(null);

    void this.menuRepository
      .getMenuDishes(DEFAULT_RESTAURANT_ID)
      .then((dishes) => {
        this.menuDishes.set(dishes);
      })
      .catch(() => this.loadError.set('Unable to load dishes.'))
      .finally(() => this.dishesLoading.set(false));
  }
}
