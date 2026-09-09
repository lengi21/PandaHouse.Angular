import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageCode } from '../../models/language.model';
import { Category } from '../../models/menu.model';
import { getTranslation } from '../../utils/get-translation';
import { responsiveImageSrcset } from '../../utils/responsive-image';
import { AppImage } from '../../ui/app-image/app-image';

@Component({
  selector: 'app-category-card',
  imports: [AppImage, RouterLink],
  styles: `
    :host {
      display: block;
      content-visibility: auto;
      contain-intrinsic-block-size: 10.5rem;
    }

    .card {
      position: relative;
      display: grid;
      place-items: center;
      min-block-size: 10.5rem;
      overflow: hidden;
      border: 1px solid rgb(255 255 255 / 12%);
      border-radius: .65rem;
      background: var(--color-shell);
      color: var(--color-on-image);
      isolation: isolate;
      text-decoration: none;
    }

    .card::after {
      position: absolute;
      z-index: 1;
      inset: 0;
      background: linear-gradient(180deg, transparent 25%, rgb(17 21 18 / 78%));
      content: '';
    }

    app-image {
      position: absolute;
      z-index: -1;
      inline-size: 100%;
      block-size: 100%;
      object-fit: cover;
    }

    .name {
      z-index: 2;
      padding: 1rem;
      text-align: center;
      font-family: Georgia, serif;
      font-size: 1.3rem;
      font-weight: 700;
      letter-spacing: .09em;
      text-transform: uppercase;
      line-height: 1.2;
    }

    .card:focus-visible {
      outline: 3px solid var(--color-focus);
      outline-offset: 3px;
    }
  `,
  template: `
    <a
      class="card"
      [attr.aria-label]="name()"
      [queryParams]="{ category: category().id, source: 'category-list' }"
      [routerLink]="['/menu']"
    >
      @if (category().image; as image) {
        <app-image
          [alt]="''"
          [loading]="priority() ? 'eager' : 'lazy'"
          [height]="image.height"
          [priority]="priority()"
          sizes="(max-width: 36rem) calc(100vw - 2rem), 34rem"
          [src]="image.url"
          [srcset]="srcset()"
          [width]="image.width"
        />
      }
      <span class="name">{{ name() }}</span>
    </a>
  `,
})
export class CategoryCard {
  readonly category = input.required<Category>();
  readonly language = input.required<LanguageCode>();
  readonly priority = input(false);
  readonly srcset = computed(() => responsiveImageSrcset(this.category().image?.url ?? ''));
  readonly name = computed(
    () => getTranslation(this.category().translations, this.language())?.name ?? '',
  );
}
