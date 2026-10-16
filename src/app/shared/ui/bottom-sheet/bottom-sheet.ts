import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-bottom-sheet',
  host: { '[style.--sheet-top]': 'topOffset() ?? null' },
  styles: `
    :host { position: fixed; z-index: 20; inset: var(--sheet-top, var(--customer-header-height)) 0 0; display: block; }
    .backdrop { position: absolute; inset: 0; background: rgb(0 0 0 / 48%); }
    .sheet { position: absolute; inset: auto max(.75rem, calc((100% - 36rem) / 2)) .75rem; max-block-size: calc(100dvh - var(--customer-header-height) - 1.5rem); overflow-y: auto; padding: 1rem 1rem calc(var(--customer-navigation-height) + 1.5rem); border-radius: 1.2rem; background: var(--color-panel); color: var(--color-text); box-shadow: 0 1rem 2.5rem rgb(0 0 0 / 32%); animation: slide-up .24s ease-out both; }
    .sheet.expanded { inset-block: 0; max-block-size: none; border-radius: 1.2rem 1.2rem 0 0; }
    @keyframes slide-up { from { transform: translateY(105%); } to { transform: translateY(0); } }
  `,
  template: `
    <div class="backdrop" (click)="closed.emit()"></div>
    <section class="sheet" [class.expanded]="expanded()" aria-modal="true" role="dialog" [attr.aria-label]="ariaLabel()"><ng-content /></section>
  `,
})
export class BottomSheet {
  readonly ariaLabel = input.required<string>();
  /** Lets a sheet occupy the full area below a persistent page control. */
  readonly expanded = input(false);
  readonly topOffset = input<string | null>(null);
  readonly closed = output<void>();
}
