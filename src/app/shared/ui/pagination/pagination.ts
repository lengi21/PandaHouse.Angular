import { Component, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-pagination',
  imports: [MatIcon],
  styles: `
    :host { display: flex; align-items: center; justify-content: flex-end; gap: .55rem; padding: .8rem 0 0; color: var(--color-muted-text); font-size: .73rem; }
    button { display: grid; inline-size: 2.25rem; block-size: 2.25rem; place-items: center; border: 1px solid color-mix(in srgb, var(--color-text) 12%, transparent); border-radius: .5rem; background: var(--color-panel); color: var(--color-text); }
    button:disabled { opacity: .4; }
    mat-icon { inline-size: 1.1rem; block-size: 1.1rem; font-size: 1.1rem; }
    @media (max-width: 30rem) { :host { justify-content: center; } }
  `,
  template: `<span>{{ page() }} / {{ pageCount() }}</span><button type="button" [disabled]="!hasPrevious()" (click)="pageRequested.emit(page() - 1)"><mat-icon aria-hidden="true">chevron_left</mat-icon></button><button type="button" [disabled]="!hasNext()" (click)="pageRequested.emit(page() + 1)"><mat-icon aria-hidden="true">chevron_right</mat-icon></button>`,
})
export class Pagination {
  readonly page = input.required<number>();
  readonly pageCount = input.required<number>();
  readonly hasPrevious = input.required<boolean>();
  readonly hasNext = input.required<boolean>();
  readonly pageRequested = output<number>();
}
