import { Component, effect, inject, signal, untracked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../core/i18n/language.service';
import { CategorySelector } from '../../../shared/menu/category-selector/category-selector';
import { DishCard } from '../../../shared/menu/dish-card/dish-card';
import { CategoryId, CategoryTranslation } from '../../../shared/models/menu.model';
import { getTranslation } from '../../../shared/utils/get-translation';
import { CartStore } from '../cart/cart.store';
import { CustomerMenuStore } from './customer-menu.store';
import { SearchField } from '../../../shared/ui/search-field/search-field';

@Component({
  selector: 'app-menu-page',
  imports: [CategorySelector, DishCard, SearchField, TranslatePipe],
  styles: `
    main { max-inline-size: 36rem; margin: 0 auto; padding: .7rem 0 calc(var(--customer-navigation-height) + .75rem); color: var(--color-text); }
    .menu-top { position: sticky; z-index: 5; top: var(--customer-header-height); display: grid; gap: .65rem; padding: .65rem 1rem .2rem; background: var(--color-shell); } h1, h2 { margin: 0; } h1 { position: absolute; inline-size: 1px; block-size: 1px; overflow: hidden; clip: rect(0 0 0 0); } h2 { padding-bottom: .65rem; border-bottom: 1px solid color-mix(in srgb, var(--color-text) 12%, transparent); font-size: 1.15rem; }
    .menu-panel { min-block-size: calc(100dvh - var(--customer-header-height) - var(--customer-navigation-height)); margin-top: .2rem; padding: 1rem; border-radius: 1.1rem 1.1rem 0 0; background: var(--color-panel); }
    section { scroll-margin-top: calc(var(--customer-header-height) + 1rem); margin-block-start: 1.4rem; }
    section:first-child { margin-block-start: 0; } .dishes { display: grid; grid-template-columns: minmax(0, 1fr); gap: .2rem; margin-block-start: .15rem; }
    .status { color: var(--color-muted-text); }
  `,
  template: `
    <main>
      <h1>{{ 'CUSTOMER.MENU.TITLE' | translate }}</h1>
      @if (menuStore.isLoading()) {
        <p class="status" role="status">{{ 'COMMON.LOADING' | translate }}</p>
      } @else {
        <div class="menu-top">
          <app-search-field [label]="'HEADER.SEARCH' | translate" [placeholder]="'HEADER.SEARCH' | translate" [value]="menuStore.searchQuery()" (valueChange)="menuStore.setSearchQuery($event)" />
          <app-category-selector [activeCategoryId]="activeCategoryId()" [categories]="menuStore.categories()" [firstCategoryId]="carouselFirstCategoryId()" [label]="'CUSTOMER.CATEGORIES.TITLE' | translate" [language]="languageService.currentLanguage()" (selected)="scrollToCategory($event)" />
        </div>
        <div class="menu-panel">
          @for (menuCategory of menuStore.filteredCategories(); track menuCategory.category.id) {
            <section [id]="menuCategory.category.id">
              <h2>{{ categoryName(menuCategory.category.translations) }}</h2>
              <div class="dishes" role="list">
                @for (dish of menuCategory.dishes; track dish.id) {
                  <app-dish-card [addLabel]="'CART.ADD' | translate" [dish]="dish" [language]="languageService.currentLanguage()" [quantity]="cartStore.quantityFor(dish.id)" (add)="cartStore.add(dish.id)" (decrement)="cartStore.decrement(dish.id)" (increment)="cartStore.increment(dish.id)" />
                }
              </div>
            </section>
          } @empty { <p class="status">No dishes match your search.</p> }
        </div>
      }
    </main>
  `,
})
export class MenuPage {
  protected readonly cartStore = inject(CartStore);
  protected readonly languageService = inject(LanguageService);
  protected readonly menuStore = inject(CustomerMenuStore);
  protected readonly activeCategoryId = signal<string | null>(null);
  protected readonly carouselFirstCategoryId = signal<CategoryId | null>(null);
  private readonly requestedCategoryId = signal<string | null>(null);
  private readonly isProgrammaticCategoryScroll = signal(false);
  private categoryScrollTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.categoryScrollTimer) {
        clearTimeout(this.categoryScrollTimer);
      }
    });
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const categoryId = params.get('category');
      this.requestedCategoryId.set(categoryId);
      this.carouselFirstCategoryId.set(params.get('source') === 'category-list' ? categoryId : null);
    });
    effect((onCleanup) => {
      const availableCategories = this.menuStore.filteredCategories();
      const requestedCategoryId = this.requestedCategoryId();
      const categoryId = availableCategories.some(({ category }) => category.id === requestedCategoryId)
        ? requestedCategoryId
        : availableCategories.at(0)?.category.id ?? null;

      if (categoryId && untracked(() => this.activeCategoryId()) !== categoryId) {
        this.activeCategoryId.set(categoryId);
        const scrollTimer = setTimeout(() => this.scrollToCategory(categoryId), 100);
        onCleanup(() => clearTimeout(scrollTimer));
      }
    });

    effect((onCleanup) => {
      const categoryIds = this.menuStore.filteredCategories().map(({ category }) => category.id);
      let observer: IntersectionObserver | null = null;
      const observerTimer = setTimeout(() => {
        observer = new IntersectionObserver(
          (entries) => {
            const visibleSection = entries
              .filter((entry) => entry.isIntersecting)
              .sort((first, second) => first.boundingClientRect.top - second.boundingClientRect.top)
              .at(0);
            if (visibleSection && !this.isProgrammaticCategoryScroll()) {
              this.activeCategoryId.set(visibleSection.target.id);
            }
          },
          { rootMargin: '-190px 0px -55% 0px', threshold: 0.05 },
        );
        categoryIds.forEach((categoryId) => {
          const section = document.getElementById(categoryId);
          if (section) observer?.observe(section);
        });
      }, 100);

      onCleanup(() => {
        clearTimeout(observerTimer);
        observer?.disconnect();
      });
    });
  }

  protected scrollToCategory(categoryId: string): void {
    this.activeCategoryId.set(categoryId);
    this.isProgrammaticCategoryScroll.set(true);
    if (this.categoryScrollTimer) {
      clearTimeout(this.categoryScrollTimer);
    }
    const categorySection = document.getElementById(categoryId);
    if (categorySection) {
      const stickyMenuBottom = document.querySelector<HTMLElement>('.menu-top')?.getBoundingClientRect().bottom ?? 72;
      const targetTop = categorySection.getBoundingClientRect().top + window.scrollY - stickyMenuBottom - 12;
      window.scrollTo({ behavior: 'smooth', top: targetTop });
    }
    this.categoryScrollTimer = setTimeout(() => this.isProgrammaticCategoryScroll.set(false), 650);
  }

  protected categoryName(translations: readonly CategoryTranslation[]): string {
    return getTranslation(translations, this.languageService.currentLanguage())?.name ?? '';
  }
}
