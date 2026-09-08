import { Component, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-modal-panel',
  imports: [MatIcon],
  styles: `
    :host { position: fixed; z-index: 50; inset: 0; display: grid; place-items: center; padding: 1rem; }
    .backdrop { position: absolute; inset: 0; background: rgb(0 0 0 / 52%); }
    section { position: relative; inline-size: min(100%, 38rem); max-block-size: calc(100dvh - 2rem); overflow-y: auto; border-radius: .9rem; background: var(--color-panel); box-shadow: 0 1.4rem 3.5rem rgb(0 0 0 / 38%); }
    header { display: flex; position: sticky; z-index: 1; inset-block-start: 0; align-items: center; justify-content: space-between; min-block-size: 3.75rem; padding: .75rem 1rem; border-block-end: 1px solid color-mix(in srgb, var(--color-text) 10%, transparent); background: var(--color-panel); }
    h2 { margin: 0; font-size: 1rem; }
    button { display: grid; inline-size: 2.25rem; block-size: 2.25rem; place-items: center; border: 0; border-radius: .5rem; background: transparent; color: var(--color-text); }
    button mat-icon { inline-size: 1.25rem; block-size: 1.25rem; font-size: 1.25rem; }
    @media (max-width: 34rem) { :host { align-items: end; padding: 0; } section { inline-size: 100%; max-block-size: min(92dvh, 44rem); border-radius: 1rem 1rem 0 0; } header { min-block-size: 3.45rem; padding-inline: .85rem; } }
  `,
  template: `
    <div class="backdrop" (click)="dismissed.emit()"></div>
    <section aria-modal="true" role="dialog" [attr.aria-label]="title()">
      <header><h2>{{ title() }}</h2><button type="button" [attr.aria-label]="closeLabel()" (click)="dismissed.emit()"><mat-icon aria-hidden="true">close</mat-icon></button></header>
      <ng-content />
    </section>
  `,
})
export class ModalPanel {
  readonly title = input.required<string>();
  readonly closeLabel = input.required<string>();
  readonly dismissed = output<void>();
}
