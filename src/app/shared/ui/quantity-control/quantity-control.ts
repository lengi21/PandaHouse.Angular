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
  `,
  template: `
    <div class="control">
      <button type="button" aria-label="Decrease quantity" (click)="decrement.emit()"><mat-icon aria-hidden="true">remove</mat-icon></button>
      <output>{{ quantity() }}</output>
      <button type="button" aria-label="Increase quantity" (click)="increment.emit()"><mat-icon aria-hidden="true">add</mat-icon></button>
    </div>
  `,
})
export class QuantityControl {
  readonly quantity = input.required<number>();
  readonly decrement = output<void>();
  readonly increment = output<void>();
}
