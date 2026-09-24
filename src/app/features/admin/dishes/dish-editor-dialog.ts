import { Component, computed, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { AdminDishSummary, DishDraft } from '../../../shared/models/admin-menu.model';
import { ModalPanel } from '../../../shared/ui/modal-panel/modal-panel';
import { SelectOption } from '../../../shared/ui/select-field/select-field';
import { SelectInput } from '../../../shared/ui/select-input/select-input';
import { TextInput } from '../../../shared/ui/text-input/text-input';
import { getTranslation } from '../../../shared/utils/get-translation';
import { ImageUploadField } from '../../../shared/ui/image-upload-field/image-upload-field';
import { TextareaInput } from '../../../shared/ui/textarea-input/textarea-input';

@Component({
  selector: 'app-dish-editor-dialog',
  imports: [ImageUploadField, ModalPanel, ReactiveFormsModule, SelectInput, TextareaInput, TextInput, TranslatePipe],
  styles: `
    form { display: grid; gap: 1rem; padding: 1rem; }
    .two-columns { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .8rem; }
    .translations, .toggles { display: grid; gap: .8rem; padding: .9rem; border: 1px solid color-mix(in srgb, var(--color-text) 10%, transparent); border-radius: .7rem; background: var(--color-surface); }
    h3 { margin: 0; font-size: .85rem; }
    .toggle { display: flex; align-items: center; justify-content: space-between; gap: 1rem; font-size: .8rem; font-weight: 700; }
    input[type='checkbox'] { inline-size: 1.1rem; block-size: 1.1rem; accent-color: var(--color-primary); }
    .error { min-block-size: 1rem; margin: 0; color: #b33131; font-size: .75rem; }
    footer { display: flex; justify-content: flex-end; gap: .6rem; }
    button { min-block-size: 2.55rem; padding: .5rem .85rem; border: 0; border-radius: .6rem; background: var(--color-surface); color: var(--color-text); font: inherit; font-size: .78rem; font-weight: 700; }
    button.save { background: var(--color-primary); color: var(--color-on-image); }
    @media (max-width: 35rem) { form { gap: .85rem; padding: .85rem; } .two-columns { grid-template-columns: 1fr; } footer { display: grid; grid-template-columns: 1fr 1fr; } button { inline-size: 100%; } }
  `,
  template: `
    <app-modal-panel [closeLabel]="'ADMIN.DISHES.CLOSE_EDITOR' | translate" [title]="(dish() ? 'ADMIN.DISHES.EDIT' : 'ADMIN.DISHES.ADD') | translate" (dismissed)="cancelled.emit()">
      <form [formGroup]="form" (ngSubmit)="save()">
        <app-image-upload-field folder="dishes" (uploaded)="form.controls.imageUrl.setValue($event.url)" />
        <div class="two-columns">
          <app-select-input formControlName="categoryId" [label]="'ADMIN.DISHES.CATEGORY' | translate" name="categoryId" [options]="categoryOptions()" />
          <app-text-input formControlName="price" [label]="'ADMIN.DISHES.PRICE_GEL' | translate" name="price" type="number" [required]="true" />
        </div>
        <div class="two-columns">
          <app-text-input formControlName="calories" [label]="'ADMIN.DISHES.CALORIES' | translate" name="calories" type="number" />
          <app-text-input formControlName="imageUrl" [label]="'ADMIN.DISHES.IMAGE_URL' | translate" name="imageUrl" type="text" />
        </div>
        <div class="translations" formGroupName="names">
          <h3>{{ 'ADMIN.DISHES.NAMES' | translate }}</h3>
          <app-text-input formControlName="ka" [label]="'ADMIN.CATEGORIES.GEORGIAN' | translate" name="nameKa" type="text" [required]="true" />
          <app-text-input formControlName="en" [label]="'ADMIN.CATEGORIES.ENGLISH' | translate" name="nameEn" type="text" [required]="true" />
          <app-text-input formControlName="ru" [label]="'ADMIN.CATEGORIES.RUSSIAN' | translate" name="nameRu" type="text" [required]="true" />
        </div>
        <div class="translations" formGroupName="comments">
          <h3>{{ 'ADMIN.DISHES.COMMENTS' | translate }}</h3>
          <app-textarea-input formControlName="ka" [label]="'ADMIN.DISHES.COMMENT_GEORGIAN' | translate" name="commentKa" />
          <app-textarea-input formControlName="en" [label]="'ADMIN.DISHES.COMMENT_ENGLISH' | translate" name="commentEn" />
          <app-textarea-input formControlName="ru" [label]="'ADMIN.DISHES.COMMENT_RUSSIAN' | translate" name="commentRu" />
        </div>
        <div class="toggles">
          <label class="toggle">{{ 'ADMIN.DISHES.PUBLISHED' | translate }}<input formControlName="isPublished" type="checkbox" /></label>
          <label class="toggle">{{ 'ADMIN.DISHES.AVAILABLE' | translate }}<input formControlName="isAvailable" type="checkbox" /></label>
        </div>
        <p class="error" aria-live="polite">@if (failed()) { {{ 'ADMIN.DISHES.SAVE_ERROR' | translate }} }</p>
        <footer><button type="button" (click)="cancelled.emit()">{{ 'ADMIN.CATEGORIES.CANCEL' | translate }}</button><button class="save" type="submit" [disabled]="form.invalid || saving()">{{ (saving() ? 'ADMIN.CATEGORIES.SAVING' : 'ADMIN.DISHES.SAVE') | translate }}</button></footer>
      </form>
    </app-modal-panel>
  `,
})
export class DishEditorDialog {
  readonly dish = input<AdminDishSummary | null>(null);
  readonly categories = input.required<readonly { readonly id: string; readonly translations: readonly { readonly languageCode: string; readonly name: string }[] }[]>();
  readonly saving = input(false);
  readonly failed = input(false);
  readonly cancelled = output<void>();
  readonly saved = output<DishDraft>();
  private readonly formBuilder = inject(FormBuilder);
  protected readonly categoryOptions = computed<readonly SelectOption[]>(() => this.categories().map((category) => ({ value: category.id, label: getTranslation(category.translations, 'en')?.name ?? '' })));
  protected readonly form = this.formBuilder.nonNullable.group({
    categoryId: ['', Validators.required], imageUrl: '', price: ['', [Validators.required, Validators.min(0)]], calories: '', isPublished: true, isAvailable: true,
    names: this.formBuilder.nonNullable.group({ ka: ['', Validators.required], en: ['', Validators.required], ru: ['', Validators.required] }),
    comments: this.formBuilder.nonNullable.group({ ka: '', en: '', ru: '' }),
  });

  constructor() {
    effect(() => {
      const summary = this.dish();
      const dish = summary?.dish;
      this.form.reset({
        categoryId: dish?.categoryId ?? this.categories().at(0)?.id ?? '', imageUrl: dish?.image?.url ?? '', price: dish ? String(dish.price.amountMinor / 100) : '', calories: dish?.calories ? String(dish.calories) : '', isPublished: dish?.isPublished ?? true, isAvailable: dish?.isAvailable ?? true,
        names: {
          ka: dish ? getTranslation(dish.translations, 'ka')?.name ?? '' : '', en: dish ? getTranslation(dish.translations, 'en')?.name ?? '' : '', ru: dish ? getTranslation(dish.translations, 'ru')?.name ?? '' : '',
        },
        comments: {
          ka: dish ? getTranslation(dish.translations, 'ka')?.description ?? '' : '', en: dish ? getTranslation(dish.translations, 'en')?.description ?? '' : '', ru: dish ? getTranslation(dish.translations, 'ru')?.description ?? '' : '',
        },
      });
    });
  }

  protected save(): void {
    if (this.form.invalid || this.saving()) return;
    const value = this.form.getRawValue();
    const existing = this.dish()?.dish;
    this.saved.emit({
      categoryId: value.categoryId, imageUrl: value.imageUrl, priceAmountMinor: Math.round(Number(value.price) * 100), calories: value.calories.trim() ? Number(value.calories) : null, isPublished: value.isPublished, isAvailable: value.isAvailable,
      translations: (['ka', 'en', 'ru'] as const).map((languageCode) => ({ languageCode, name: value.names[languageCode], description: value.comments[languageCode], recipe: existing ? getTranslation(existing.translations, languageCode)?.recipe ?? null : null })),
    });
  }
}
