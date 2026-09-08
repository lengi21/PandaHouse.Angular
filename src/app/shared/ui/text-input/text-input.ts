import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInput),
      multi: true,
    },
  ],
  styles: `
    :host { display: block; }
    label { display: grid; gap: .45rem; color: var(--color-text); font-size: .84rem; font-weight: 700; }
    input { inline-size: 100%; min-block-size: 3rem; padding: .7rem .85rem; border: 1px solid color-mix(in srgb, var(--color-text) 16%, transparent); border-radius: .7rem; outline: none; background: var(--color-background); color: var(--color-text); font: inherit; }
    input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 18%, transparent); }
    input:disabled { cursor: not-allowed; opacity: .62; }
  `,
  template: `
    <label>
      {{ label() }}
      <input
        [attr.autocomplete]="autocomplete()"
        [disabled]="disabled()"
        [name]="name()"
        [placeholder]="placeholder()"
        [required]="required()"
        [type]="type()"
        [value]="value()"
        (blur)="onTouched()"
        (input)="onValueChange($event)"
      />
    </label>
  `,
})
export class TextInput implements ControlValueAccessor {
  readonly label = input.required<string>();
  readonly name = input.required<string>();
  readonly type = input<'email' | 'number' | 'password' | 'text'>('text');
  readonly autocomplete = input<string>();
  readonly placeholder = input<string>('');
  readonly required = input(false);

  protected readonly value = signal('');
  protected readonly disabled = signal(false);
  protected onChange: (value: string) => void = () => undefined;
  protected onTouched: () => void = () => undefined;

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  registerOnChange(onChange: (value: string) => void): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled.set(disabled);
  }

  protected onValueChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value.set(value);
    this.onChange(value);
  }
}
