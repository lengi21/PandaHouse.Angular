import { inject, Service } from '@angular/core';
import { ActionLoaderService } from '../feedback/action-loader.service';
import { ToastService } from '../feedback/toast.service';

interface RequestOptions {
  readonly action?: boolean;
  readonly successKey?: string;
  readonly failureKey?: string;
}

@Service()
export class RequestExecutor {
  private readonly loader = inject(ActionLoaderService);
  private readonly toasts = inject(ToastService);

  async run<T>(operation: () => Promise<T>, options: RequestOptions = {}): Promise<T> {
    if (options.action) this.loader.start();
    try {
      let lastError: unknown;
      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          const result = await operation();
          if (options.successKey) this.toasts.show('success', options.successKey);
          return result;
        } catch (error) {
          lastError = error;
          if (attempt < 2) {
            this.toasts.show('info', 'ADMIN.FEEDBACK.RETRYING');
            await new Promise<void>((resolve) => window.setTimeout(resolve, 350 * (attempt + 1)));
          }
        }
      }
      this.toasts.show('error', options.failureKey ?? 'ADMIN.FEEDBACK.REQUEST_FAILED');
      throw lastError;
    } finally {
      if (options.action) this.loader.finish();
    }
  }
}
