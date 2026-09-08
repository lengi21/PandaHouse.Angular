import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../core/i18n/language.service';
import { DishCard } from '../../../shared/menu/dish-card/dish-card';
import { CategoryTranslation } from '../../../shared/models/menu.model';
import { getTranslation } from '../../../shared/utils/get-translation';
import { CartStore } from '../cart/cart.store';
import { CustomerMenuStore } from './customer-menu.store';

@Component({
  selector: 'app-menu-page',
  imports: [DishCard, TranslatePipe],
  styles: `
    main { max-inline-size: 72rem; margin: 0 auto; padding: 1.5rem 1rem 6rem; }
    h1, h2 { margin: 0; } h1 { font-size: clamp(1.75rem, 8vw, 2.5rem); } h2 { font-size: 1.4rem; }
    section { scroll-margin-top: calc(var(--customer-header-height) + 1rem); margin-block-start: 2rem; }
    .dishes { display: grid; gap: .75rem; margin-block-start: .75rem; }
    .status { color: var(--color-muted-text); }
    @media (min-width: 48rem) { .dishes { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  `,
  template: `
    <main>
      <h1>{{ 'CUSTOMER.MENU.TITLE' | translate }}</h1>
      @if (menuStore.isLoading()) {
        <p class="status" role="status">{{ 'COMMON.LOADING' | translate }}</p>
      } @else {
        @for (menuCategory of menuStore.filteredCategories(); track menuCategory.category.id) {
          <section [id]="menuCategory.category.id">
            <h2>{{ categoryName(menuCategory.category.translations) }}</h2>
            <div class="dishes">
              @for (dish of menuCategory.dishes; track dish.id) {
                <app-dish-card
                  [dish]="dish"
                  [language]="languageService.currentLanguage()"
                  [quantity]="cartStore.quantityFor(dish.id)"
                  (add)="cartStore.add(dish.id)"
                  (decrement)="cartStore.decrement(dish.id)"
                  (increment)="cartStore.increment(dish.id)"
                />
              }
            </div>
          </section>
        } @empty {
          <p class="status">No dishes match your search.</p>
        }
      }
    </main>
  `,
})
export class MenuPage {
  protected readonly cartStore = inject(CartStore);
  protected readonly languageService = inject(LanguageService);
  protected readonly menuStore = inject(CustomerMenuStore);

  protected categoryName(translations: readonly CategoryTranslation[]): string {
    return getTranslation(translations, this.languageService.currentLanguage())?.name ?? '';
  }
}
