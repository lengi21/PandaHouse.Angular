import { Component, computed, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { CdkDragHandle } from '@angular/cdk/drag-drop';
import { TranslatePipe } from '@ngx-translate/core';
import { AdminCategorySummary } from '../../models/admin-menu.model';
import { LanguageCode } from '../../models/language.model';
import { getTranslation } from '../../utils/get-translation';
import { AppImage } from '../../ui/app-image/app-image';

@Component({
  selector: 'app-admin-category-tile',
  imports: [AppImage, CdkDragHandle, MatIcon, TranslatePipe],
  styles: `
    :host { display: block; min-inline-size: 0; }
    article { overflow: hidden; border: 1px solid color-mix(in srgb, var(--color-text) 10%, transparent); border-radius: .75rem; background: var(--color-panel); box-shadow: 0 .35rem .9rem rgb(0 0 0 / 4%); }
    app-image, .image-placeholder { display: block; inline-size: 100%; block-size: 8.8rem; background: var(--color-surface); }.image-placeholder { display:grid; place-items:center; background:linear-gradient(135deg,color-mix(in srgb,var(--color-primary) 16%,var(--color-surface)),var(--color-surface)); color:var(--color-primary); }.image-placeholder mat-icon{font-size:2rem;inline-size:2rem;block-size:2rem;}
    .content { display: grid; gap: .42rem; padding: .7rem; }
    .title-row { display: flex; align-items: start; justify-content: space-between; gap: .4rem; }
    h2 { overflow: hidden; margin: 0; font-size: .82rem; line-height: 1.25; text-overflow: ellipsis; white-space: nowrap; }
    .more { display: grid; flex: 0 0 auto; inline-size: 1.8rem; block-size: 1.8rem; place-items: center; margin: -.25rem -.3rem -.25rem 0; border: 0; border-radius: .45rem; background: transparent; color: var(--color-muted-text); }
    .more mat-icon { inline-size: 1.1rem; block-size: 1.1rem; font-size: 1.1rem; }
    .tile-controls { display: flex; flex: 0 0 auto; align-items: center; gap: .1rem; }
    .quick-actions { display: flex; gap: .35rem; }
    .quick-actions button { display: inline-grid; flex: 1; min-block-size: 2rem; place-items: center; border: 0; border-radius: .45rem; background: var(--color-surface); color: var(--color-text); }
    .quick-actions button:first-child { color: var(--color-primary); }
    .quick-actions button.delete { color: #b33131; }
    .quick-actions mat-icon { inline-size: 1.05rem; block-size: 1.05rem; font-size: 1.05rem; }
    .reorder { inline-size: 100%; margin: 0; }
    .meta { display: flex; align-items: center; justify-content: space-between; gap: .35rem; color: var(--color-muted-text); font-size: .67rem; }
    .status { padding: .2rem .42rem; border-radius: 2rem; background: color-mix(in srgb, #55bd77 18%, transparent); color: #16733c; font-size: .61rem; font-weight: 700; }
    .status.hidden { background: color-mix(in srgb, #d77354 18%, transparent); color: #a13d28; }
  `,
  template: `
    <article>
      @if (summary().category.image; as image) {
        <app-image [alt]="''" [height]="image.height" [src]="image.url" [width]="image.width" />
      } @else {
        <div class="image-placeholder" aria-hidden="true"><mat-icon>image</mat-icon></div>
      }
      <div class="content">
        <div class="title-row">
          <h2>{{ name() }}</h2>
          <div class="tile-controls"><button class="more" type="button" [attr.aria-label]="'ADMIN.CATEGORIES.MORE_ACTIONS' | translate" (click)="editRequested.emit()"><mat-icon aria-hidden="true">more_vert</mat-icon></button></div>
        </div>
        <div class="meta">
          <span>{{ summary().dishCount }} {{ 'ADMIN.CATEGORIES.DISHES' | translate }}</span>
          <span class="status" [class.hidden]="!summary().category.isVisible">{{ (summary().category.isVisible ? 'ADMIN.CATEGORIES.ACTIVE' : 'ADMIN.CATEGORIES.HIDDEN') | translate }}</span>
        </div>
        <button class="drag-handle reorder" type="button" cdkDragHandle [attr.aria-label]="'ADMIN.CATEGORIES.DRAG_TO_REORDER' | translate"><mat-icon aria-hidden="true">drag_indicator</mat-icon><span>{{ 'ADMIN.CATEGORIES.REORDER' | translate }}</span></button>
        <div class="quick-actions">
          <button type="button" [attr.aria-label]="'ADMIN.CATEGORIES.EDIT' | translate" (click)="editRequested.emit()"><mat-icon aria-hidden="true">edit</mat-icon></button>
          <button type="button" [attr.aria-label]="(summary().category.isVisible ? 'ADMIN.CATEGORIES.HIDE' : 'ADMIN.CATEGORIES.SHOW') | translate" (click)="visibilityRequested.emit()"><mat-icon aria-hidden="true">{{ summary().category.isVisible ? 'visibility_off' : 'visibility' }}</mat-icon></button>
          <button class="delete" type="button" aria-label="Delete category" (click)="deleteRequested.emit()"><mat-icon aria-hidden="true">delete</mat-icon></button>
        </div>
      </div>
    </article>
  `,
})
export class AdminCategoryTile {
  readonly summary = input.required<AdminCategorySummary>();
  readonly language = input.required<LanguageCode>();
  readonly editRequested = output<void>();
  readonly visibilityRequested = output<void>();
  readonly deleteRequested = output<void>();
  protected readonly name = computed(
    () => getTranslation(this.summary().category.translations, this.language())?.name ?? '',
  );
}
