import { Component, inject, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../../core/i18n/language.service';
import { getTranslation } from '../../../shared/utils/get-translation';
import { PageSkeleton } from '../../../shared/ui/page-skeleton/page-skeleton';
import { AdminQrAnalyticsStore } from './admin-qr-analytics.store';

@Component({
  selector: 'app-admin-qr-analytics-page',
  imports: [MatIcon, PageSkeleton, TranslatePipe],
  providers: [AdminQrAnalyticsStore],
  styles: `
    main { max-inline-size: 90rem; margin: 0 auto; padding: clamp(1rem, 3vw, 2.5rem); }
    .heading { display:flex; align-items:start; justify-content:space-between; gap:1rem; margin-block-end:1.25rem; } h1,p,h2 { margin:0; } h1 { font-size:clamp(1.3rem,2vw,1.65rem); } .intro { margin-block-start:.3rem; color:var(--color-muted-text); font-size:.8rem; }
    .range { display:flex; gap:.35rem; padding:.25rem; border-radius:.75rem; background:var(--color-surface); } .range button { border:0; border-radius:.55rem; padding:.42rem .65rem; background:transparent; color:var(--color-muted-text); font:inherit; font-size:.72rem; font-weight:700; } .range button.active { background:var(--color-primary); color:var(--color-on-image); }
    .stats { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:.75rem; } .stat,.panel { border:1px solid color-mix(in srgb,var(--color-text) 10%,transparent); border-radius:.85rem; background:var(--color-panel); } .stat { display:flex; align-items:center; gap:.65rem; padding:.9rem; } .stat mat-icon { color:var(--color-primary); } .stat span { display:block; color:var(--color-muted-text); font-size:.7rem; } .stat strong { display:block; margin-block-start:.1rem; font-size:1.3rem; }
    .daily { margin-block-start:.75rem; } .daily-chart { display:flex; align-items:end; gap:.35rem; block-size:10rem; margin-block-start:1rem; overflow-x:auto; padding-block-end:1.25rem; } .day { display:grid; flex:1 0 2rem; min-inline-size:2rem; align-items:end; gap:.25rem; block-size:100%; } .day i { display:block; min-block-size:2px; border-radius:.25rem .25rem 0 0; background:var(--color-primary); } .day span { color:var(--color-muted-text); font-size:.62rem; text-align:center; white-space:nowrap; }
    .grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:.75rem; margin-block-start:.75rem; } .panel { padding:1rem; } h2 { font-size:.95rem; } .list { display:grid; gap:.6rem; margin:1rem 0 0; padding:0; list-style:none; } .row { display:grid; grid-template-columns:minmax(0,1fr) auto; gap:.7rem; align-items:center; } .row span { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:.8rem; } .row strong { color:var(--color-primary); font-size:.8rem; } .bar { grid-column:1/-1; block-size:.35rem; overflow:hidden; border-radius:99px; background:color-mix(in srgb,var(--color-primary) 10%,transparent); } .bar i { display:block; block-size:100%; border-radius:inherit; background:var(--color-primary); } .breakdowns { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:.75rem; margin-block-start:.75rem; } .empty,.state { display:grid; min-block-size:9rem; place-items:center; color:var(--color-muted-text); font-size:.8rem; } .state button { margin-inline-start:.5rem; }
    @media (max-width: 42rem) { main { padding:1rem; } .heading { align-items:stretch; flex-direction:column; } .range { align-self:flex-start; } .stats,.grid,.breakdowns { grid-template-columns:1fr; } }
  `,
  template: `
    <main>
      <div class="heading"><div><h1>{{ 'ADMIN.QR_ANALYTICS.TITLE' | translate }}</h1><p class="intro">{{ 'ADMIN.QR_ANALYTICS.DESCRIPTION' | translate }}</p></div><div class="range" [attr.aria-label]="'ADMIN.QR_ANALYTICS.DATE_RANGE' | translate">@for (value of ranges; track value) { <button type="button" [class.active]="days() === value" (click)="selectRange(value)">{{ value }}{{ 'ADMIN.QR_ANALYTICS.DAYS' | translate }}</button> }</div></div>
      @if (store.loading()) { <app-page-skeleton [columns]="3" /> } @else if (store.hasError()) { <div class="state">{{ 'ADMIN.FEEDBACK.PAGE_LOAD_ERROR' | translate }}<button type="button" (click)="store.load(days())">{{ 'ADMIN.FEEDBACK.RETRY' | translate }}</button></div> } @else if (store.report(); as report) {
        <section class="stats"><article class="stat"><mat-icon>qr_code_scanner</mat-icon><div><span>{{ 'ADMIN.QR_ANALYTICS.SCANS' | translate }}</span><strong>{{ report.scanCount }}</strong></div></article><article class="stat"><mat-icon>visibility</mat-icon><div><span>{{ 'ADMIN.QR_ANALYTICS.DISH_VIEWS' | translate }}</span><strong>{{ report.dishViewCount }}</strong></div></article><article class="stat"><mat-icon>category</mat-icon><div><span>{{ 'ADMIN.QR_ANALYTICS.CATEGORY_VISITS' | translate }}</span><strong>{{ report.categoryVisitCount }}</strong></div></article></section>
        <section class="panel daily"><h2>{{ 'ADMIN.QR_ANALYTICS.DAILY_ACTIVITY' | translate }}</h2><div class="daily-chart" [attr.aria-label]="'ADMIN.QR_ANALYTICS.DAILY_ACTIVITY' | translate">@for (item of report.dailyActivity; track item.date) { <div class="day" [attr.title]="dailyLabel(item.date, item.scans)"><i [style.block-size.%]="percentage(item.scans, dailyMaximum(report.dailyActivity))"></i><span>{{ shortDate(item.date) }}</span></div> }</div></section>
        <section class="grid"><article class="panel"><h2>{{ 'ADMIN.QR_ANALYTICS.MOST_VIEWED_DISHES' | translate }}</h2><ol class="list">@for (item of report.mostViewedDishes; track item.dishId) { <li class="row"><span>{{ name(item.translations) }}</span><strong>{{ item.views }}</strong><div class="bar"><i [style.inline-size.%]="percentage(item.views, report.mostViewedDishes[0].views)"></i></div></li> } @empty { <li class="empty">{{ 'ADMIN.QR_ANALYTICS.NO_ACTIVITY' | translate }}</li> }</ol></article><article class="panel"><h2>{{ 'ADMIN.QR_ANALYTICS.CATEGORY_VISITS' | translate }}</h2><ol class="list">@for (item of report.categoryVisits; track item.categoryId) { <li class="row"><span>{{ name(item.translations) }}</span><strong>{{ item.visits }}</strong><div class="bar"><i [style.inline-size.%]="percentage(item.visits, report.categoryVisits[0].visits)"></i></div></li> } @empty { <li class="empty">{{ 'ADMIN.QR_ANALYTICS.NO_ACTIVITY' | translate }}</li> }</ol></article></section>
        <section class="breakdowns"><article class="panel"><h2>{{ 'ADMIN.QR_ANALYTICS.LANGUAGES' | translate }}</h2><ul class="list">@for (item of report.languages; track item.languageCode) { <li class="row"><span>{{ languageLabel(item.languageCode) }}</span><strong>{{ item.count }}</strong><div class="bar"><i [style.inline-size.%]="percentage(item.count, maximum(report.languages))"></i></div></li> } @empty { <li class="empty">{{ 'ADMIN.QR_ANALYTICS.NO_ACTIVITY' | translate }}</li> }</ul></article><article class="panel"><h2>{{ 'ADMIN.QR_ANALYTICS.DEVICES' | translate }}</h2><ul class="list">@for (item of report.devices; track item.deviceType) { <li class="row"><span>{{ ('ADMIN.QR_ANALYTICS.DEVICE_' + item.deviceType.toUpperCase()) | translate }}</span><strong>{{ item.count }}</strong><div class="bar"><i [style.inline-size.%]="percentage(item.count, maximum(report.devices))"></i></div></li> } @empty { <li class="empty">{{ 'ADMIN.QR_ANALYTICS.NO_ACTIVITY' | translate }}</li> }</ul></article></section>
      }
    </main>
  `,
})
export class AdminQrAnalyticsPage {
  protected readonly store = inject(AdminQrAnalyticsStore);
  protected readonly language = inject(LanguageService);
  protected readonly days = signal(30);
  protected readonly ranges = [7, 30, 90] as const;

  constructor() { this.store.load(this.days()); }
  protected selectRange(days: number): void { this.days.set(days); this.store.load(days); }
  protected name(translations: readonly { readonly languageCode: string; readonly name: string }[]): string { return getTranslation(translations, this.language.currentLanguage())?.name ?? getTranslation(translations, 'en')?.name ?? '—'; }
  protected percentage(value: number, maximum: number): number { return maximum > 0 ? Math.round((value / maximum) * 100) : 0; }
  protected maximum(items: readonly { readonly count: number }[]): number { return Math.max(0, ...items.map((item) => item.count)); }
  protected dailyMaximum(items: readonly { readonly scans: number }[]): number { return Math.max(0, ...items.map((item) => item.scans)); }
  protected shortDate(date: string): string { return new Intl.DateTimeFormat(this.language.currentLanguage(), { day: 'numeric', month: 'short' }).format(new Date(`${date}T00:00:00Z`)); }
  protected dailyLabel(date: string, scans: number): string { return `${this.shortDate(date)}: ${scans}`; }
  protected languageLabel(language: string): string { return ({ ka: 'ქართული', en: 'English', ru: 'Русский' }[language] ?? language); }
}
