import { Component, computed, effect, ElementRef, input, output, viewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { LanguageCode } from '../../models/language.model';
import { CategoryId, MenuCategory } from '../../models/menu.model';
import { getTranslation } from '../../utils/get-translation';
import { AppImage } from '../../ui/app-image/app-image';

@Component({
  selector: 'app-category-selector',
  imports: [AppImage, MatIcon],
  styles: `
    :host { display: block; min-inline-size: 0; }
    nav { display: flex; max-inline-size: 100%; gap: .8rem; overflow-x: auto; overscroll-behavior-inline: contain; padding: .1rem 0 .7rem; scrollbar-width: none; touch-action: pan-x; }
    nav::-webkit-scrollbar { display: none; }
    button { position: relative; display: grid; flex: 0 0 4.75rem; gap: .35rem; border: 0; padding: .2rem .15rem .4rem; border-radius: .75rem; background: transparent; color: var(--color-shell-text); font: inherit; font-size: .62rem; text-align: center; }
    .name { display: grid; min-block-size: 1.85rem; place-items: center; padding: .18rem .3rem; border: 1px solid rgb(255 255 255 / 15%); border-radius: .45rem; background: rgb(0 0 0 / 28%); box-shadow: 0 .18rem .45rem rgb(0 0 0 / 18%); line-height: 1.18; text-shadow: 0 1px 2px rgb(0 0 0 / 45%); }
    app-image, .fallback { inline-size: 3.45rem; block-size: 3.45rem; margin: 0 auto; border: 2px solid transparent; border-radius: 50%; }
    .fallback { display:grid; place-items:center; background:color-mix(in srgb,var(--color-primary) 25%,var(--color-surface)); color:var(--color-primary); }.fallback mat-icon{font-size:1.35rem;inline-size:1.35rem;block-size:1.35rem;}
    button.active { background: color-mix(in srgb, var(--color-secondary) 18%, transparent); }
    button.active .name { border-color: color-mix(in srgb, var(--color-secondary) 68%, white); background: color-mix(in srgb, var(--color-secondary) 30%, rgb(0 0 0 / 48%)); box-shadow: 0 .25rem .6rem rgb(0 0 0 / 24%); }
    button.active app-image, button.active .fallback { border-color: var(--color-secondary); box-shadow: 0 0 0 2px var(--color-shell), 0 0 0 3px var(--color-secondary); }
    button.active span { color: var(--color-secondary); font-weight: 800; }
    button.active::after { position: absolute; inset: auto 50% 0; inline-size: 1.35rem; block-size: .2rem; transform: translateX(-50%); border-radius: 999px; background: var(--color-secondary); content: ''; }
    button:focus-visible { outline: 3px solid var(--color-focus); outline-offset: 3px; border-radius: .5rem; }
  `,
  template: `
    <nav #carousel [attr.aria-label]="label()">
      @for (menuCategory of orderedCategories(); track menuCategory.category.id) {
        <button type="button" [attr.aria-pressed]="menuCategory.category.id === activeCategoryId()" [class.active]="menuCategory.category.id === activeCategoryId()" [attr.data-category-id]="menuCategory.category.id" (click)="selected.emit(menuCategory.category.id)">
          @if (menuCategory.category.image; as image) { <app-image [alt]="''" [height]="image.height" [src]="image.url" [width]="image.width" /> } @else { <span class="fallback"><mat-icon>image</mat-icon></span> }
          <span class="name">{{ categoryName(menuCategory) }}</span>
        </button>
      }
    </nav>
  `,
})
export class CategorySelector {
  readonly categories = input.required<readonly MenuCategory[]>();
  readonly language = input.required<LanguageCode>();
  readonly label = input.required<string>();
  readonly activeCategoryId = input.required<CategoryId | null>();
  readonly firstCategoryId = input<CategoryId | null>(null);
  readonly selected = output<CategoryId>();
  private readonly carousel = viewChild<ElementRef<HTMLElement>>('carousel');
  private readonly names = computed(() => new Map(this.categories().map((menuCategory) => [menuCategory.category.id, getTranslation(menuCategory.category.translations, this.language())?.name ?? ''])));
  protected readonly orderedCategories = computed(() => {
    const firstCategoryId = this.firstCategoryId();
    return [...this.categories()].sort((first, second) => {
      if (first.category.id === firstCategoryId) return -1;
      if (second.category.id === firstCategoryId) return 1;
      return 0;
    });
  });

  constructor() {
    effect(() => {
      const activeCategoryId = this.activeCategoryId();
      this.orderedCategories();
      const carousel = this.carousel()?.nativeElement;
      if (!activeCategoryId || !carousel) return;

      const activeButton = Array.from(carousel.querySelectorAll<HTMLButtonElement>('[data-category-id]'))
        .find((button) => button.dataset['categoryId'] === activeCategoryId);
      if (!activeButton) return;

      const carouselBounds = carousel.getBoundingClientRect();
      const buttonBounds = activeButton.getBoundingClientRect();
      const isOutsideView = buttonBounds.left < carouselBounds.left || buttonBounds.right > carouselBounds.right;
      if (isOutsideView) {
        carousel.scrollTo({
          behavior: 'smooth',
          left: activeButton.offsetLeft - (carousel.clientWidth - activeButton.offsetWidth) / 2,
        });
      }
    });
  }

  protected categoryName(menuCategory: MenuCategory): string {
    return this.names().get(menuCategory.category.id) ?? '';
  }

}
