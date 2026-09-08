import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../core/i18n/language.service';
import { CartStore } from './cart.store';
import { CustomerMenuStore } from '../menu/customer-menu.store';
import { CartLineItem } from '../../../shared/cart/cart-line-item/cart-line-item';
import { Price } from '../../../shared/ui/price/price';

@Component({
  selector: 'app-cart-page',
  imports: [CartLineItem, Price, RouterLink, TranslatePipe],
  styles: `
    main { max-inline-size: 36rem; margin: 0 auto; padding: .85rem 1rem calc(var(--customer-navigation-height) + 1.75rem); color: var(--color-text); }
    .panel { padding: 1rem; border-radius: 1.25rem; background: var(--color-panel); } h1, p { margin: 0; } h1 { font-size: 1.3rem; }
    .count, .status { margin-block-start: .3rem; color: var(--color-muted-text); font-size: .82rem; }
    .lines { display: grid; gap: .55rem; margin-block-start: 1rem; }
    .summary { display: flex; align-items: center; justify-content: space-between; margin-block-start: 1rem; padding-top: 1rem; border-top: 1px solid color-mix(in srgb, var(--color-text) 12%, transparent); font-size: 1.1rem; font-weight: 800; }
    .empty { display: grid; justify-items: center; gap: .7rem; padding: 2.5rem 1rem; text-align: center; } .empty-icon { display: grid; inline-size: 3.5rem; block-size: 3.5rem; place-items: center; border-radius: 50%; background: color-mix(in srgb, var(--color-primary) 12%, transparent); color: var(--color-primary); font-size: 1.7rem; }
    .browse { border-radius: .75rem; padding: .65rem .9rem; background: var(--color-primary); color: var(--color-on-image); font-size: .85rem; font-weight: 700; text-decoration: none; }
  `,
  template: `
    <main>
      <section class="panel">
        <h1>{{ 'CUSTOMER.CART.TITLE' | translate }}</h1>
        @if (menuStore.isLoading()) { <p class="status" role="status">{{ 'COMMON.LOADING' | translate }}</p> }
        @else if (cartStore.lines().length) {
          <p class="count">{{ cartStore.itemCount() }} {{ 'CUSTOMER.CART.ITEMS' | translate }}</p>
          <div class="lines">
            @for (line of cartStore.lines(); track line.dish.id) {
              <app-cart-line-item [dish]="line.dish" [language]="languageService.currentLanguage()" [quantity]="line.quantity" [removeLabel]="'CUSTOMER.CART.REMOVE' | translate" (decrement)="cartStore.decrement(line.dish.id)" (increment)="cartStore.increment(line.dish.id)" (remove)="cartStore.remove(line.dish.id)" />
            }
          </div>
          <div class="summary"><span>{{ 'CUSTOMER.CART.TOTAL' | translate }}</span><app-price [language]="languageService.currentLanguage()" [money]="cartStore.total()" /></div>
        } @else {
          <div class="empty"><span aria-hidden="true" class="empty-icon">🛒</span><p>{{ 'CUSTOMER.CART.EMPTY' | translate }}</p><a class="browse" routerLink="/menu">{{ 'CUSTOMER.CART.BROWSE_MENU' | translate }}</a></div>
        }
      </section>
    </main>
  `,
})
export class CartPage {
  protected readonly cartStore = inject(CartStore);
  protected readonly languageService = inject(LanguageService);
  protected readonly menuStore = inject(CustomerMenuStore);
}
