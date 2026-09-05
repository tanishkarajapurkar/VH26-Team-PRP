import { supabase, UserEvent } from '../db/supabase.js';

export class EventService {
  // Captures raw user behavior stream:
  // VIEW_PRODUCT, SEARCH, CLICK_PRODUCT, ADD_TO_CART, REMOVE_FROM_CART, WISHLIST, PURCHASE, CATEGORY_VIEW
  async track(event: UserEvent) {
    if (!event.userId) event.userId = 'user_101';
    if (!event.sessionId) event.sessionId = 'sess_' + Math.floor(Math.random() * 10000);
    event.createdAt = new Date().toISOString();
    return await supabase.recordEvent(event);
  }

  async getRecent(limit = 100) {
    return await supabase.getRecentEvents(limit);
  }
}

export const eventService = new EventService();
