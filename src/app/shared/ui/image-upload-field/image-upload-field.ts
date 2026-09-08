import { Component, inject, input, output, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { MEDIA_STORAGE_REPOSITORY } from '../../../core/data-access/storage/media-storage.repository';
import { ImageUploadResult } from '../../models/media-upload.model';

@Component({
  selector: 'app-image-upload-field',
  imports: [MatIcon, TranslatePipe],
  styles: `
    :host { display: block; }
    .upload { display: grid; gap: .45rem; padding: .8rem; border: 1px dashed color-mix(in srgb, var(--color-primary) 50%, transparent); border-radius: .7rem; background: color-mix(in srgb, var(--color-primary) 6%, transparent); }
    .label { font-size: .84rem; font-weight: 700; }
    .hint, .error { margin: 0; color: var(--color-muted-text); font-size: .7rem; }
    .error { color: #b33131; }
    label { display: inline-flex; align-items: center; justify-content: center; gap: .4rem; min-block-size: 2.45rem; padding: .5rem .8rem; border-radius: .55rem; background: var(--color-surface); color: var(--color-text); cursor: pointer; font-size: .75rem; font-weight: 700; }
    label mat-icon { inline-size: 1rem; block-size: 1rem; font-size: 1rem; }
    input { position: absolute; inline-size: 1px; block-size: 1px; overflow: hidden; opacity: 0; }
  `,
  template: `
    <div class="upload">
      <span class="label">{{ 'ADMIN.MEDIA.UPLOAD_TITLE' | translate }}</span>
      <p class="hint">{{ 'ADMIN.MEDIA.UPLOAD_HINT' | translate }}</p>
      <label><mat-icon aria-hidden="true">upload</mat-icon>{{ (uploading() ? 'ADMIN.MEDIA.UPLOADING' : 'ADMIN.MEDIA.SELECT_IMAGE') | translate }}<input accept="image/jpeg,image/png,image/webp" type="file" [disabled]="uploading()" (change)="upload($event)" /></label>
      @if (error()) { <p class="error" aria-live="polite">{{ 'ADMIN.MEDIA.UPLOAD_ERROR' | translate }}</p> }
    </div>
  `,
})
export class ImageUploadField {
  readonly folder = input.required<'categories' | 'dishes' | 'restaurant'>();
  readonly uploaded = output<ImageUploadResult>();
  private readonly storage = inject(MEDIA_STORAGE_REPOSITORY);
  protected readonly uploading = signal(false);
  protected readonly error = signal(false);

  protected upload(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.item(0);
    if (!file || this.uploading()) return;
    this.uploading.set(true);
    this.error.set(false);
    this.storage.uploadImage({ file, folder: this.folder() }).subscribe({
      next: (result) => this.uploaded.emit(result),
      error: () => this.error.set(true),
      complete: () => this.uploading.set(false),
    });
  }
}
