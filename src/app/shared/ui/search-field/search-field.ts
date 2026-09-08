import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-search-field',
  styles: `
    :host { display: block; }
    label { display: block; }
    input { inline-size: 100%; min-block-size: 2.7rem; border: 1px solid rgb(255 255 255 / 18%); border-radius: .65rem; padding: 0 .85rem; background: rgb(255 255 255 / 12%); color: var(--color-shell-text); font: inherit; }
    input.surface { border-color: color-mix(in srgb, var(--color-text) 18%, transparent); background: var(--color-surface); color: var(--color-text); }
    input::placeholder { color: color-mix(in srgb, var(--color-shell-text) 62%, transparent); }
    input.surface::placeholder { color: var(--color-muted-text); }
    input:focus-visible { outline: 3px solid var(--color-focus); outline-offset: 2px; }
    .visually-hidden { position: absolute; inline-size: 1px; block-size: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
  `,
  template: `
    <label>
      <span class="visually-hidden">{{ label() }}</span>
      <input #search type="search" [class.surface]="variant() === 'surface'" [placeholder]="placeholder()" [value]="value()" (input)="value.set(search.value)" />
    </label>
  `,
})
export class SearchField {
  readonly label = input.required<string>();
  readonly placeholder = input.required<string>();
  readonly value = model.required<string>();
  readonly variant = input<'shell' | 'surface'>('shell');
}
