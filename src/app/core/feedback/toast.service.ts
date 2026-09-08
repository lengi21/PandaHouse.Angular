import { Service, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  readonly id: number;
  readonly type: ToastType;
  readonly messageKey: string;
}

@Service()
export class ToastService {
  private readonly toastList = signal<readonly ToastMessage[]>([]);
  readonly toasts = this.toastList.asReadonly();
  private nextId = 0;

  show(type: ToastType, messageKey: string): void {
    const toast = { id: ++this.nextId, type, messageKey };
    this.toastList.update((items) => [...items, toast]);
    window.setTimeout(() => this.dismiss(toast.id), type === 'error' ? 6000 : 3800);
  }

  dismiss(id: number): void { this.toastList.update((items) => items.filter((toast) => toast.id !== id)); }
}
