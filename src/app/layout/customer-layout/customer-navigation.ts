import { NgOptimizedImage } from '@angular/common';
import { Component, computed, DestroyRef, inject, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { CustomerMenuStore } from '../../features/customer/menu/customer-menu.store';
import { isRestaurantOpen } from '../../shared/utils/restaurant-opening-state';

@Component({
  selector: 'app-customer-navigation',
  imports: [MatIcon, NgOptimizedImage, RouterLink, RouterLinkActive, TranslatePipe],
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
      transform: translateY(-1.6rem);
      border: .25rem solid var(--color-shell);
      border-radius: 50%;
      overflow: hidden;
      padding: 0;
      background: #eff5d6;
      transition: border-color 180ms ease, box-shadow 180ms ease;
      cursor: pointer;
    }

    .brand.is-open {
      border-color: var(--color-status-open);
      box-shadow: 0 0 0 .1rem color-mix(in srgb, var(--color-status-open) 35%, transparent), 0 .35rem .8rem rgb(0 0 0 / 28%);
    }

    .brand.is-closed {
      border-color: var(--color-status-closed);
      box-shadow: 0 0 0 .1rem color-mix(in srgb, var(--color-status-closed) 35%, transparent), 0 .35rem .8rem rgb(0 0 0 / 28%);
    }

    .brand img {
      inline-size: 100%;
      block-size: 100%;
      object-fit: cover;
      object-position: center 34%;
    }

    .brand:focus-visible { outline: 3px solid var(--color-focus); outline-offset: 3px; }
  `,
  template: `
    <nav [attr.aria-label]="'NAVIGATION.LABEL' | translate">
      <a routerLink="/categories" routerLinkActive="active"><mat-icon aria-hidden="true">home</mat-icon>{{ 'NAVIGATION.CATEGORIES' | translate }}</a>
      <a routerLink="/menu" routerLinkActive="active"><mat-icon aria-hidden="true">restaurant_menu</mat-icon>{{ 'NAVIGATION.MENU' | translate }}</a>
      <div class="brand-slot">
        <button
          class="brand"
          [class.is-open]="openingState() === 'open'"
          [class.is-closed]="openingState() === 'closed'"
          type="button"
          [attr.aria-label]="(openingState() === 'open' ? 'CUSTOMER.STATUS.OPEN' : openingState() === 'closed' ? 'CUSTOMER.STATUS.CLOSED' : 'CUSTOMER.APPEARANCE.OPEN') | translate"
          (click)="appearanceRequested.emit()"
        ><img ngSrc="/brand/panda-house-logo-112.jpeg" width="56" height="56" alt="" /></button>
      </div>
      <a routerLink="/info" routerLinkActive="active"><mat-icon aria-hidden="true">info</mat-icon>{{ 'NAVIGATION.INFO' | translate }}</a>
      <a routerLink="/cart" routerLinkActive="active"><mat-icon aria-hidden="true">shopping_cart</mat-icon>{{ 'NAVIGATION.CART' | translate }}</a>
    </nav>
  `,
})
export class CustomerNavigation {
  private readonly destroyRef = inject(DestroyRef);
  private readonly menuStore = inject(CustomerMenuStore);
  private readonly now = signal(new Date());
  readonly appearanceRequested = output<void>();
  protected readonly openingState = computed<'open' | 'closed' | 'unknown'>(() => {
    const restaurant = this.menuStore.restaurant();

    if (!restaurant) {
      return 'unknown';
    }

    return isRestaurantOpen(restaurant.openingHours, this.now()) ? 'open' : 'closed';
  });

  constructor() {
    const clock = setInterval(() => this.now.set(new Date()), 60_000);
    this.destroyRef.onDestroy(() => clearInterval(clock));
  }
}
