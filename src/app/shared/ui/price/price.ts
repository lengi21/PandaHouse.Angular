import { Component, computed, input } from '@angular/core';
import { LanguageCode } from '../../models/language.model';
import { Money } from '../../models/money.model';

const localeByLanguage: Record<string, string> = {
  ka: 'ka-GE',
  en: 'en-US',
  ru: 'ru-RU',
};

@Component({
  selector: 'app-price',
  template: '{{ formattedPrice() }}',
})
export class Price {
  readonly money = input.required<Money>();
  readonly language = input.required<LanguageCode>();
  readonly formattedPrice = computed(() => {
    const { amountMinor, currency } = this.money();
    const amount = new Intl.NumberFormat(localeByLanguage[this.language()] ?? 'en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    }).format(amountMinor / 100);
    return currency === 'GEL' ? `${amount} ₾` : amount;
  });
}
