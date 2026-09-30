import { Component, computed, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { LanguageCode } from '../../models/language.model';
import { Dish } from '../../models/menu.model';
import { Price } from '../../ui/price/price';
import { QuantityControl } from '../../ui/quantity-control/quantity-control';
import { getTranslation } from '../../utils/get-translation';
import { AppImage } from '../../ui/app-image/app-image';

@Component({
  selector: 'app-dish-card',
  imports: [AppImage, MatIcon, Price, QuantityControl],
  styles: `
    article { display: grid; grid-template-columns: 6.25rem minmax(0, 1fr); gap: .875rem; padding: .75rem; border: 1px solid transparent; border-radius: 1rem; background: var(--color-surface); cursor: pointer; }
    article.paused { border-color: color-mix(in srgb, #e0a52e 82%, var(--color-surface)); background: color-mix(in srgb, #f5b940 9%, var(--color-surface)); }
    app-image, .placeholder { display:grid; place-items:center; inline-size:6.25rem; block-size:6.25rem; border-radius:.75rem; background:color-mix(in srgb,var(--color-primary) 15%,var(--color-surface)); color:var(--color-primary); }.placeholder mat-icon{font-size:2rem;inline-size:2rem;block-size:2rem;}
    h3, p { margin: 0; } h3 { font-size: 1rem; } p { margin-block-start: .3rem; color: var(--color-muted-text); font-size: .875rem; }
    .bottom { display: flex; align-items: center; justify-content: space-between; gap: .5rem; margin-block-start: .65rem; }
    .add { min-block-size: 2.5rem; border: 0; border-radius: .75rem; padding: .5rem .8rem; background: var(--color-primary); color: var(--color-on-image); font: inherit; font-weight: 700; }
    .add:focus-visible { outline: 3px solid var(--color-focus); outline-offset: 2px; }
    .paused-label { display: inline-flex; align-items: center; gap: .3rem; min-block-size: 2.25rem; padding: .45rem .65rem; border-radius: .7rem; background: color-mix(in srgb, #e0a52e 22%, var(--color-surface)); color: color-mix(in srgb, #8a5700 88%, var(--color-text)); font-size: .8rem; font-weight: 800; }
    .paused-label mat-icon { inline-size: 1rem; block-size: 1rem; font-size: 1rem; }
  `,
  template: `
    <article [class.paused]="!dish().isAvailable" (click)="detailsRequested.emit()">
      @if (dish().image; as image) { <app-image [alt]="name()" [height]="image.height" [src]="image.url" [width]="image.width" /> } @else { <span class="placeholder" aria-hidden="true"><mat-icon>image</mat-icon></span> }
      <div>
        <h3>{{ name() }}</h3>
        <p>{{ description() }}</p>
        <div class="bottom">
          <app-price [language]="language()" [money]="dish().price" />
          @if (!dish().isAvailable) {
            <span class="paused-label"><mat-icon aria-hidden="true">pause_circle</mat-icon>{{ unavailableLabel() }}</span>
          } @else if (quantity() > 0) {
            <span (click)="$event.stopPropagation()"><app-quantity-control [quantity]="quantity()" (decrement)="decrement.emit()" (increment)="increment.emit()" /></span>
          } @else {
            <button class="add" type="button" (click)="$event.stopPropagation(); add.emit()">{{ addLabel() }}</button>
          }
        </div>
      </div>
    </article>
  `,
})
export class DishCard {
  readonly dish = input.required<Dish>();
  readonly language = input.required<LanguageCode>();
  readonly quantity = input.required<number>();
  readonly addLabel = input.required<string>();
  readonly unavailableLabel = input.required<string>();
  readonly add = output<void>();
  readonly increment = output<void>();
  readonly decrement = output<void>();
  readonly detailsRequested = output<void>();
  readonly name = computed(() => getTranslation(this.dish().translations, this.language())?.name ?? '');
  readonly description = computed(
    () => getTranslation(this.dish().translations, this.language())?.description ?? '',
  );
}
