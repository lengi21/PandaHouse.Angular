import { computed, inject, Service, signal } from '@angular/core';
import { ADMIN_MENU_REPOSITORY } from '../../../core/data-access/menu/admin-menu.repository';
import { AdminDishSummary, DishDraft } from '../../../shared/models/admin-menu.model';
import { Category, Dish, DishId } from '../../../shared/models/menu.model';
import { DEFAULT_RESTAURANT_ID } from '../../customer/menu/customer-menu.store';

const pageSize = 10;

@Service()
export class AdminDishesStore {
  private readonly repository = inject(ADMIN_MENU_REPOSITORY);
  private readonly dishList = signal<readonly AdminDishSummary[]>([]);
  private readonly categoryList = signal<readonly Category[]>([]);
  private readonly loadingState = signal(false);
  private readonly queryState = signal('');
  private readonly categoryIdState = signal('all');
  private readonly statusState = signal<'all' | 'active' | 'paused'>('all');
  private readonly pageState = signal(1);
  private readonly totalItemsState = signal(0);

  readonly loading = this.loadingState.asReadonly();
  readonly query = this.queryState.asReadonly();
  readonly categoryId = this.categoryIdState.asReadonly();
  readonly status = this.statusState.asReadonly();
  readonly dishes = this.dishList.asReadonly();
  readonly categories = this.categoryList.asReadonly();
  readonly page = this.pageState.asReadonly();
  readonly totalItems = this.totalItemsState.asReadonly();
  readonly pageCount = computed(() => Math.max(1, Math.ceil(this.totalItemsState() / pageSize)));
  readonly hasPreviousPage = computed(() => this.pageState() > 1);
  readonly hasNextPage = computed(() => this.pageState() < this.pageCount());

  setQuery(query: string): void { this.queryState.set(query); this.resetAndLoad(); }
  setCategoryId(categoryId: string): void { this.categoryIdState.set(categoryId); this.resetAndLoad(); }
  setStatus(status: 'all' | 'active' | 'paused'): void { this.statusState.set(status); this.resetAndLoad(); }
  goToPage(page: number): void { if (page >= 1 && page <= this.pageCount()) { this.pageState.set(page); this.load(); } }

  load(): void {
    if (this.loadingState()) return;
    this.loadingState.set(true);
    void Promise.all([
      this.categoryList().length ? Promise.resolve(this.categoryList()) : this.repository.getCategories(DEFAULT_RESTAURANT_ID).then((items) => items.map(({ category }) => category)),
      this.repository.getDishes(DEFAULT_RESTAURANT_ID, { page: this.pageState(), pageSize, query: this.queryState(), categoryId: this.categoryIdState(), status: this.statusState() }),
    ]).then(([categories, result]) => {
      this.categoryList.set(categories);
      this.dishList.set(result.items);
      this.totalItemsState.set(result.totalItems);
    }).finally(() => this.loadingState.set(false));
  }

  create(draft: DishDraft): Promise<Dish> { return this.repository.createDish(DEFAULT_RESTAURANT_ID, draft).then((dish) => { this.resetAndLoad(); return dish; }); }
  update(dishId: DishId, draft: DishDraft): Promise<Dish> { return this.repository.updateDish(DEFAULT_RESTAURANT_ID, dishId, draft).then((dish) => { this.load(); return dish; }); }

  reorderVisibleDishes(previousIndex: number, currentIndex: number): Promise<void> {
    const previous = this.dishList();
    const moving = previous[previousIndex];
    const target = previous[currentIndex];
    if (!moving || !target || moving.category.id !== target.category.id || previousIndex === currentIndex) return Promise.resolve();
    const reordered = [...previous];
    reordered.splice(previousIndex, 1);
    reordered.splice(currentIndex, 0, moving);
    this.dishList.set(reordered);
    return this.repository.moveDish(DEFAULT_RESTAURANT_ID, moving.category.id, moving.dish.id, target.dish.id, previousIndex < currentIndex).catch((error: unknown) => {
      this.dishList.set(previous);
      throw error;
    });
  }

  private resetAndLoad(): void { this.pageState.set(1); this.load(); }
}
