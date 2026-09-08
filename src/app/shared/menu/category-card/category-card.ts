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

    img {
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
