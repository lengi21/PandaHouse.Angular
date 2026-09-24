import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-textarea-input',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TextareaInput), multi: true }],
  styles: `
    :host { display: block; }
    label { display: grid; gap: .45rem; color: var(--color-text); font-size: .84rem; font-weight: 700; }
    textarea { inline-size: 100%; min-block-size: 4.75rem; resize: vertical; padding: .7rem .85rem; border: 1px solid color-mix(in srgb, var(--color-text) 16%, transparent); border-radius: .7rem; outline: none; background: var(--color-background); color: var(--color-text); font: inherit; line-height: 1.4; }
    textarea:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 18%, transparent); }
    textarea:disabled { cursor: not-allowed; opacity: .62; }
  `,
  template: `<label>{{ label() }}<textarea [attr.autocomplete]="autocomplete()" [disabled]="disabled()" [name]="name()" [placeholder]="placeholder()" [required]="required()" [value]="value()" (blur)="onTouched()" (input)="onValueChange($event)"></textarea></label>`,
})
export class TextareaInput implements ControlValueAccessor {
  readonly label = input.required<string>();
  readonly name = input.required<string>();
  readonly autocomplete = input<string>();
  readonly placeholder = input<string>('');
  readonly required = input(false);
  protected readonly value = signal('');
  protected readonly disabled = signal(false);
  protected onChange: (value: string) => void = () => undefined;
  protected onTouched: () => void = () => undefined;
  writeValue(value: string | null): void { this.value.set(value ?? ''); }
  registerOnChange(onChange: (value: string) => void): void { this.onChange = onChange; }
  registerOnTouched(onTouched: () => void): void { this.onTouched = onTouched; }
  setDisabledState(disabled: boolean): void { this.disabled.set(disabled); }
  protected onValueChange(event: Event): void { const value = (event.target as HTMLTextAreaElement).value; this.value.set(value); this.onChange(value); }
}
