export type CurrencyCode = 'GEL';

export interface Money {
  readonly amountMinor: number;
  readonly currency: CurrencyCode;
}
