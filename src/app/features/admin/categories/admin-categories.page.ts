import { Component, inject, signal } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { LanguageService } from '../../../core/i18n/language.service';
import { AdminCategoryTile } from '../../../shared/admin/admin-category-tile/admin-category-tile';
import { AdminCategoriesStore } from './admin-categories.store';
import { CategoryEditorDialog } from './category-editor-dialog';
import { CategoryDraft } from '../../../shared/models/admin-menu.model';
import { Category } from '../../../shared/models/menu.model';
import { AdminCategorySummary } from '../../../shared/models/admin-menu.model';
import { PageSkeleton } from '../../../shared/ui/page-skeleton/page-skeleton';

@Component({
  selector: 'app-admin-categories-page',
  imports: [AdminCategoryTile, CategoryEditorDialog, CdkDrag, CdkDropList, MatIcon, PageSkeleton, TranslatePipe],
  providers: [AdminCategoriesStore],
  styles: `
    main { max-inline-size: 90rem; margin: 0 auto; padding: clamp(1rem, 3vw, 2.5rem); }
    .heading { display: flex; align-items: start; justify-content: space-between; gap: 1rem; margin-block-end: 1.4rem; }
    h1 { margin: 0; font-size: clamp(1.3rem, 2vw, 1.65rem); }
    .heading p { margin: .3rem 0 0; color: var(--color-muted-text); font-size: .78rem; }
    .add { display: inline-flex; flex: 0 0 auto; align-items: center; gap: .4rem; min-block-size: 2.5rem; padding: .5rem .85rem; border: 0; border-radius: .55rem; background: var(--color-primary); color: var(--color-on-image); font: inherit; font-size: .72rem; font-weight: 700; }
    .add mat-icon { inline-size: 1rem; block-size: 1rem; font-size: 1rem; }
    .summary { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-block-end: 1rem; color: var(--color-muted-text); font-size: .73rem; }
    .grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .9rem; }
    app-admin-category-tile { transition: transform 220ms cubic-bezier(.2, 0, 0, 1); }
    .cdk-drag-preview { box-sizing: border-box; border-radius: .75rem; box-shadow: 0 .8rem 2rem rgb(0 0 0 / 24%); }
    .cdk-drag-placeholder { opacity: .3; }
    .state { display: grid; min-block-size: 16rem; place-items: center; border: 1px dashed color-mix(in srgb, var(--color-text) 20%, transparent); border-radius: .85rem; color: var(--color-muted-text); font-size: .83rem; }
    @media (max-width: 78rem) { .grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
    @media (max-width: 58rem) { .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    @media (max-width: 38rem) { main { padding: 1rem; } .heading { align-items: stretch; flex-direction: column; } .add { justify-content: center; } .summary { align-items: start; flex-direction: column; gap: .3rem; } .grid { grid-template-columns: 1fr; } app-admin-category-tile[cdkDrag] { touch-action: pan-y; } }
  `,
  template: `
    <main>
      <div class="heading">
        <div>
          <h1>{{ 'ADMIN.CATEGORIES.TITLE' | translate }}</h1>
          <p>{{ 'ADMIN.CATEGORIES.DESCRIPTION' | translate }}</p>
        </div>
        <button class="add" type="button" (click)="openEditor()"><mat-icon aria-hidden="true">add</mat-icon>{{ 'ADMIN.CATEGORIES.ADD' | translate }}</button>
      </div>
      @if (store.loading()) {
        <app-page-skeleton [columns]="4" />
      } @else if (store.hasError()) {
        <div class="state">{{ 'ADMIN.CATEGORIES.LOAD_ERROR' | translate }}<button type="button" (click)="store.load()">{{ 'ADMIN.FEEDBACK.RETRY' | translate }}</button></div>
      } @else {
        <div class="summary"><span>{{ store.categories().length }} {{ 'ADMIN.CATEGORIES.TOTAL' | translate }}</span><span>{{ 'ADMIN.CATEGORIES.ORDER_NOTE' | translate }}</span></div>
        <div class="grid" cdkDropList cdkDropListOrientation="mixed" [cdkDropListData]="store.categories()" (cdkDropListDropped)="drop($event)">
          @for (summary of store.categories(); track summary.category.id) {
            <app-admin-category-tile cdkDrag [cdkDragData]="summary" [language]="languageService.currentLanguage()" [summary]="summary" (editRequested)="openEditor(summary.category)" (visibilityRequested)="toggleVisibility(summary.category)" (deleteRequested)="deleteCategory(summary.category)" />
          }
        </div>
      }
      @if (editorOpen()) {
        <app-category-editor-dialog [category]="editingCategory()" [failed]="saveFailed()" [saving]="saving()" (cancelled)="closeEditor()" (saved)="save($event)" />
      }
    </main>
  `,
})
export class AdminCategoriesPage {
  protected readonly store = inject(AdminCategoriesStore);
  protected readonly languageService = inject(LanguageService);
  protected readonly editingCategory = signal<Category | null>(null);
  protected readonly editorOpen = signal(false);
  protected readonly saving = signal(false);
  protected readonly saveFailed = signal(false);

  constructor() {
    this.store.load();
  }

  protected openEditor(category: Category | null = null): void {
    this.saveFailed.set(false);
    this.editingCategory.set(category);
    this.editorOpen.set(true);
  }

  protected closeEditor(): void {
    if (!this.saving()) {
      this.editorOpen.set(false);
    }
  }

  protected save(draft: CategoryDraft): void {
    const category = this.editingCategory();
    this.saving.set(true);
    this.saveFailed.set(false);
    const request = category ? this.store.update(category.id, draft) : this.store.create(draft);
    void request
      .then(() => this.editorOpen.set(false))
      .catch(() => this.saveFailed.set(true))
      .finally(() => this.saving.set(false));
  }

  protected toggleVisibility(category: Category): void {
    void this.store.update(category.id, {
      imageUrl: category.image?.url ?? '',
      isVisible: !category.isVisible,
      translations: category.translations,
    });
  }

  protected deleteCategory(category: Category): void {
    void this.store.delete(category.id);
  }

  protected drop(event: CdkDragDrop<readonly AdminCategorySummary[]>): void {
    if (event.previousIndex === event.currentIndex) return;
    const reordered = [...this.store.categories()];
    moveItemInArray(reordered, event.previousIndex, event.currentIndex);
    void this.store.reorder(reordered.map((summary) => summary.category.id));
  }
}
