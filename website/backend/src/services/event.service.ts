import { db } from '../db/client.js';
import { UserEvent } from '../db/types.js';

/**
 * ============================================================================
 * EVENT SERVICE (User Behavior Tracking)
 * ============================================================================
 * Captures user telemetry into `user_events` in Supabase:
 *   - VIEW_PRODUCT
 *   - SEARCH
 *   - CLICK_PRODUCT
 *   - ADD_TO_CART
 *   - REMOVE_FROM_CART
 *   - WISHLIST
 *   - PURCHASE
 *   - CATEGORY_VIEW
 *
 * Stores raw events now; future AI Engine / Analytics consume this stream directly.
 * ============================================================================
 */
export class EventService {
  async trackEvent(event: UserEvent): Promise<UserEvent> {
    if (!event.user_id) {
      event.user_id = 'user_guest';
    }
    return db.recordEvent(event);
  }

  async getRecentEvents(limit = 50): Promise<UserEvent[]> {
    return db.getUserEvents(limit);
  }
}

export const eventService = new EventService();
