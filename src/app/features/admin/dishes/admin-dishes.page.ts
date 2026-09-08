import { Component, computed, inject, signal } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { LanguageService } from '../../../core/i18n/language.service';
import { SelectOption, SelectField } from '../../../shared/ui/select-field/select-field';
import { SearchField } from '../../../shared/ui/search-field/search-field';
import { Price } from '../../../shared/ui/price/price';
import { getTranslation } from '../../../shared/utils/get-translation';
import { NamedTranslation } from '../../../shared/models/translation.model';
import { AdminDishesStore } from './admin-dishes.store';
import { AdminDishSummary, DishDraft } from '../../../shared/models/admin-menu.model';
import { DishEditorDialog } from './dish-editor-dialog';
import { Pagination } from '../../../shared/ui/pagination/pagination';
import { PageSkeleton } from '../../../shared/ui/page-skeleton/page-skeleton';

@Component({
  selector: 'app-admin-dishes-page',
  imports: [CdkDrag, CdkDropList, DishEditorDialog, MatIcon, PageSkeleton, Pagination, Price, SearchField, SelectField, TranslatePipe],
  providers: [AdminDishesStore],
  styles: `
    main { max-inline-size: 90rem; margin: 0 auto; padding: clamp(1rem, 3vw, 2.5rem); }
    .heading { display: flex; align-items: start; justify-content: space-between; gap: 1rem; margin-block-end: 1.35rem; }
    h1 { margin: 0; font-size: clamp(1.3rem, 2vw, 1.65rem); }
    .heading p { margin: .3rem 0 0; color: var(--color-muted-text); font-size: .78rem; }
    .add { display: inline-flex; align-items: center; gap: .4rem; min-block-size: 2.5rem; padding: .5rem .85rem; border: 0; border-radius: .55rem; background: var(--color-primary); color: var(--color-on-image); font: inherit; font-size: .72rem; font-weight: 700; }
    .add mat-icon { inline-size: 1rem; block-size: 1rem; font-size: 1rem; }
    .filters { display: grid; grid-template-columns: minmax(12rem, 1fr) auto auto; gap: .6rem; margin-block-end: 1rem; }
    .reorder-note { margin: -.35rem 0 .8rem; color: var(--color-muted-text); font-size: .7rem; }
    .table-wrap { overflow-x: auto; border: 1px solid color-mix(in srgb, var(--color-text) 10%, transparent); border-radius: .8rem; background: var(--color-panel); }
    tr[cdkDrag] { transition: transform 220ms cubic-bezier(.2, 0, 0, 1); }
    .cdk-drag-preview { display: table; box-shadow: 0 .8rem 2rem rgb(0 0 0 / 24%); background: var(--color-panel); }
    .cdk-drag-placeholder { opacity: .3; }
    table { inline-size: 100%; min-inline-size: 48rem; border-collapse: collapse; font-size: .75rem; }
    th, td { padding: .7rem .8rem; border-block-end: 1px solid color-mix(in srgb, var(--color-text) 8%, transparent); text-align: start; }
    th { color: var(--color-muted-text); font-size: .65rem; font-weight: 700; }
    tr:last-child td { border-block-end: 0; }
    .dish { display: flex; align-items: center; gap: .65rem; min-inline-size: 13rem; }
    .dish img, .placeholder { inline-size: 2.5rem; block-size: 2.5rem; border-radius: .45rem; object-fit: cover; background: var(--color-surface); }
    .dish-name { font-weight: 700; }
    .order { color: var(--color-muted-text); font-size: .66rem; }
    .badge { display: inline-flex; padding: .23rem .45rem; border-radius: 2rem; background: color-mix(in srgb, #55bd77 18%, transparent); color: #16733c; font-size: .62rem; font-weight: 700; }
    .badge.paused { background: color-mix(in srgb, #d77354 18%, transparent); color: #a13d28; }
    .actions { display: flex; align-items: center; gap: .25rem; }
    .more { display: grid; inline-size: 2rem; block-size: 2rem; place-items: center; border: 0; border-radius: .45rem; background: var(--color-surface); color: var(--color-text); }
    .more mat-icon { inline-size: 1.1rem; block-size: 1.1rem; font-size: 1.1rem; }
    .state { display: grid; min-block-size: 12rem; place-items: center; color: var(--color-muted-text); font-size: .82rem; }
    @media (max-width: 40rem) { .heading { align-items: stretch; flex-direction: column; } .add { justify-content: center; } .filters { grid-template-columns: 1fr; } }
    @media (max-width: 46rem) {
      main { padding: 1rem; }
      .table-wrap { overflow: visible; border: 0; background: transparent; }
      table, tbody { display: grid; min-inline-size: 0; }
      thead { display: none; }
      tr { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: .2rem .8rem; padding: .8rem; border: 1px solid color-mix(in srgb, var(--color-text) 10%, transparent); border-radius: .75rem; background: var(--color-panel); }
      th, td { min-inline-size: 0; padding: .15rem 0; border: 0; }
      td:first-child { grid-column: 1 / -1; }
      td:not(:first-child) { display: flex; align-items: center; justify-content: space-between; gap: .75rem; color: var(--color-text); }
      td:not(:first-child)::before { color: var(--color-muted-text); content: attr(data-label); font-size: .66rem; font-weight: 700; }
      td:last-child { grid-column: 2; grid-row: 2 / span 3; align-self: center; }
      td:last-child::before { display: none; }
      .actions { justify-content: end; }
    }
  `,
  template: `
    <main>
      <div class="heading">
        <div><h1>{{ 'ADMIN.DISHES.TITLE' | translate }}</h1><p>{{ 'ADMIN.DISHES.DESCRIPTION' | translate }}</p></div>
        <button class="add" type="button" (click)="openEditor()"><mat-icon aria-hidden="true">add</mat-icon>{{ 'ADMIN.DISHES.ADD' | translate }}</button>
      </div>
      <div class="filters">
        <app-search-field [label]="'ADMIN.DISHES.SEARCH' | translate" [placeholder]="'ADMIN.DISHES.SEARCH' | translate" [value]="store.query()" variant="surface" (valueChange)="store.setQuery($event)" />
        <app-select-field [label]="'ADMIN.DISHES.CATEGORY_FILTER' | translate" [options]="categoryOptions()" [value]="store.categoryId()" (valueChange)="store.setCategoryId($event)" />
        <app-select-field [label]="'ADMIN.DISHES.STATUS_FILTER' | translate" [options]="statusOptions" [value]="store.status()" (valueChange)="store.setStatus($any($event))" />
      </div>
      <p class="reorder-note">{{ 'ADMIN.DISHES.REORDER_NOTE' | translate }}</p>
      @if (store.loading()) {
        <app-page-skeleton [columns]="1" />
      } @else if (store.hasError()) {
        <div class="state">{{ 'ADMIN.FEEDBACK.PAGE_LOAD_ERROR' | translate }}<button type="button" (click)="store.load()">{{ 'ADMIN.FEEDBACK.RETRY' | translate }}</button></div>
      } @else {
        <div class="table-wrap">
          <table>
            <thead><tr><th>{{ 'ADMIN.DISHES.DISH' | translate }}</th><th>{{ 'ADMIN.DISHES.CATEGORY' | translate }}</th><th>{{ 'ADMIN.DISHES.PRICE' | translate }}</th><th>{{ 'ADMIN.DISHES.STATUS' | translate }}</th><th>{{ 'ADMIN.DISHES.ACTIONS' | translate }}</th></tr></thead>
            <tbody cdkDropList [cdkDropListData]="store.dishes()" [cdkDropListDisabled]="store.categoryId() === 'all'" (cdkDropListDropped)="drop($event)">
              @for (summary of store.dishes(); track summary.dish.id) {
                <tr cdkDrag [cdkDragData]="summary">
                  <td data-label="Dish"><div class="dish">@if (summary.dish.image; as image) { <img [alt]="''" [src]="image.url" /> } @else { <span class="placeholder" aria-hidden="true"></span> }<span><span class="dish-name">{{ name(summary.dish.translations) }}</span><br /><span class="order">#{{ summary.dish.sortOrder }}</span></span></div></td>
                  <td data-label="Category">{{ name(summary.category.translations) }}</td>
                  <td data-label="Price"><app-price [language]="languageService.currentLanguage()" [money]="summary.dish.price" /></td>
                  <td data-label="Status"><span class="badge" [class.paused]="!summary.dish.isPublished || !summary.dish.isAvailable">{{ (summary.dish.isPublished && summary.dish.isAvailable ? 'ADMIN.DISHES.ACTIVE' : 'ADMIN.DISHES.PAUSED') | translate }}</span></td>
                  <td data-label="Actions"><div class="actions"><button class="more" type="button" [attr.aria-label]="'ADMIN.DISHES.MORE_ACTIONS' | translate" (click)="openEditor(summary)"><mat-icon aria-hidden="true">more_vert</mat-icon></button></div></td>
                </tr>
              } @empty { <tr><td class="state" colspan="5">{{ 'ADMIN.DISHES.EMPTY' | translate }}</td></tr> }
            </tbody>
          </table>
        </div>
        <app-pagination [hasNext]="store.hasNextPage()" [hasPrevious]="store.hasPreviousPage()" [page]="store.page()" [pageCount]="store.pageCount()" (pageRequested)="store.goToPage($event)" />
      }
      @if (editorOpen()) {
        <app-dish-editor-dialog [categories]="store.categories()" [dish]="editingDish()" [failed]="saveFailed()" [saving]="saving()" (cancelled)="closeEditor()" (saved)="save($event)" />
      }
    </main>
  `,
})
export class AdminDishesPage {
  protected readonly store = inject(AdminDishesStore);
  protected readonly languageService = inject(LanguageService);
  protected readonly categoryOptions = computed<readonly SelectOption[]>(() => [
    { value: 'all', label: 'All categories' },
    ...this.store.categories().map((category) => ({ value: category.id, label: this.name(category.translations) })),
  ]);
  protected readonly statusOptions: readonly SelectOption[] = [
    { value: 'all', label: 'All statuses' },
    { value: 'active', label: 'Active' },
    { value: 'paused', label: 'Paused' },
  ];
  protected readonly editingDish = signal<AdminDishSummary | null>(null);
  protected readonly editorOpen = signal(false);
  protected readonly saving = signal(false);
  protected readonly saveFailed = signal(false);

  constructor() { this.store.load(); }

  protected openEditor(dish: AdminDishSummary | null = null): void {
    this.editingDish.set(dish);
    this.saveFailed.set(false);
    this.editorOpen.set(true);
  }

  protected closeEditor(): void {
    if (!this.saving()) this.editorOpen.set(false);
  }

  protected save(draft: DishDraft): void {
    const summary = this.editingDish();
    this.saving.set(true);
    this.saveFailed.set(false);
    const request = summary ? this.store.update(summary.dish.id, draft) : this.store.create(draft);
    void request.then(() => this.editorOpen.set(false)).catch(() => this.saveFailed.set(true)).finally(() => this.saving.set(false));
  }

  protected drop(event: CdkDragDrop<readonly AdminDishSummary[]>): void {
    void this.store.reorderVisibleDishes(event.previousIndex, event.currentIndex);
  }

  protected name(translations: readonly NamedTranslation[]): string {
    return getTranslation(translations, this.languageService.currentLanguage())?.name ?? '';
  }
}
