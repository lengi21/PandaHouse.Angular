import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { ToastService } from '../../../core/feedback/toast.service';

@Component({
  selector: 'app-toast-container',
  imports: [MatIcon, TranslatePipe],
  styles: `
    :host { position: fixed; z-index: 100; inset: auto 1rem max(1rem, env(safe-area-inset-bottom)) auto; display: grid; gap: .55rem; inline-size: min(23rem, calc(100vw - 2rem)); pointer-events: none; }
    article { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: .6rem; padding: .75rem .75rem .75rem .9rem; border-radius: .7rem; background: var(--color-shell); color: var(--color-shell-text); box-shadow: 0 .7rem 1.7rem rgb(0 0 0 / 25%); pointer-events: auto; animation: toast-in .2s ease-out both; }
    article.success { border-inline-start: .25rem solid #58ba79; } article.error { border-inline-start: .25rem solid #e46358; } article.info { border-inline-start: .25rem solid #78a5e4; }
    mat-icon { inline-size: 1.15rem; block-size: 1.15rem; font-size: 1.15rem; } span { font-size: .76rem; font-weight: 600; line-height: 1.35; }
    button { display: grid; inline-size: 1.8rem; block-size: 1.8rem; place-items: center; border: 0; border-radius: .4rem; background: transparent; color: inherit; } button mat-icon { inline-size: 1rem; block-size: 1rem; font-size: 1rem; }
    @keyframes toast-in { from { opacity: 0; transform: translateY(.5rem); } to { opacity: 1; transform: translateY(0); } }
  `,
  template: `@for (toast of toastService.toasts(); track toast.id) { <article [class]="toast.type"><mat-icon aria-hidden="true">{{ toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info' }}</mat-icon><span>{{ toast.messageKey | translate }}</span><button type="button" aria-label="Close" (click)="toastService.dismiss(toast.id)"><mat-icon aria-hidden="true">close</mat-icon></button></article> }`,
})
export class ToastContainer { protected readonly toastService = inject(ToastService); }
