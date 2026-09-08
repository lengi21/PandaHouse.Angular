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
      max-inline-size: 72rem;
      margin: 0 auto;
      padding: 1.5rem 1rem 6rem;
    }

    h1 {
      margin: 0 0 1.25rem;
      font-size: clamp(1.75rem, 8vw, 2.5rem);
    }

    .category-grid {
      display: grid;
      gap: 1rem;
    }

    .status {
      color: var(--color-muted-text);
    }

    @media (min-width: 42rem) {
      .category-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
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
