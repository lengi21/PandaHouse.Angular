import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-customer-navigation',
  imports: [MatIcon, RouterLink, RouterLinkActive, TranslatePipe],
  styles: `
    nav {
      position: fixed;
      z-index: 10;
      inset: auto .75rem max(.75rem, env(safe-area-inset-bottom));
      max-inline-size: 38rem;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      align-items: center;
      min-block-size: 4.2rem;
      padding: .35rem .6rem;
      border: 1px solid rgb(255 255 255 / 14%);
      border-radius: 1.6rem;
      background: var(--color-shell);
      box-shadow: 0 .8rem 2rem rgb(0 0 0 / 32%);
    }

    a {
      display: grid;
      min-block-size: 3.1rem;
      place-items: center;
      border-radius: .75rem;
      color: color-mix(in srgb, var(--color-shell-text) 66%, transparent);
      gap: .15rem;
      font-size: .6rem;
      font-weight: 700;
      text-align: center;
      text-decoration: none;
    }

    a.active {
      color: var(--color-primary);
    }

    a mat-icon { inline-size: 1.25rem; block-size: 1.25rem; font-size: 1.25rem; line-height: 1; }

    a:focus-visible {
      outline: 3px solid var(--color-focus);
      outline-offset: 2px;
    }

    .brand-slot {
      display: grid;
      min-block-size: 3.1rem;
      place-items: start center;
    }

    .brand {
      display: grid;
      inline-size: 3.65rem;
      block-size: 3.65rem;
      place-items: center;
      transform: translateY(-1.6rem);
      border: .25rem solid var(--color-shell);
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
      <a routerLink="/categories" routerLinkActive="active"><mat-icon aria-hidden="true">home</mat-icon>{{ 'NAVIGATION.CATEGORIES' | translate }}</a>
      <a routerLink="/menu" routerLinkActive="active"><mat-icon aria-hidden="true">restaurant_menu</mat-icon>{{ 'NAVIGATION.MENU' | translate }}</a>
      <div aria-hidden="true" class="brand-slot"><span class="brand">PH</span></div>
      <a routerLink="/info" routerLinkActive="active"><mat-icon aria-hidden="true">info</mat-icon>{{ 'NAVIGATION.INFO' | translate }}</a>
      <a routerLink="/cart" routerLinkActive="active"><mat-icon aria-hidden="true">shopping_cart</mat-icon>{{ 'NAVIGATION.CART' | translate }}</a>
    </nav>
  `,
})
export class CustomerNavigation {}
