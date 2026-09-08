import { Component, computed, input, output } from '@angular/core';
import { LanguageCode } from '../../models/language.model';
import { Dish } from '../../models/menu.model';
import { Price } from '../../ui/price/price';
import { QuantityControl } from '../../ui/quantity-control/quantity-control';
import { getTranslation } from '../../utils/get-translation';

@Component({
  selector: 'app-cart-line-item',
  imports: [Price, QuantityControl],
  styles: `
    article { display: grid; grid-template-columns: 5rem minmax(0, 1fr) 2.5rem; gap: .75rem; align-items: center; padding: .7rem; border-radius: 1rem; background: var(--color-surface); }
    img, .placeholder { inline-size: 5rem; block-size: 5rem; border-radius: .75rem; object-fit: cover; }
    .placeholder { display: grid; place-items: center; background: color-mix(in srgb, var(--color-primary) 15%, var(--color-surface)); font-size: 1.5rem; }
    h2, p { margin: 0; } h2 { font-size: .95rem; line-height: 1.25; } p { margin-block-start: .25rem; color: var(--color-muted-text); font-size: .78rem; }
    .bottom { display: flex; align-items: center; justify-content: space-between; gap: .45rem; margin-block-start: .5rem; font-weight: 700; }
    .remove { display: grid; inline-size: 2.5rem; block-size: 2.5rem; place-items: center; border: 0; border-radius: .7rem; background: color-mix(in srgb, var(--color-text) 7%, transparent); color: var(--color-text); font: inherit; font-size: 1.1rem; }
    .remove:focus-visible { outline: 3px solid var(--color-focus); outline-offset: 2px; }
  `,
  template: `
    <article>
      @if (dish().image; as image) { <img [alt]="name()" [height]="image.height" [src]="image.url" [width]="image.width" loading="lazy" /> } @else { <span aria-hidden="true" class="placeholder">♨</span> }
      <div>
        <h2>{{ name() }}</h2>
        <p>{{ description() }}</p>
        <div class="bottom">
          <app-price [language]="language()" [money]="dish().price" />
          <app-quantity-control [quantity]="quantity()" (decrement)="decrement.emit()" (increment)="increment.emit()" />
        </div>
      </div>
      <button class="remove" type="button" [attr.aria-label]="removeLabel() + ': ' + name()" (click)="remove.emit()">⌫</button>
    </article>
  `,
})
export class CartLineItem {
  readonly dish = input.required<Dish>();
  readonly language = input.required<LanguageCode>();
  readonly quantity = input.required<number>();
  readonly removeLabel = input.required<string>();
  readonly decrement = output<void>();
  readonly increment = output<void>();
  readonly remove = output<void>();
  protected readonly name = computed(() => getTranslation(this.dish().translations, this.language())?.name ?? '');
  protected readonly description = computed(() => getTranslation(this.dish().translations, this.language())?.description ?? '');
}
