import { Component, computed, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { LanguageCode } from '../../models/language.model';
import { Dish } from '../../models/menu.model';
import { Price } from '../../ui/price/price';
import { QuantityControl } from '../../ui/quantity-control/quantity-control';
import { BottomSheet } from '../../ui/bottom-sheet/bottom-sheet';
import { getTranslation } from '../../utils/get-translation';

@Component({
  selector: 'app-dish-details-sheet',
  imports: [BottomSheet, MatIcon, Price, QuantityControl],
  styles: `
    .handle { inline-size: 2.5rem; block-size: .28rem; margin: 0 auto .9rem; border-radius: 999px; background: color-mix(in srgb, var(--color-text) 20%, transparent); }
    .close { position: absolute; inset: .75rem .75rem auto auto; display: grid; inline-size: 2.5rem; block-size: 2.5rem; place-items: center; border: 0; border-radius: 50%; background: color-mix(in srgb, var(--color-text) 8%, transparent); color: var(--color-text); }
    .close mat-icon { inline-size: 1.25rem; block-size: 1.25rem; font-size: 1.25rem; }
    .close:focus-visible { outline: 3px solid var(--color-focus); outline-offset: 2px; }
    img { inline-size: 100%; max-block-size: 13rem; border-radius: 1rem; object-fit: cover; }
    h2, h3, p { margin: 0; } h2 { margin-block-start: 1rem; padding-inline-end: 3rem; font-size: 1.3rem; } h3 { font-size: .9rem; }
    .description { margin-block-start: .35rem; color: var(--color-muted-text); line-height: 1.45; }
    .facts { display: flex; align-items: center; justify-content: space-between; gap: .75rem; margin-block-start: 1rem; padding: .8rem 0; border-block: 1px solid color-mix(in srgb, var(--color-text) 12%, transparent); font-weight: 800; }
    .calories { display: inline-flex; align-items: center; gap: .35rem; color: var(--color-muted-text); font-size: .82rem; font-weight: 700; } .calories mat-icon { inline-size: 1rem; block-size: 1rem; color: var(--color-primary); font-size: 1rem; }
    .recipe { margin-block-start: 1rem; } .recipe p { margin-block-start: .4rem; color: var(--color-muted-text); font-size: .9rem; line-height: 1.55; }
    .quantity { display: flex; align-items: center; justify-content: space-between; gap: .75rem; margin-block-start: 1.25rem; } .quantity span { color: var(--color-muted-text); font-size: .85rem; font-weight: 700; }
  `,
  template: `
    <app-bottom-sheet [ariaLabel]="name()" (closed)="closed.emit()">
      <div aria-hidden="true" class="handle"></div>
      <button class="close" type="button" [attr.aria-label]="closeLabel()" (click)="closed.emit()"><mat-icon aria-hidden="true">close</mat-icon></button>
      @if (dish().image; as image) { <img [alt]="name()" [height]="image.height" [src]="image.url" [width]="image.width" /> }
      <h2>{{ name() }}</h2>
      <p class="description">{{ description() }}</p>
      <div class="facts"><app-price [language]="language()" [money]="dish().price" /> @if (dish().calories; as calories) { <span class="calories"><mat-icon aria-hidden="true">local_fire_department</mat-icon>{{ calories }} {{ caloriesLabel() }}</span> }</div>
      @if (recipe(); as recipe) { <section class="recipe"><h3>{{ recipeLabel() }}</h3><p>{{ recipe }}</p></section> }
      <div class="quantity"><span>{{ quantityLabel() }}</span><app-quantity-control [quantity]="quantity()" (decrement)="decrement.emit()" (increment)="increment.emit()" /></div>
    </app-bottom-sheet>
  `,
})
export class DishDetailsSheet {
  readonly dish = input.required<Dish>();
  readonly language = input.required<LanguageCode>();
  readonly quantity = input.required<number>();
  readonly recipeLabel = input.required<string>();
  readonly caloriesLabel = input.required<string>();
  readonly quantityLabel = input.required<string>();
  readonly closeLabel = input.required<string>();
  readonly decrement = output<void>();
  readonly increment = output<void>();
  readonly closed = output<void>();
  protected readonly name = computed(() => getTranslation(this.dish().translations, this.language())?.name ?? '');
  protected readonly description = computed(() => getTranslation(this.dish().translations, this.language())?.description ?? '');
  protected readonly recipe = computed(() => getTranslation(this.dish().translations, this.language())?.recipe ?? null);
}
