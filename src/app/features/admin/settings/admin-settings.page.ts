import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { TextInput } from '../../../shared/ui/text-input/text-input';
import { RestaurantSettingsDraft } from '../../../shared/models/restaurant-settings.model';
import { Weekday } from '../../../shared/models/menu.model';
import { getTranslation } from '../../../shared/utils/get-translation';
import { RestaurantSettingsStore } from './restaurant-settings.store';
import { ImageUploadField } from '../../../shared/ui/image-upload-field/image-upload-field';

const languages = ['ka', 'en', 'ru'] as const;

@Component({
  selector: 'app-admin-settings-page',
  imports: [ImageUploadField, ReactiveFormsModule, TextInput, TranslatePipe],
  providers: [RestaurantSettingsStore],
  styles: `
    main { max-inline-size: 90rem; margin: 0 auto; padding: clamp(1rem, 3vw, 2.5rem); }
    .heading { display: flex; align-items: start; justify-content: space-between; gap: 1rem; margin-block-end: 1.3rem; }
    h1 { margin: 0; font-size: clamp(1.3rem, 2vw, 1.65rem); } .heading p { margin: .3rem 0 0; color: var(--color-muted-text); font-size: .78rem; }
    form { display: grid; gap: 1rem; } .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
    section { display: grid; gap: .85rem; padding: 1rem; border: 1px solid color-mix(in srgb, var(--color-text) 10%, transparent); border-radius: .85rem; background: var(--color-panel); }
    h2 { margin: 0; font-size: .95rem; } .translations, .hours { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .75rem; }
    .hour-row { display: grid; grid-template-columns: 5.5rem 1fr 1fr; gap: .55rem; align-items: end; }
    .hour-row > span { padding-block-end: .85rem; font-size: .75rem; font-weight: 700; }
    .save { justify-self: end; min-block-size: 2.6rem; padding: .5rem 1rem; border: 0; border-radius: .6rem; background: var(--color-primary); color: var(--color-on-image); font: inherit; font-size: .76rem; font-weight: 700; }
    .status { min-block-size: 1rem; margin: 0; color: #1a713d; font-size: .74rem; } .status.error { color: #b33131; }
    @media (max-width: 68rem) { .grid, .translations { grid-template-columns: 1fr; } } @media (max-width: 34rem) { .heading { align-items: stretch; flex-direction: column; } .save { justify-self: stretch; } }
  `,
  template: `
    <main>
      <div class="heading"><div><h1>{{ 'ADMIN.SETTINGS.TITLE' | translate }}</h1><p>{{ 'ADMIN.SETTINGS.DESCRIPTION' | translate }}</p></div><button class="save" type="submit" form="restaurant-settings" [disabled]="form.invalid || saving()">{{ (saving() ? 'ADMIN.SETTINGS.SAVING' : 'ADMIN.SETTINGS.SAVE') | translate }}</button></div>
      @if (store.loading() || !store.restaurant()) { <p>{{ 'COMMON.LOADING' | translate }}</p> } @else {
        <form id="restaurant-settings" [formGroup]="form" (ngSubmit)="save()">
          <div class="grid">
            <section><h2>{{ 'ADMIN.SETTINGS.IMAGES' | translate }}</h2><app-image-upload-field folder="restaurant" (uploaded)="form.controls.logoUrl.setValue($event.url)" /><app-text-input formControlName="logoUrl" [label]="'ADMIN.SETTINGS.LOGO_URL' | translate" name="logoUrl" type="text" /><app-image-upload-field folder="restaurant" (uploaded)="form.controls.coverImageUrl.setValue($event.url)" /><app-text-input formControlName="coverImageUrl" [label]="'ADMIN.SETTINGS.COVER_URL' | translate" name="coverImageUrl" type="text" /></section>
            <section><h2>{{ 'ADMIN.SETTINGS.CONTACT' | translate }}</h2><app-text-input formControlName="address" [label]="'ADMIN.SETTINGS.ADDRESS' | translate" name="address" type="text" [required]="true" /><app-text-input formControlName="phone" [label]="'ADMIN.SETTINGS.PHONE' | translate" name="phone" type="text" [required]="true" /><app-text-input formControlName="facebook" [label]="'ADMIN.SETTINGS.FACEBOOK' | translate" name="facebook" type="text" /><app-text-input formControlName="instagram" [label]="'ADMIN.SETTINGS.INSTAGRAM' | translate" name="instagram" type="text" /></section>
          </div>
          <section formGroupName="translations"><h2>{{ 'ADMIN.SETTINGS.NAMES' | translate }}</h2><div class="translations"><app-text-input formControlName="ka" [label]="'ADMIN.CATEGORIES.GEORGIAN' | translate" name="restaurantKa" type="text" [required]="true" /><app-text-input formControlName="en" [label]="'ADMIN.CATEGORIES.ENGLISH' | translate" name="restaurantEn" type="text" [required]="true" /><app-text-input formControlName="ru" [label]="'ADMIN.CATEGORIES.RUSSIAN' | translate" name="restaurantRu" type="text" [required]="true" /></div></section>
          <section formGroupName="hours"><h2>{{ 'ADMIN.SETTINGS.HOURS' | translate }}</h2><div class="hours">@for (day of days; track day) { <div class="hour-row" [formGroupName]="day"><span>{{ ('CUSTOMER.INFO.DAYS.' + day.toUpperCase()) | translate }}</span><app-text-input formControlName="opensAt" [label]="'ADMIN.SETTINGS.OPENS' | translate" [name]="day + 'Open'" type="text" /><app-text-input formControlName="closesAt" [label]="'ADMIN.SETTINGS.CLOSES' | translate" [name]="day + 'Close'" type="text" /></div> }</div></section>
          <p class="status" [class.error]="saveFailed()" aria-live="polite">@if (saved()) { {{ 'ADMIN.SETTINGS.SAVED' | translate }} } @if (saveFailed()) { {{ 'ADMIN.SETTINGS.SAVE_ERROR' | translate }} }</p>
        </form>
      }
    </main>
  `,
})
export class AdminSettingsPage {
  protected readonly store = inject(RestaurantSettingsStore);
  private readonly formBuilder = inject(FormBuilder);
  protected readonly saving = signal(false); protected readonly saved = signal(false); protected readonly saveFailed = signal(false);
  protected readonly days: readonly Weekday[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  protected readonly form = this.formBuilder.nonNullable.group({
    logoUrl: '', coverImageUrl: '', address: ['', Validators.required], phone: ['', Validators.required], facebook: '', instagram: '',
    translations: this.formBuilder.nonNullable.group({ ka: ['', Validators.required], en: ['', Validators.required], ru: ['', Validators.required] }),
    hours: this.formBuilder.nonNullable.group({
      monday: this.hourGroup(), tuesday: this.hourGroup(), wednesday: this.hourGroup(), thursday: this.hourGroup(), friday: this.hourGroup(), saturday: this.hourGroup(), sunday: this.hourGroup(),
    }),
  });

  constructor() {
    this.store.load();
    effect(() => {
      const restaurant = this.store.restaurant(); if (!restaurant) return;
      const social = (platform: 'facebook' | 'instagram') => restaurant.socialLinks.find((link) => link.platform === platform)?.url ?? '';
      const hour = (day: Weekday) => restaurant.openingHours.find((item) => item.day === day);
      this.form.reset({ logoUrl: restaurant.logo?.url ?? '', coverImageUrl: restaurant.coverImage?.url ?? '', address: restaurant.address, phone: restaurant.phone, facebook: social('facebook'), instagram: social('instagram'), translations: { ka: getTranslation(restaurant.translations, 'ka')?.name ?? '', en: getTranslation(restaurant.translations, 'en')?.name ?? '', ru: getTranslation(restaurant.translations, 'ru')?.name ?? '' }, hours: { monday: { opensAt: hour('monday')?.opensAt ?? '', closesAt: hour('monday')?.closesAt ?? '' }, tuesday: { opensAt: hour('tuesday')?.opensAt ?? '', closesAt: hour('tuesday')?.closesAt ?? '' }, wednesday: { opensAt: hour('wednesday')?.opensAt ?? '', closesAt: hour('wednesday')?.closesAt ?? '' }, thursday: { opensAt: hour('thursday')?.opensAt ?? '', closesAt: hour('thursday')?.closesAt ?? '' }, friday: { opensAt: hour('friday')?.opensAt ?? '', closesAt: hour('friday')?.closesAt ?? '' }, saturday: { opensAt: hour('saturday')?.opensAt ?? '', closesAt: hour('saturday')?.closesAt ?? '' }, sunday: { opensAt: hour('sunday')?.opensAt ?? '', closesAt: hour('sunday')?.closesAt ?? '' } } });
    });
  }

  protected save(): void {
    if (this.form.invalid || this.saving()) return; const value = this.form.getRawValue(); const current = this.store.restaurant(); if (!current) return;
    this.saving.set(true); this.saved.set(false); this.saveFailed.set(false);
    const draft: RestaurantSettingsDraft = { logoUrl: value.logoUrl, coverImageUrl: value.coverImageUrl, address: value.address, phone: value.phone, socialLinks: [{ platform: 'facebook', url: value.facebook }, { platform: 'instagram', url: value.instagram }], openingHours: this.days.map((day) => ({ day, ...value.hours[day] })), translations: languages.map((languageCode) => ({ languageCode, name: value.translations[languageCode], description: getTranslation(current.translations, languageCode)?.description ?? '' })) };
    void this.store.save(draft).then(() => this.saved.set(true)).catch(() => this.saveFailed.set(true)).finally(() => this.saving.set(false));
  }

  private hourGroup() { return this.formBuilder.nonNullable.group({ opensAt: '', closesAt: '' }); }
}
