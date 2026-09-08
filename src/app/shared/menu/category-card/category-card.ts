import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageCode } from '../../models/language.model';
import { Category } from '../../models/menu.model';
import { getTranslation } from '../../utils/get-translation';

@Component({
  selector: 'app-category-card',
  imports: [RouterLink],
  styles: `
    :host {
      display: block;
    }

    .card {
      position: relative;
      display: grid;
      min-block-size: 11rem;
      overflow: hidden;
      border-radius: 1.25rem;
      background: var(--color-surface);
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

    img {
      position: absolute;
      z-index: -1;
      inline-size: 100%;
      block-size: 100%;
      object-fit: cover;
    }

    .name {
      z-index: 2;
      align-self: end;
      padding: 1rem;
      font-size: 1.125rem;
      font-weight: 700;
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
      [queryParams]="{ category: category().id }"
      [routerLink]="['/menu']"
    >
      @if (category().image; as image) {
        <img [alt]="''" [height]="image.height" [src]="image.url" [width]="image.width" loading="lazy" />
      }
      <span class="name">{{ name() }}</span>
    </a>
  `,
})
export class CategoryCard {
  readonly category = input.required<Category>();
  readonly language = input.required<LanguageCode>();
  readonly name = computed(
    () => getTranslation(this.category().translations, this.language())?.name ?? '',
  );
}
