import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-quantity-control',
  styles: `
    .control { display: inline-flex; align-items: center; border: 1px solid color-mix(in srgb, var(--color-text) 16%, transparent); border-radius: .75rem; }
    button { inline-size: 2.5rem; block-size: 2.5rem; border: 0; background: transparent; color: var(--color-text); font: inherit; font-size: 1.25rem; }
    output { min-inline-size: 1.5rem; text-align: center; font-weight: 700; }
    button:focus-visible { outline: 3px solid var(--color-focus); outline-offset: -2px; }
  `,
  template: `
    <div class="control">
      <button type="button" aria-label="Decrease quantity" (click)="decrement.emit()">−</button>
      <output>{{ quantity() }}</output>
      <button type="button" aria-label="Increase quantity" (click)="increment.emit()">+</button>
    </div>
  `,
})
export class QuantityControl {
  readonly quantity = input.required<number>();
  readonly decrement = output<void>();
  readonly increment = output<void>();
}
