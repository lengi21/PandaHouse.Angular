import { inject, Service, signal } from '@angular/core';
import { ADMIN_MENU_REPOSITORY } from '../../../core/data-access/menu/admin-menu.repository';
import { AdminCategorySummary } from '../../../shared/models/admin-menu.model';
import { CategoryDraft } from '../../../shared/models/admin-menu.model';
import { Category, CategoryId } from '../../../shared/models/menu.model';
import { DEFAULT_RESTAURANT_ID } from '../../customer/menu/customer-menu.store';
import { RequestExecutor } from '../../../core/http/request-executor.service';

@Service()
export class AdminCategoriesStore {
  private readonly repository = inject(ADMIN_MENU_REPOSITORY);
  private readonly requests = inject(RequestExecutor);
  private readonly categoryList = signal<readonly AdminCategorySummary[]>([]);
  private readonly loadingState = signal(false);
  private readonly errorState = signal(false);

  readonly categories = this.categoryList.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly hasError = this.errorState.asReadonly();

  load(): void {
    if (this.loadingState()) {
      return;
    }

    this.loadingState.set(true);
    this.errorState.set(false);
    void this.requests.run(() => this.repository.getCategories(DEFAULT_RESTAURANT_ID))
      .then((categories) => this.categoryList.set(categories))
      .catch(() => this.errorState.set(true))
      .finally(() => this.loadingState.set(false));
  }

  create(draft: CategoryDraft): Promise<Category> {
    return this.requests.run(() => this.repository.createCategory(DEFAULT_RESTAURANT_ID, draft), { action: true, successKey: 'ADMIN.FEEDBACK.SAVED' }).then((category) => {
      this.loadFresh();
      return category;
    });
  }

  update(categoryId: CategoryId, draft: CategoryDraft): Promise<Category> {
    return this.requests.run(() => this.repository.updateCategory(DEFAULT_RESTAURANT_ID, categoryId, draft), { action: true, successKey: 'ADMIN.FEEDBACK.SAVED' }).then((category) => {
      this.loadFresh();
      return category;
    });
  }

  delete(categoryId: CategoryId): Promise<void> {
    return this.requests.run(() => this.repository.deleteCategory(DEFAULT_RESTAURANT_ID, categoryId), { action: true, successKey: 'ADMIN.FEEDBACK.SAVED' }).then(() => {
      this.loadFresh();
    });
  }

  move(categoryId: CategoryId, direction: -1 | 1): Promise<void> {
    const categoryIds = this.categoryList().map(({ category }) => category.id);
    const currentIndex = categoryIds.indexOf(categoryId);
    const nextIndex = currentIndex + direction;
    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= categoryIds.length) {
      return Promise.resolve();
    }

    [categoryIds[currentIndex], categoryIds[nextIndex]] = [categoryIds[nextIndex], categoryIds[currentIndex]];
    return this.reorder(categoryIds);
  }

  reorder(categoryIds: readonly CategoryId[]): Promise<void> {
    const byId = new Map(this.categoryList().map((summary) => [summary.category.id, summary]));
    const reordered = categoryIds.map((id, index) => {
      const summary = byId.get(id);
      if (!summary) throw new Error(`Category \"${id}\" was not found.`);
      return { ...summary, category: { ...summary.category, sortOrder: index + 1 } };
    });
    this.categoryList.set(reordered);
    return this.requests.run(() => this.repository.reorderCategories(DEFAULT_RESTAURANT_ID, categoryIds), { successKey: 'ADMIN.FEEDBACK.ORDER_SAVED' }).catch((error: unknown) => {
      this.loadFresh();
      throw error;
    });
  }

  private loadFresh(): void {
    this.categoryList.set([]);
    this.load();
  }
}
