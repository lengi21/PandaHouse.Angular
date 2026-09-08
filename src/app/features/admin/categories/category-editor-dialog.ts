import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { CategoryDraft } from '../../../shared/models/admin-menu.model';
import { Category } from '../../../shared/models/menu.model';
import { ModalPanel } from '../../../shared/ui/modal-panel/modal-panel';
import { TextInput } from '../../../shared/ui/text-input/text-input';
import { getTranslation } from '../../../shared/utils/get-translation';
import { ImageUploadField } from '../../../shared/ui/image-upload-field/image-upload-field';

@Component({
  selector: 'app-category-editor-dialog',
  imports: [ImageUploadField, ModalPanel, ReactiveFormsModule, TextInput, TranslatePipe],
  styles: `
    form {
      display: grid;
      gap: 1rem;
      padding: 1rem;
    }

    .translations {
      display: grid;
      gap: .8rem;
      padding: .9rem;
      border: 1px solid color-mix(in srgb, var(--color-text) 10%, transparent);
      border-radius: .7rem;
      background: var(--color-surface);
    }

    h3 {
      margin: 0;
      font-size: .85rem;
    }

    .switch {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: .7rem .85rem;
      border: 1px solid color-mix(in srgb, var(--color-text) 12%, transparent);
      border-radius: .7rem;
      font-size: .82rem;
      font-weight: 700;
    }

    input[type='checkbox'] {
      inline-size: 1.1rem;
      block-size: 1.1rem;
      accent-color: var(--color-primary);
    }

    .error {
      min-block-size: 1rem;
      margin: 0;
      color: #b33131;
      font-size: .75rem;
    }

    footer {
      display: flex;
      justify-content: flex-end;
      gap: .6rem;
      padding-block-start: .25rem;
    }

    button {
      min-block-size: 2.55rem;
      padding: .5rem .85rem;
      border: 0;
      border-radius: .6rem;
      background: var(--color-surface);
      color: var(--color-text);
      font: inherit;
      font-size: .78rem;
      font-weight: 700;
    }

    button.save {
      background: var(--color-primary);
      color: var(--color-on-image);
    }

    button:disabled {
      opacity: .6;
    }
  `,
  template: `
    <app-modal-panel [closeLabel]="'ADMIN.CATEGORIES.CLOSE_EDITOR' | translate" [title]="(category() ? 'ADMIN.CATEGORIES.EDIT' : 'ADMIN.CATEGORIES.ADD') | translate" (dismissed)="cancelled.emit()">
      <form [formGroup]="form" (ngSubmit)="save()">
        <app-image-upload-field folder="categories" (uploaded)="form.controls.imageUrl.setValue($event.url)" />
        <app-text-input formControlName="imageUrl" [label]="'ADMIN.CATEGORIES.IMAGE_URL' | translate" name="imageUrl" type="text" autocomplete="url" />
        <div class="translations" formGroupName="names">
          <h3>{{ 'ADMIN.CATEGORIES.NAMES' | translate }}</h3>
          <app-text-input formControlName="ka" [label]="'ADMIN.CATEGORIES.GEORGIAN' | translate" name="nameKa" type="text" [required]="true" />
          <app-text-input formControlName="en" [label]="'ADMIN.CATEGORIES.ENGLISH' | translate" name="nameEn" type="text" [required]="true" />
          <app-text-input formControlName="ru" [label]="'ADMIN.CATEGORIES.RUSSIAN' | translate" name="nameRu" type="text" [required]="true" />
        </div>
        <label class="switch">{{ 'ADMIN.CATEGORIES.VISIBLE' | translate }}<input formControlName="isVisible" type="checkbox" /></label>
        <p class="error" aria-live="polite">@if (failed()) { {{ 'ADMIN.CATEGORIES.SAVE_ERROR' | translate }} }</p>
        <footer>
          <button type="button" (click)="cancelled.emit()">{{ 'ADMIN.CATEGORIES.CANCEL' | translate }}</button>
          <button class="save" type="submit" [disabled]="form.invalid || saving()">{{ (saving() ? 'ADMIN.CATEGORIES.SAVING' : 'ADMIN.CATEGORIES.SAVE') | translate }}</button>
        </footer>
      </form>
    </app-modal-panel>
  `,
})
export class CategoryEditorDialog {
  readonly category = input<Category | null>(null);
  readonly cancelled = output<void>();
  readonly saved = output<CategoryDraft>();
  readonly saving = input(false);
  readonly failed = input(false);
  private readonly formBuilder = inject(FormBuilder);
  protected readonly form = this.formBuilder.nonNullable.group({
    imageUrl: '',
    isVisible: true,
    names: this.formBuilder.nonNullable.group({
      ka: ['', Validators.required],
      en: ['', Validators.required],
      ru: ['', Validators.required],
    }),
  });

  constructor() {
    effect(() => {
      const category = this.category();
      this.form.reset({
        imageUrl: category?.image?.url ?? '',
        isVisible: category?.isVisible ?? true,
        names: {
          ka: category ? getTranslation(category.translations, 'ka')?.name ?? '' : '',
          en: category ? getTranslation(category.translations, 'en')?.name ?? '' : '',
          ru: category ? getTranslation(category.translations, 'ru')?.name ?? '' : '',
        },
      });
    });
  }

  protected save(): void {
    if (this.form.invalid || this.saving()) {
      return;
    }
    const value = this.form.getRawValue();
    this.saved.emit({
      imageUrl: value.imageUrl,
      isVisible: value.isVisible,
      translations: [
        { languageCode: 'ka', name: value.names.ka },
        { languageCode: 'en', name: value.names.en },
        { languageCode: 'ru', name: value.names.ru },
      ],
    });
  }
}
