import { Component, input, model } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

export interface SelectOption {
  readonly value: string;
  readonly label: string;
}

@Component({
  selector: 'app-select-field',
  imports: [MatIcon],
  styles: `
    :host {
      display: inline-block;
    }

    label { display: grid; }
    .control { position: relative; display: grid; }

    select {
      inline-size: 100%; min-inline-size: 10rem; max-inline-size: 14rem;
      min-block-size: 2.7rem;
      appearance: none;
      border: 1px solid color-mix(in srgb, var(--color-text) 14%, transparent);
      border-radius: .65rem;
      padding: .5rem 2.4rem .5rem .8rem;
      background: var(--color-panel);
      color: var(--color-text);
      font: inherit; font-size: .74rem; font-weight: 600; cursor: pointer;
    }
    select:hover { border-color: color-mix(in srgb, var(--color-primary) 55%, transparent); }

    select:focus-visible {
      outline: 0;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 16%, transparent);
    }
    mat-icon { position: absolute; inset: 50% .7rem auto auto; inline-size: 1.05rem; block-size: 1.05rem; transform: translateY(-50%); color: var(--color-primary); font-size: 1.05rem; pointer-events: none; }

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
      <span class="control"><select #select [value]="value()" (change)="value.set(select.value)">
          @for (option of options(); track option.value) { <option [value]="option.value">{{ option.label }}</option> }
        </select><mat-icon aria-hidden="true">expand_more</mat-icon></span>
    </label>
  `,
})
export class SelectField {
  readonly label = input.required<string>();
  readonly options = input.required<readonly SelectOption[]>();
  readonly value = model.required<string>();
}
