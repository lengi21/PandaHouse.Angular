import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../core/i18n/language.service';
import { CategoryCard } from '../../../shared/menu/category-card/category-card';
import { CustomerMenuStore } from '../menu/customer-menu.store';

@Component({
  selector: 'app-category-list-page',
  imports: [CategoryCard, TranslatePipe],
  styles: `
    main {
      max-inline-size: 36rem;
      margin: 0 auto;
      padding: 1rem 1rem calc(var(--customer-navigation-height) + 1.5rem);
    }

    h1 {
      position: absolute;
      inline-size: 1px;
      block-size: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
    }

    .category-grid {
      display: grid;
      gap: .55rem;
    }

    .status {
      color: var(--color-muted-text);
    }

  `,
  template: `
    <main>
      <h1>{{ 'CUSTOMER.CATEGORIES.TITLE' | translate }}</h1>
      @if (menuStore.isLoading()) {
        <p class="status" role="status">{{ 'COMMON.LOADING' | translate }}</p>
      } @else if (menuStore.error(); as error) {
        <p class="status" role="alert">{{ error }}</p>
      } @else {
        <section [attr.aria-label]="'CUSTOMER.CATEGORIES.TITLE' | translate" class="category-grid">
          @for (menuCategory of menuStore.categories(); track menuCategory.category.id) {
            <app-category-card
              [category]="menuCategory.category"
              [language]="languageService.currentLanguage()"
            />
          }
        </section>
      }
    </main>
  `,
})
export class CategoryListPage {
  protected readonly languageService = inject(LanguageService);
  protected readonly menuStore = inject(CustomerMenuStore);
}
