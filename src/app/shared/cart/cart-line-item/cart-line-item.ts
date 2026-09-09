import { Component, computed, input, output, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { LanguageCode } from '../../models/language.model';
import { Dish } from '../../models/menu.model';
import { Price } from '../../ui/price/price';
import { QuantityControl } from '../../ui/quantity-control/quantity-control';
import { getTranslation } from '../../utils/get-translation';
import { AppImage } from '../../ui/app-image/app-image';

@Component({
  selector: 'app-cart-line-item',
  imports: [AppImage, MatIcon, Price, QuantityControl],
  styles: `
    .swipe-area { position: relative; overflow: hidden; border-radius: 1rem; touch-action: pan-y; }
    .swipe-remove { position: absolute; inset: 0; display: flex; align-items: center; justify-content: flex-end; gap: .4rem; padding-inline-end: 1rem; background: #c93d3d; color: #fff; font-size: .78rem; font-weight: 700; }
    .swipe-remove mat-icon { inline-size: 1.15rem; block-size: 1.15rem; font-size: 1.15rem; }
    article { position: relative; display: grid; grid-template-columns: 5rem minmax(0, 1fr) 2.5rem; gap: .75rem; align-items: center; padding: .7rem; border-radius: 1rem; background: var(--color-surface); transition: transform .18s ease-out; }
    article.dragging { transition: none; }
    app-image, .placeholder { inline-size: 5rem; block-size: 5rem; border-radius: .75rem; }
    .placeholder { display: grid; place-items: center; background: color-mix(in srgb, var(--color-primary) 15%, var(--color-surface)); }
    .placeholder mat-icon { inline-size: 1.5rem; block-size: 1.5rem; font-size: 1.5rem; }
    h2, p { margin: 0; } h2 { font-size: .95rem; line-height: 1.25; } p { margin-block-start: .25rem; color: var(--color-muted-text); font-size: .78rem; }
    .bottom { display: flex; align-items: center; justify-content: space-between; gap: .65rem; margin-block-start: .5rem; font-weight: 700; }
    app-quantity-control { flex: 0 0 auto; }
    .remove { display: grid; inline-size: 2.5rem; block-size: 2.5rem; place-items: center; border: 0; border-radius: .7rem; background: color-mix(in srgb, var(--color-text) 7%, transparent); color: var(--color-text); }
    .remove mat-icon { inline-size: 1.1rem; block-size: 1.1rem; font-size: 1.1rem; }
    .remove:focus-visible { outline: 3px solid var(--color-focus); outline-offset: 2px; }
    @media (max-width: 25rem) { article { grid-template-columns: 4rem minmax(0, 1fr) 2.35rem; gap: .55rem; } app-image, .placeholder { inline-size: 4rem; block-size: 4rem; } .bottom { align-items: flex-start; flex-direction: column; } .control { transform: scale(.9); transform-origin: left; } }
  `,
  template: `
    <div class="swipe-area">
      <div aria-hidden="true" class="swipe-remove"><mat-icon>delete</mat-icon>{{ removeLabel() }}</div>
      <article [class.dragging]="isDragging()" [style.transform]="'translateX(' + swipeOffset() + 'px)'" (pointerdown)="startSwipe($event)" (pointermove)="continueSwipe($event)" (pointercancel)="finishSwipe($event)" (pointerup)="finishSwipe($event)">
        @if (dish().image; as image) { <app-image [alt]="name()" [height]="image.height" [src]="image.url" [width]="image.width" /> } @else { <span aria-hidden="true" class="placeholder"><mat-icon>restaurant</mat-icon></span> }
        <div>
          <h2>{{ name() }}</h2>
          <p>{{ description() }}</p>
          <div class="bottom">
            <app-price [language]="language()" [money]="dish().price" />
            <span (pointerdown)="$event.stopPropagation()"><app-quantity-control variant="cart" [quantity]="quantity()" (decrement)="decrement.emit()" (increment)="increment.emit()" /></span>
          </div>
        </div>
        <button class="remove" type="button" [attr.aria-label]="removeLabel() + ': ' + name()" (pointerdown)="$event.stopPropagation()" (click)="remove.emit()"><mat-icon aria-hidden="true">delete_outline</mat-icon></button>
      </article>
    </div>
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
  protected readonly swipeOffset = signal(0);
  protected readonly isDragging = signal(false);
  private pointerId: number | null = null;
  private startX = 0;
  protected readonly name = computed(() => getTranslation(this.dish().translations, this.language())?.name ?? '');
  protected readonly description = computed(() => getTranslation(this.dish().translations, this.language())?.description ?? '');

  protected startSwipe(event: PointerEvent): void {
    if (this.isInteractiveElement(event.target)) return;
    this.pointerId = event.pointerId;
    this.startX = event.clientX;
    this.isDragging.set(true);
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }

  protected continueSwipe(event: PointerEvent): void {
    if (event.pointerId !== this.pointerId) return;
    this.swipeOffset.set(Math.max(-132, Math.min(0, event.clientX - this.startX)));
  }

  protected finishSwipe(event: PointerEvent): void {
    if (event.pointerId !== this.pointerId) return;
    const shouldRemove = this.swipeOffset() <= -88;
    this.pointerId = null;
    this.isDragging.set(false);
    this.swipeOffset.set(0);
    if (shouldRemove) this.remove.emit();
  }

  private isInteractiveElement(target: EventTarget | null): boolean {
    return target instanceof Element && target.closest('button') !== null;
  }
}
