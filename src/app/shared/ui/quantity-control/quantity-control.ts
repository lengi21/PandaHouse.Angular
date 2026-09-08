import { Component, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-quantity-control',
  imports: [MatIcon],
  styles: `
    .control { display: inline-flex; align-items: center; border: 1px solid color-mix(in srgb, var(--color-text) 16%, transparent); border-radius: .75rem; }
    button { display: grid; inline-size: 2.5rem; block-size: 2.5rem; place-items: center; border: 0; background: transparent; color: var(--color-text); }
    button mat-icon { inline-size: 1.2rem; block-size: 1.2rem; font-size: 1.2rem; }
    output { min-inline-size: 1.5rem; text-align: center; font-weight: 700; }
    button:focus-visible { outline: 3px solid var(--color-focus); outline-offset: -2px; }
    .cart { gap: .15rem; border-color: color-mix(in srgb, var(--color-primary) 32%, var(--color-text) 12%); border-radius: .9rem; padding: .2rem; background: color-mix(in srgb, var(--color-primary) 7%, var(--color-surface)); }
    .cart button { inline-size: 2.2rem; block-size: 2.2rem; border-radius: .65rem; color: var(--color-primary); }
    .cart button:hover { background: color-mix(in srgb, var(--color-primary) 13%, transparent); }
    .cart button mat-icon { inline-size: 1.1rem; block-size: 1.1rem; font-size: 1.1rem; }
    .cart output { min-inline-size: 1.9rem; color: var(--color-primary); font-size: 1rem; font-weight: 800; }
  `,
  template: `
    <div class="control" [class.cart]="variant() === 'cart'">
      <button type="button" aria-label="Decrease quantity" (click)="decrement.emit()"><mat-icon aria-hidden="true">remove</mat-icon></button>
      <output>{{ quantity() }}</output>
      <button type="button" aria-label="Increase quantity" (click)="increment.emit()"><mat-icon aria-hidden="true">add</mat-icon></button>
    </div>
  `,
})
export class QuantityControl {
  readonly quantity = input.required<number>();
  readonly variant = input<'default' | 'cart'>('default');
  readonly decrement = output<void>();
  readonly increment = output<void>();
}
