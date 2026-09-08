import { computed, inject, Service, signal } from '@angular/core';
import { ADMIN_MENU_REPOSITORY } from '../../../core/data-access/menu/admin-menu.repository';
import { AdminDishSummary, DishDraft } from '../../../shared/models/admin-menu.model';
import { Category, Dish, DishId } from '../../../shared/models/menu.model';
import { DEFAULT_RESTAURANT_ID } from '../../customer/menu/customer-menu.store';
import { RequestExecutor } from '../../../core/http/request-executor.service';

const pageSize = 10;

@Service()
export class AdminDishesStore {
  private readonly repository = inject(ADMIN_MENU_REPOSITORY);
  private readonly requests = inject(RequestExecutor);
  private readonly dishList = signal<readonly AdminDishSummary[]>([]);
  private readonly categoryList = signal<readonly Category[]>([]);
  private readonly loadingState = signal(false);
  private readonly queryState = signal('');
  private readonly categoryIdState = signal('all');
  private readonly statusState = signal<'all' | 'active' | 'paused'>('all');
  private readonly pageState = signal(1);
  private readonly totalItemsState = signal(0);
  private readonly errorState = signal(false);

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
  readonly hasError = this.errorState.asReadonly();

  setQuery(query: string): void { this.queryState.set(query); this.resetAndLoad(); }
  setCategoryId(categoryId: string): void { this.categoryIdState.set(categoryId); this.resetAndLoad(); }
  setStatus(status: 'all' | 'active' | 'paused'): void { this.statusState.set(status); this.resetAndLoad(); }
  goToPage(page: number): void { if (page >= 1 && page <= this.pageCount()) { this.pageState.set(page); this.load(); } }

  load(): void {
    if (this.loadingState()) return;
    this.loadingState.set(true);
    this.errorState.set(false);
    void this.requests.run(() => this.repository.getDishes(DEFAULT_RESTAURANT_ID, {
      page: this.pageState(),
      pageSize,
      query: this.queryState(),
      categoryId: this.categoryIdState(),
      status: this.statusState(),
    })).then((result) => {
      this.dishList.set(result.items);
      this.totalItemsState.set(result.totalItems);
    }).catch(() => this.errorState.set(true)).finally(() => this.loadingState.set(false));
  }

  ensureCategories(): Promise<void> {
    if (this.categoryList().length) {
      return Promise.resolve();
    }

    return this.requests.run(() => this.repository.getCategories(DEFAULT_RESTAURANT_ID))
      .then((items) => this.categoryList.set(items.map(({ category }) => category)));
  }

  create(draft: DishDraft): Promise<Dish> { return this.requests.run(() => this.repository.createDish(DEFAULT_RESTAURANT_ID, draft), { action: true, successKey: 'ADMIN.FEEDBACK.SAVED' }).then((dish) => { this.resetAndLoad(); return dish; }); }
  update(dishId: DishId, draft: DishDraft): Promise<Dish> { return this.requests.run(() => this.repository.updateDish(DEFAULT_RESTAURANT_ID, dishId, draft), { action: true, successKey: 'ADMIN.FEEDBACK.SAVED' }).then((dish) => { this.load(); return dish; }); }

  setDishStatus(summary: AdminDishSummary, status: Pick<Dish, 'isAvailable' | 'isPublished'>): Promise<Dish> {
    return this.requests.run(() => this.repository.setDishStatus(DEFAULT_RESTAURANT_ID, summary.dish.id, status), { action: true, successKey: 'ADMIN.FEEDBACK.SAVED' }).then((dish) => {
      this.dishList.update((items) => items.map((item) => item.dish.id === dish.id ? { ...item, dish } : item));
      return dish;
    });
  }

  remove(dishId: DishId): Promise<void> {
    return this.requests.run(() => this.repository.deleteDish(DEFAULT_RESTAURANT_ID, dishId), { action: true, successKey: 'ADMIN.FEEDBACK.DELETED' }).then(() => {
      this.dishList.update((items) => items.filter((summary) => summary.dish.id !== dishId));
      this.totalItemsState.update((total) => Math.max(0, total - 1));
    });
  }

  reorderVisibleDishes(previousIndex: number, currentIndex: number): Promise<void> {
    const previous = this.dishList();
    const moving = previous[previousIndex];
    const target = previous[currentIndex];
    if (!moving || !target || moving.category.id !== target.category.id || previousIndex === currentIndex) return Promise.resolve();
    const reordered = [...previous];
    reordered.splice(previousIndex, 1);
    reordered.splice(currentIndex, 0, moving);
    this.dishList.set(reordered);
    return this.requests.run(() => this.repository.moveDish(DEFAULT_RESTAURANT_ID, moving.category.id, moving.dish.id, target.dish.id, previousIndex < currentIndex), { successKey: 'ADMIN.FEEDBACK.ORDER_SAVED' }).catch((error: unknown) => {
      this.dishList.set(previous);
      throw error;
    });
  }

  private resetAndLoad(): void { this.pageState.set(1); this.load(); }
}
