import { Component, computed, effect, input, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

type ImageState = 'loading' | 'loaded' | 'error';

/** Displays a palette-aware placeholder until an image finishes loading. */
@Component({
  selector: 'app-image',
  imports: [MatIcon],
  styles: `
    :host { position: relative; display: block; overflow: hidden; background: var(--color-surface); }
    img { display: block; inline-size: 100%; block-size: 100%; border-radius: inherit; object-fit: cover; opacity: 0; transition: opacity 180ms ease; }
    img.loaded { opacity: 1; }
    img.error { visibility: hidden; }
    .placeholder { position: absolute; inset: 0; display: grid; place-items: center; background: linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 15%, var(--color-surface)), var(--color-surface)); color: color-mix(in srgb, var(--color-primary) 65%, var(--color-muted-text)); }
    .placeholder mat-icon { inline-size: 1.45rem; block-size: 1.45rem; font-size: 1.45rem; }
  `,
  template: `
    @if (state() !== 'loaded') {
      <span class="placeholder" aria-hidden="true"><mat-icon>image</mat-icon></span>
    }
    <img
      [alt]="alt()"
      [attr.fetchpriority]="priority() ? 'high' : null"
      [attr.height]="height()"
      [attr.loading]="priority() ? 'eager' : loading()"
      [attr.sizes]="sizes()"
      [attr.srcset]="srcset()"
      [attr.width]="width()"
      [class.error]="state() === 'error'"
      [class.loaded]="state() === 'loaded'"
      [src]="src()"
      [style.object-position]="objectPosition()"
      decoding="async"
      (error)="imageFailed()"
      (load)="imageLoaded()"
    />
  `,
})
export class AppImage {
  readonly src = input.required<string>();
  readonly alt = input('');
  readonly width = input<number | null>(null);
  readonly height = input<number | null>(null);
  readonly loading = input<'eager' | 'lazy'>('lazy');
  readonly priority = input(false);
  readonly srcset = input<string | null>(null);
  readonly sizes = input<string | null>(null);
  readonly objectPosition = input<string | null>(null);
  protected readonly state = signal<ImageState>('loading');
  protected readonly imageSource = computed(() => this.src());

  constructor() {
    effect(() => {
      this.imageSource();
      this.state.set('loading');
    });
  }

  protected imageLoaded(): void {
    this.state.set('loaded');
  }

  protected imageFailed(): void {
    this.state.set('error');
  }
}
