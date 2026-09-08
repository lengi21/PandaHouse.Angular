import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectOption } from '../select-field/select-field';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-select-input',
  imports: [MatIcon],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SelectInput), multi: true }],
  styles: `
    :host { display: block; }
    label { display: grid; gap: .45rem; color: var(--color-text); font-size: .84rem; font-weight: 700; }
    .control { position: relative; display: grid; }
    select { inline-size: 100%; min-block-size: 3rem; appearance: none; padding: .7rem 2.5rem .7rem .85rem; border: 1px solid color-mix(in srgb, var(--color-text) 16%, transparent); border-radius: .7rem; outline: none; background: var(--color-background); color: var(--color-text); font: inherit; font-size: .86rem; cursor: pointer; }
    select:hover { border-color: color-mix(in srgb, var(--color-primary) 55%, transparent); }
    select:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 18%, transparent); }
    mat-icon { position: absolute; inset: 50% .8rem auto auto; inline-size: 1.15rem; block-size: 1.15rem; transform: translateY(-50%); color: var(--color-primary); font-size: 1.15rem; pointer-events: none; }
  `,
  template: `
    <label>{{ label() }}
      <span class="control"><select [disabled]="disabled()" [name]="name()" [value]="value()" (change)="onValueChange($event)" (blur)="onTouched()">
        @for (option of options(); track option.value) { <option [value]="option.value">{{ option.label }}</option> }
      </select><mat-icon aria-hidden="true">expand_more</mat-icon></span>
    </label>
  `,
})
export class SelectInput implements ControlValueAccessor {
  readonly label = input.required<string>();
  readonly name = input.required<string>();
  readonly options = input.required<readonly SelectOption[]>();
  protected readonly value = signal('');
  protected readonly disabled = signal(false);
  protected onChange: (value: string) => void = () => undefined;
  protected onTouched: () => void = () => undefined;
  writeValue(value: string | null): void { this.value.set(value ?? ''); }
  registerOnChange(onChange: (value: string) => void): void { this.onChange = onChange; }
  registerOnTouched(onTouched: () => void): void { this.onTouched = onTouched; }
  setDisabledState(disabled: boolean): void { this.disabled.set(disabled); }
  protected onValueChange(event: Event): void { const value = (event.target as HTMLSelectElement).value; this.value.set(value); this.onChange(value); }
}
