import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { RestaurantId } from '../../shared/models/menu.model';

/**
 * Maintains a single server-to-browser stream for a guest menu. EventSource
 * reconnects automatically, so the browser only fetches catalog data when the
 * server reports that the catalog actually changed.
 */
@Injectable({ providedIn: 'root' })
export class QrCatalogEventsService {
  connect(restaurantId: RestaurantId, onCatalogChanged: () => void): () => void {
    if (typeof EventSource === 'undefined') {
      return () => undefined;
    }

    const origin = environment.qrCatalogEventsOrigin.replace(/\/$/, '');
    const source = new EventSource(`${origin}/api/qr-menu/${encodeURIComponent(restaurantId)}/events`);
    source.addEventListener('catalog-changed', onCatalogChanged);
    // A reconnect can have missed an event, so refresh once after it opens.
    source.addEventListener('open', onCatalogChanged);
    return () => source.close();
  }
}
