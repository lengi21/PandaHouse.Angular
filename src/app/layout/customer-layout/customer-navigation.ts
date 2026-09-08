import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-customer-navigation',
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  styles: `
    nav {
      position: fixed;
      z-index: 10;
      inset: auto 0 0 0;
      margin: 0;
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      align-items: end;
      min-block-size: var(--customer-navigation-height);
      padding: .5rem 1rem max(.5rem, env(safe-area-inset-bottom));
      border-top: 1px solid rgb(255 255 255 / 12%);
      background: var(--color-shell);
    }

    a {
      display: grid;
      min-block-size: 3.25rem;
      place-items: center;
      border-radius: .75rem;
      color: color-mix(in srgb, var(--color-shell-text) 66%, transparent);
      gap: .2rem;
      font-size: .65rem;
      font-weight: 700;
      text-align: center;
      text-decoration: none;
    }

    a.active {
      color: var(--color-primary);
    }

    a span { font-family: system-ui, sans-serif; font-size: 1.4rem; line-height: 1; }

    a:focus-visible {
      outline: 3px solid var(--color-focus);
      outline-offset: 2px;
    }

    .brand-slot {
      display: grid;
      min-block-size: 3.25rem;
      place-items: start center;
    }

    .brand {
      display: grid;
      inline-size: 3.75rem;
      block-size: 3.75rem;
      place-items: center;
      transform: translateY(-1.75rem);
      border: .3rem solid var(--color-shell);
      border-radius: 50%;
      background: var(--color-panel);
      color: var(--color-primary);
      font-size: .75rem;
      font-weight: 800;
      letter-spacing: .05em;
    }
  `,
  template: `
    <nav [attr.aria-label]="'NAVIGATION.LABEL' | translate">
      <a routerLink="/categories" routerLinkActive="active"><span aria-hidden="true">⌂</span>{{ 'NAVIGATION.CATEGORIES' | translate }}</a>
      <a routerLink="/menu" routerLinkActive="active"><span aria-hidden="true">♨</span>{{ 'NAVIGATION.MENU' | translate }}</a>
      <div aria-hidden="true" class="brand-slot"><span class="brand">PH</span></div>
      <a routerLink="/info" routerLinkActive="active"><span aria-hidden="true">ⓘ</span>{{ 'NAVIGATION.INFO' | translate }}</a>
      <a routerLink="/cart" routerLinkActive="active"><span aria-hidden="true">🛒</span>{{ 'NAVIGATION.CART' | translate }}</a>
    </nav>
  `,
})
export class CustomerNavigation {}
