import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../../core/i18n/language.service';
import { Price } from '../../../shared/ui/price/price';
import { getTranslation } from '../../../shared/utils/get-translation';
import { AdminDashboardStore } from './admin-dashboard.store';
import { PageSkeleton } from '../../../shared/ui/page-skeleton/page-skeleton';

@Component({
  selector: 'app-dashboard-page',
  imports: [MatIcon, PageSkeleton, Price, RouterLink, TranslatePipe],
  providers: [AdminDashboardStore],
  styles: `
    main { max-inline-size: 90rem; margin: 0 auto; padding: clamp(1rem, 3vw, 2.5rem); }
    h1 { margin: 0; font-size: clamp(1.3rem, 2vw, 1.65rem); }
    .intro { margin: .3rem 0 1.5rem; color: var(--color-muted-text); font-size: .78rem; }
    .stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .85rem; }
    .stat { display: grid; gap: .5rem; padding: 1rem; border: 1px solid color-mix(in srgb, var(--color-text) 10%, transparent); border-radius: .8rem; background: var(--color-panel); }
    .stat mat-icon { color: var(--color-primary); }
    .stat span { color: var(--color-muted-text); font-size: .7rem; }
    .stat strong { font-size: 1.45rem; }
    .section { margin-block-start: 1.7rem; }
    .section-heading { display: flex; align-items: center; justify-content: space-between; margin-block-end: .8rem; }
    h2 { margin: 0; font-size: 1rem; }
    .view-all { color: var(--color-primary); font-size: .72rem; font-weight: 700; text-decoration: none; }
    .recent { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: .75rem; }
    article { overflow: hidden; border: 1px solid color-mix(in srgb, var(--color-text) 10%, transparent); border-radius: .7rem; background: var(--color-panel); }
    article img, .image-placeholder { display: block; inline-size: 100%; block-size: 6rem; object-fit: cover; background: var(--color-surface); }
    article div { padding: .65rem; }
    article strong { display: block; overflow: hidden; font-size: .74rem; text-overflow: ellipsis; white-space: nowrap; }
    article span { color: var(--color-muted-text); font-size: .67rem; }
    .state { display: grid; min-block-size: 16rem; place-items: center; color: var(--color-muted-text); }
    @media (max-width: 70rem) { .stats { grid-template-columns: repeat(2, minmax(0, 1fr)); } .recent { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
    @media (max-width: 32rem) { main { padding: 1rem; } .stats { gap: .65rem; } .stat { padding: .8rem; } .stat strong { font-size: 1.25rem; } .recent { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .6rem; } article img, .image-placeholder { block-size: 5.25rem; } }
  `,
  template: `
    <main>
      <h1>{{ 'ADMIN.DASHBOARD.TITLE' | translate }}</h1>
      <p class="intro">{{ 'ADMIN.DASHBOARD.DESCRIPTION' | translate }}</p>
      @if (store.loading()) { <app-page-skeleton [columns]="4" /> } @else if (store.hasError()) { <div class="state">{{ 'ADMIN.FEEDBACK.PAGE_LOAD_ERROR' | translate }}<button type="button" (click)="store.load()">{{ 'ADMIN.FEEDBACK.RETRY' | translate }}</button></div> } @else if (store.dashboard()) {
        <div class="stats">
          <div class="stat"><mat-icon aria-hidden="true">category</mat-icon><span>{{ 'ADMIN.DASHBOARD.CATEGORIES' | translate }}</span><strong>{{ store.dashboard()!.categoryCount }}</strong></div>
          <div class="stat"><mat-icon aria-hidden="true">restaurant_menu</mat-icon><span>{{ 'ADMIN.DASHBOARD.DISHES' | translate }}</span><strong>{{ store.dashboard()!.dishCount }}</strong></div>
          <div class="stat"><mat-icon aria-hidden="true">visibility</mat-icon><span>{{ 'ADMIN.DASHBOARD.PUBLISHED' | translate }}</span><strong>{{ store.dashboard()!.publishedDishCount }}</strong></div>
          <div class="stat"><mat-icon aria-hidden="true">check_circle</mat-icon><span>{{ 'ADMIN.DASHBOARD.AVAILABLE' | translate }}</span><strong>{{ store.dashboard()!.availableDishCount }}</strong></div>
        </div>
        <section class="section"><div class="section-heading"><h2>{{ 'ADMIN.DASHBOARD.RECENT_DISHES' | translate }}</h2><a class="view-all" routerLink="/admin/dishes">{{ 'ADMIN.DASHBOARD.VIEW_ALL' | translate }}</a></div><div class="recent">
          @for (summary of store.dashboard()!.recentDishes; track summary.dish.id) { <article>@if (summary.dish.image; as image) { <img [alt]="''" [src]="image.url" loading="lazy" /> } @else { <span class="image-placeholder"></span> }<div><strong>{{ name(summary.dish.translations) }}</strong><span><app-price [language]="languageService.currentLanguage()" [money]="summary.dish.price" /></span></div></article> }
        </div></section>
      }
    </main>
  `,
})
export class DashboardPage {
  protected readonly store = inject(AdminDashboardStore);
  protected readonly languageService = inject(LanguageService);
  constructor() { this.store.load(); }
  protected name(translations: readonly { readonly languageCode: string; readonly name: string }[]): string { return getTranslation(translations, this.languageService.currentLanguage())?.name ?? ''; }
}
