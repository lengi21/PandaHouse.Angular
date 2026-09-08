import { computed, Service, signal } from '@angular/core';

@Service()
export class ActionLoaderService {
  private readonly pendingCount = signal(0);
  readonly isActive = computed(() => this.pendingCount() > 0);
  start(): void { this.pendingCount.update((count) => count + 1); }
  finish(): void { this.pendingCount.update((count) => Math.max(0, count - 1)); }
}
