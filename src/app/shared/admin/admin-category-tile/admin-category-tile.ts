import { Component, computed, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { AdminCategorySummary } from '../../models/admin-menu.model';
import { LanguageCode } from '../../models/language.model';
import { getTranslation } from '../../utils/get-translation';

@Component({
  selector: 'app-admin-category-tile',
  imports: [MatIcon, TranslatePipe],
  styles: `
    :host { display: block; min-inline-size: 0; }
    article { overflow: hidden; border: 1px solid color-mix(in srgb, var(--color-text) 10%, transparent); border-radius: .75rem; background: var(--color-panel); box-shadow: 0 .35rem .9rem rgb(0 0 0 / 4%); }
    img, .image-placeholder { display: block; inline-size: 100%; block-size: 8.8rem; object-fit: cover; background: var(--color-surface); }
    .content { display: grid; gap: .42rem; padding: .7rem; }
    .title-row { display: flex; align-items: start; justify-content: space-between; gap: .4rem; }
    h2 { overflow: hidden; margin: 0; font-size: .82rem; line-height: 1.25; text-overflow: ellipsis; white-space: nowrap; }
    .more { display: grid; flex: 0 0 auto; inline-size: 1.8rem; block-size: 1.8rem; place-items: center; margin: -.25rem -.3rem -.25rem 0; border: 0; border-radius: .45rem; background: transparent; color: var(--color-muted-text); }
    .more mat-icon { inline-size: 1.1rem; block-size: 1.1rem; font-size: 1.1rem; }
    .order { display: flex; gap: .15rem; }
    .order button { display: grid; inline-size: 1.45rem; block-size: 1.45rem; place-items: center; border: 0; border-radius: .35rem; background: var(--color-surface); color: var(--color-text); }
    .order button:disabled { opacity: .35; }
    .order mat-icon { inline-size: .95rem; block-size: .95rem; font-size: .95rem; }
    .meta { display: flex; align-items: center; justify-content: space-between; gap: .35rem; color: var(--color-muted-text); font-size: .67rem; }
    .status { padding: .2rem .42rem; border-radius: 2rem; background: color-mix(in srgb, #55bd77 18%, transparent); color: #16733c; font-size: .61rem; font-weight: 700; }
    .status.hidden { background: color-mix(in srgb, #d77354 18%, transparent); color: #a13d28; }
  `,
  template: `
    <article>
      @if (summary().category.image; as image) {
        <img [alt]="''" [height]="image.height" [src]="image.url" [width]="image.width" loading="lazy" />
      } @else {
        <div class="image-placeholder" aria-hidden="true"></div>
      }
      <div class="content">
        <div class="title-row">
          <h2>{{ name() }}</h2>
          <button class="more" type="button" [attr.aria-label]="'ADMIN.CATEGORIES.MORE_ACTIONS' | translate" (click)="editRequested.emit()"><mat-icon aria-hidden="true">more_vert</mat-icon></button>
        </div>
        <div class="meta">
          <span>{{ summary().dishCount }} {{ 'ADMIN.CATEGORIES.DISHES' | translate }}</span>
          <span class="status" [class.hidden]="!summary().category.isVisible">{{ (summary().category.isVisible ? 'ADMIN.CATEGORIES.ACTIVE' : 'ADMIN.CATEGORIES.HIDDEN') | translate }}</span>
        </div>
        <div class="order">
          <button type="button" [attr.aria-label]="'ADMIN.CATEGORIES.MOVE_EARLIER' | translate" [disabled]="summary().category.sortOrder === 1" (click)="moveRequested.emit(-1)"><mat-icon aria-hidden="true">arrow_back</mat-icon></button>
          <button type="button" [attr.aria-label]="'ADMIN.CATEGORIES.MOVE_LATER' | translate" (click)="moveRequested.emit(1)"><mat-icon aria-hidden="true">arrow_forward</mat-icon></button>
          <span>#{{ summary().category.sortOrder }}</span>
        </div>
      </div>
    </article>
  `,
})
export class AdminCategoryTile {
  readonly summary = input.required<AdminCategorySummary>();
  readonly language = input.required<LanguageCode>();
  readonly editRequested = output<void>();
  readonly moveRequested = output<-1 | 1>();
  protected readonly name = computed(
    () => getTranslation(this.summary().category.translations, this.language())?.name ?? '',
  );
}
