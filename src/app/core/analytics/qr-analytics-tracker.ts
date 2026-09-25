import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { apiUrl } from '../http/api-endpoints';
import { LanguageService } from '../i18n/language.service';
import { QrAnalyticsEventType } from '../../shared/models/qr-analytics.model';

const restaurantId = 'panda-house';

@Service()
export class QrAnalyticsTracker {
  private readonly http = inject(HttpClient);
  private readonly language = inject(LanguageService);
  private readonly recorded = new Set<string>();

  track(type: QrAnalyticsEventType, categoryId?: string, dishId?: string): void {
    const key = `${type}:${categoryId ?? ''}:${dishId ?? ''}`;
    if (this.recorded.has(key)) return;
    this.recorded.add(key);
    void firstValueFrom(this.http.post<void>(apiUrl(`/api/restaurants/${restaurantId}/analytics/events`), {
      type,
      languageCode: this.language.currentLanguage(),
      ...(categoryId ? { categoryId } : {}),
      ...(dishId ? { dishId } : {}),
    })).catch(() => undefined);
  }
}