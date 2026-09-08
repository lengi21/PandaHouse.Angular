import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ActionLoaderService } from '../../../core/feedback/action-loader.service';

@Component({
  selector: 'app-full-page-loader',
  imports: [TranslatePipe],
  styles: `
    :host { display: contents; }
    .overlay { position: fixed; z-index: 90; inset: 0; display: grid; place-items: center; background: rgb(0 0 0 / 36%); backdrop-filter: blur(2px); }
    .content { display: grid; justify-items: center; gap: .8rem; padding: 1.25rem 1.5rem; border-radius: .9rem; background: var(--color-panel); color: var(--color-text); box-shadow: 0 1rem 3rem rgb(0 0 0 / 25%); font-size: .8rem; font-weight: 700; }
    i { inline-size: 2rem; block-size: 2rem; border: .24rem solid color-mix(in srgb, var(--color-primary) 25%, transparent); border-block-start-color: var(--color-primary); border-radius: 50%; animation: spin .75s linear infinite; }
    @keyframes spin { to { transform: rotate(1turn); } }
  `,
  template: `@if (loader.isActive()) { <div class="overlay"><div class="content" role="status"><i aria-hidden="true"></i>{{ 'ADMIN.FEEDBACK.PROCESSING' | translate }}</div></div> }`,
})
export class FullPageLoader { protected readonly loader = inject(ActionLoaderService); }
