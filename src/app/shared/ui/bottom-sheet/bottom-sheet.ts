import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-bottom-sheet',
  styles: `
    :host { position: fixed; z-index: 20; inset: var(--customer-header-height) 0 0; display: block; }
    .backdrop { position: absolute; inset: 0; background: rgb(0 0 0 / 48%); }
    .sheet { position: absolute; inset: auto max(.75rem, calc((100% - 36rem) / 2)) .75rem; max-block-size: calc(100dvh - var(--customer-header-height) - 1.5rem); overflow-y: auto; padding: 1rem 1rem calc(var(--customer-navigation-height) + 1.5rem); border-radius: 1.2rem; background: var(--color-panel); color: var(--color-text); box-shadow: 0 1rem 2.5rem rgb(0 0 0 / 32%); animation: slide-up .24s ease-out both; }
    @keyframes slide-up { from { transform: translateY(105%); } to { transform: translateY(0); } }
  `,
  template: `
    <div class="backdrop" (click)="closed.emit()"></div>
    <section class="sheet" aria-modal="true" role="dialog" [attr.aria-label]="ariaLabel()"><ng-content /></section>
  `,
})
export class BottomSheet {
  readonly ariaLabel = input.required<string>();
  readonly closed = output<void>();
}
