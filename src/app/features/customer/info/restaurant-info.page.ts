import { Component, computed, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIcon } from '@angular/material/icon';
import { LanguageService } from '../../../core/i18n/language.service';
import { CustomerMenuStore } from '../menu/customer-menu.store';
import { RestaurantTranslation } from '../../../shared/models/menu.model';
import { getTranslation } from '../../../shared/utils/get-translation';
import { AppImage } from '../../../shared/ui/app-image/app-image';

@Component({
  selector: 'app-restaurant-info-page',
  imports: [AppImage, MatIcon, TranslatePipe],
  styles: `
    main {
      max-inline-size: 36rem;
      margin: 0 auto;
      padding: 0.85rem 1rem calc(var(--customer-navigation-height) + 1.75rem);
      color: var(--color-text);
    }
    .status {
      color: var(--color-muted-text);
    }
    .cover {
      overflow: hidden;
      min-block-size: 12rem;
      border-radius: 1.25rem 1.25rem 0 0;
      background: var(--color-surface);
    }
    .cover app-image {
      inline-size: 100%;
      block-size: 12rem;
      object-fit: cover;
    }
    .panel {
      padding: 1.15rem;
      border-radius: 1.25rem;
      background: var(--color-panel);
    }
    h1,
    h2,
    p {
      margin: 0;
    }
    h1 {
      font-size: 1.3rem;
    }
    .description {
      margin-block-start: 0.5rem 1.25rem;
      color: var(--color-muted-text);
      line-height: 1.55;
    }
    .details {
      display: grid;
      gap: 0.75rem;
    }
    .detail {
      display: grid;
      grid-template-columns: 2rem minmax(0, 1fr);
      gap: 0.7rem;
      align-items: start;
      padding: 0.85rem 0;
      border-top: 1px solid color-mix(in srgb, var(--color-text) 12%, transparent);
    }
    .icon {
      display: grid;
      inline-size: 2rem;
      block-size: 2rem;
      place-items: center;
      border-radius: 50%;
      background: color-mix(in srgb, var(--color-primary) 12%, transparent);
      color: var(--color-primary);
    }
    .icon mat-icon {
      inline-size: 1.05rem;
      block-size: 1.05rem;
      font-size: 1.05rem;
    }
    h2 {
      font-size: 0.92rem;
    }
    .detail p,
    .detail a {
      margin-block-start: 0.28rem;
      color: var(--color-muted-text);
      font-size: 0.82rem;
      line-height: 1.45;
    }
    .detail a {
      color: var(--color-text);
    }
    .hours {
      display: grid;
      gap: 0.3rem;
      margin-block-start: 0.45rem;
    }
    .hours div {
      display: flex;
      justify-content: space-between;
      gap: 0.75rem;
      color: var(--color-muted-text);
      font-size: 0.78rem;
    }
    .socials {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-block-start: 0.65rem;
    }
    .socials a {
      margin: 0;
      border: 1px solid color-mix(in srgb, var(--color-text) 14%, transparent);
      border-radius: 999px;
      padding: 0.45rem 0.7rem;
      color: var(--color-text);
      font-size: 0.78rem;
      font-weight: 700;
      text-decoration: none;
    }
  `,
  template: `
    <main>
      @if (menuStore.isLoading()) {
        <p class="status" role="status">{{ 'COMMON.LOADING' | translate }}</p>
      } @else if (restaurant(); as restaurant) {
        <section>
          @if (restaurant.coverImage; as image) {
            <div class="cover">
              <app-image
                [alt]="restaurantName()"
                [height]="image.height"
                loading="eager"
                [src]="image.url"
                [width]="image.width"
              />
            </div>
          }
          <div class="panel">
            <h1>{{ restaurantName() }}</h1>
            <p class="description">{{ restaurantDescription() }}</p>
            <div class="details">
              <section class="detail">
                <span aria-hidden="true" class="icon"><mat-icon>schedule</mat-icon></span>
                <div>
                  <h2>{{ 'CUSTOMER.INFO.HOURS' | translate }}</h2>
                  <div class="hours">
                    @for (hours of restaurant.openingHours; track hours.day) {
                      <div>
                        <span>{{
                          'CUSTOMER.INFO.DAYS.' + hours.day.toUpperCase() | translate
                        }}</span
                        ><span>{{ hours.opensAt }} – {{ hours.closesAt }}</span>
                      </div>
                    }
                  </div>
                </div>
              </section>
              <section class="detail">
                <span aria-hidden="true" class="icon"><mat-icon>location_on</mat-icon></span>
                <div>
                  <h2>{{ 'CUSTOMER.INFO.LOCATION' | translate }}</h2>
                  <p>{{ restaurant.address }}</p>
                </div>
              </section>
              <section class="detail">
                <span aria-hidden="true" class="icon"><mat-icon>call</mat-icon></span>
                <div>
                  <h2>{{ 'CUSTOMER.INFO.CONTACT' | translate }}</h2>
                  <a [href]="'tel:' + restaurant.phone.replaceAll(' ', '')">{{
                    restaurant.phone
                  }}</a>
                  <div class="socials">
                    @for (socialLink of restaurant.socialLinks; track socialLink.platform) {
                      <a [href]="socialLink.url" rel="noopener noreferrer" target="_blank">{{
                        socialLink.platform
                      }}</a>
                    }
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>
      }
    </main>
  `,
})
export class RestaurantInfoPage {
  protected readonly menuStore = inject(CustomerMenuStore);
  private readonly languageService = inject(LanguageService);
  protected readonly restaurant = this.menuStore.restaurant;
  protected readonly restaurantName = computed(() => this.translation()?.name ?? 'Panda House');
  protected readonly restaurantDescription = computed(() => this.translation()?.description ?? '');

  private readonly translation = computed<RestaurantTranslation | null>(
    () =>
      getTranslation(
        this.restaurant()?.translations ?? [],
        this.languageService.currentLanguage(),
      ) ?? null,
  );
}
