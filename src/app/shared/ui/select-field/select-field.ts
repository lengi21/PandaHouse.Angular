import { Component, input, model } from '@angular/core';

export interface SelectOption {
  readonly value: string;
  readonly label: string;
}

@Component({
  selector: 'app-select-field',
  styles: `
    :host {
      display: inline-block;
    }

    label {
      display: grid;
    }

    select {
      min-block-size: 2.75rem;
      max-inline-size: 9rem;
      border: 1px solid color-mix(in srgb, var(--color-text) 18%, transparent);
      border-radius: .75rem;
      padding: .5rem 2rem .5rem .7rem;
      background: var(--color-surface);
      color: var(--color-text);
      font: inherit;
    }

    select:focus-visible {
      outline: 3px solid var(--color-focus);
      outline-offset: 2px;
    }

    .visually-hidden {
      position: absolute;
      inline-size: 1px;
      block-size: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
    }
  `,
  template: `
    <label>
      <span class="visually-hidden">{{ label() }}</span>
      <select #select [value]="value()" (change)="value.set(select.value)">
        @for (option of options(); track option.value) {
          <option [value]="option.value">{{ option.label }}</option>
        }
      </select>
    </label>
  `,
})
export class SelectField {
  readonly label = input.required<string>();
  readonly options = input.required<readonly SelectOption[]>();
  readonly value = model.required<string>();
}
