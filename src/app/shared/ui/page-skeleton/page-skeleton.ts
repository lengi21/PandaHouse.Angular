import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-skeleton',
  styles: `
    :host { display: grid; grid-template-columns: repeat(var(--skeleton-columns), minmax(0, 1fr)); gap: .8rem; } i { display: block; min-block-size: 7rem; border-radius: .8rem; background: linear-gradient(100deg, var(--color-surface) 30%, color-mix(in srgb, var(--color-panel) 70%, #fff) 50%, var(--color-surface) 70%); background-size: 200% 100%; animation: shimmer 1.15s linear infinite; } @keyframes shimmer { to { background-position-x: -200%; } } @media (max-width: 40rem) { :host { grid-template-columns: 1fr; } i { min-block-size: 5.5rem; } }
  `,
  template: `@for (item of items; track item) { <i aria-hidden="true"></i> }`,
  host: { '[style.--skeleton-columns]': 'columns()' },
})
export class PageSkeleton { readonly columns = input(3); protected readonly items = Array.from({ length: 6 }, (_, index) => index); }
