import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../core/i18n/language.service';
import { ThemeService } from '../../core/theme/theme.service';
import { CustomerMenuStore } from '../../features/customer/menu/customer-menu.store';
import { CartStore } from '../../features/customer/cart/cart.store';
import { SelectField, SelectOption } from '../../shared/ui/select-field/select-field';
import { getTranslation } from '../../shared/utils/get-translation';

@Component({
  selector: 'app-customer-header',
  imports: [RouterLink, SelectField, TranslatePipe],
  styles: `
    header {
      position: fixed;
      z-index: 10;
      inset: 0 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: .75rem;
      min-block-size: var(--customer-header-height);
      padding: .5rem 1rem;
      border-bottom: 1px solid rgb(255 255 255 / 12%);
      background: var(--color-shell);
    }

    .brand {
      display: inline-flex;
      min-inline-size: 0;
      align-items: center;
      gap: .625rem;
      color: var(--color-shell-text);
      text-decoration: none;
    }

    .mark {
      display: grid;
      flex: 0 0 auto;
      inline-size: 2.25rem;
      block-size: 2.25rem;
      place-items: center;
      border-radius: 50%;
      background: var(--color-panel);
      color: var(--color-primary);
      font-size: .75rem;
      font-weight: 800;
      letter-spacing: .05em;
    }

    .restaurant-name {
      overflow: hidden;
      display: grid;
      gap: .05rem;
      font-weight: 700;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .restaurant-name small { color: color-mix(in srgb, var(--color-shell-text) 68%, transparent); font-size: .48rem; font-weight: 600; letter-spacing: .14em; }

    .actions {
      display: flex;
      align-items: center;
      gap: .35rem;
    }

    .icon-link,
    .icon-button {
      display: grid;
      inline-size: 2.75rem;
      block-size: 2.75rem;
      place-items: center;
      border: 0;
      border-radius: .75rem;
      background: transparent;
      color: var(--color-shell-text);
      font: inherit;
      position: relative;
      font-size: 1.55rem;
      text-decoration: none;
    }

    .count { position: absolute; inset: .1rem .1rem auto auto; display: grid; min-inline-size: 1.05rem; block-size: 1.05rem; place-items: center; border-radius: 50%; background: #e94747; color: #fff; font-size: .6rem; font-weight: 700; }

    .icon-link:focus-visible,
    .icon-button:focus-visible,
    .brand:focus-visible {
      outline: 3px solid var(--color-focus);
      outline-offset: 2px;
    }

    @media (max-width: 28rem) {
      .actions app-select-field {
        display: none;
      }
    }
  `,
  template: `
    <header>
      <a class="brand" routerLink="/categories">
        <span aria-hidden="true" class="mark">PH</span>
        <span class="restaurant-name">{{ restaurantName() }}<small>GEORGIAN KITCHEN</small></span>
      </a>

      <div class="actions">
        <a class="icon-link" [attr.aria-label]="'HEADER.SEARCH' | translate" routerLink="/menu">⌕</a>
        <button
          class="icon-button"
          type="button"
          [attr.aria-label]="'HEADER.TOGGLE_THEME' | translate"
          (click)="themeService.toggleColorMode()"
        >
          ◐
        </button>
        <a class="icon-link" [attr.aria-label]="'HEADER.CART' | translate" routerLink="/cart">🛒 @if (cartStore.itemCount() > 0) { <span class="count">{{ cartStore.itemCount() }}</span> }</a>
        <app-select-field
          [label]="'HEADER.LANGUAGE' | translate"
          [options]="languageOptions()"
          [value]="languageService.currentLanguage()"
          (valueChange)="languageService.changeLanguage($event)"
        />
      </div>
    </header>
  `,
})
export class CustomerHeader {
  protected readonly languageService = inject(LanguageService);
  protected readonly menuStore = inject(CustomerMenuStore);
  protected readonly cartStore = inject(CartStore);
  protected readonly themeService = inject(ThemeService);
  protected readonly languageOptions = computed<readonly SelectOption[]>(() =>
    this.languageService.availableLanguages.map(({ code, label }) => ({ value: code, label })),
  );
  protected readonly restaurantName = computed(
    () =>
      getTranslation(
        this.menuStore.restaurant()?.translations ?? [],
        this.languageService.currentLanguage(),
      )?.name ?? 'Panda House',
  );
}
