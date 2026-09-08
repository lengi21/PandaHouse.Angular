import { computed, effect, inject, signal } from '@angular/core';
import { Service } from '@angular/core';
import { LocalStorageService } from '../../../core/storage/local-storage.service';
import { Dish, DishId } from '../../../shared/models/menu.model';
import { Money } from '../../../shared/models/money.model';
import { CustomerMenuStore } from '../menu/customer-menu.store';

interface CartEntry {
  readonly dishId: DishId;
  readonly quantity: number;
}

export interface CartLine {
  readonly dish: Dish;
  readonly quantity: number;
}

const cartStorageKey = 'panda-house.cart';

@Service()
export class CartStore {
  private readonly menuStore = inject(CustomerMenuStore);
  private readonly storage = inject(LocalStorageService);
  private readonly entries = signal<readonly CartEntry[]>(this.restoreEntries());

  readonly lines = computed<readonly CartLine[]>(() => {
    const dishes = this.menuStore.categories().flatMap(({ dishes: categoryDishes }) => categoryDishes);
    return this.entries()
      .map((entry) => {
        const dish = dishes.find(({ id }) => id === entry.dishId);
        return dish ? { dish, quantity: entry.quantity } : null;
      })
      .filter((line): line is CartLine => line !== null);
  });
  readonly itemCount = computed(() => this.entries().reduce((total, entry) => total + entry.quantity, 0));
  readonly total = computed<Money>(() => ({
    amountMinor: this.lines().reduce(
      (total, { dish, quantity }) => total + dish.price.amountMinor * quantity,
      0,
    ),
    currency: 'GEL',
  }));

  constructor() {
    effect(() => this.storage.set(cartStorageKey, JSON.stringify(this.entries())));
  }

  quantityFor(dishId: DishId): number {
    return this.entries().find((entry) => entry.dishId === dishId)?.quantity ?? 0;
  }

  add(dishId: DishId): void {
    if (this.quantityFor(dishId) === 0) {
      this.entries.update((entries) => [...entries, { dishId, quantity: 1 }]);
    }
  }

  increment(dishId: DishId): void {
    this.entries.update((entries) =>
      entries.map((entry) =>
        entry.dishId === dishId ? { ...entry, quantity: entry.quantity + 1 } : entry,
      ),
    );
  }

  decrement(dishId: DishId): void {
    this.entries.update((entries) =>
      entries.flatMap((entry) => {
        if (entry.dishId !== dishId) {
          return entry;
        }

        return entry.quantity > 1 ? [{ ...entry, quantity: entry.quantity - 1 }] : [];
      }),
    );
  }

  remove(dishId: DishId): void {
    this.entries.update((entries) => entries.filter((entry) => entry.dishId !== dishId));
  }

  private restoreEntries(): readonly CartEntry[] {
    const rawEntries = this.storage.get(cartStorageKey);

    if (!rawEntries) {
      return [];
    }

    try {
      const parsedEntries: unknown = JSON.parse(rawEntries);
      return Array.isArray(parsedEntries)
        ? parsedEntries.filter(isCartEntry)
        : [];
    } catch {
      return [];
    }
  }
}

function isCartEntry(value: unknown): value is CartEntry {
  return (
    typeof value === 'object' &&
    value !== null &&
    'dishId' in value &&
    'quantity' in value &&
    typeof value.dishId === 'string' &&
    typeof value.quantity === 'number' &&
    Number.isInteger(value.quantity) &&
    value.quantity > 0
  );
}
