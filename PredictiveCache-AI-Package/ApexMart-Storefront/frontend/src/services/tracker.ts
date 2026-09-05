/**
 * ============================================================================
 * ApexMart Telemetry & Event Tracking Service
 * ============================================================================
 * Collects raw user behavior stream and dispatches it to the Fastify backend
 * (which persists it into Supabase `user_events` table).
 *
 * This provides the behavioral training dataset for the pluggable AI engine
 * without requiring any AI logic in Website 1!
 * ============================================================================
 */

function getSessionId(): string {
  let sid = sessionStorage.getItem('apex_session_id');
  if (!sid) {
    sid = 'sess_' + Math.random().toString(36).substring(2, 10);
    sessionStorage.setItem('apex_session_id', sid);
  }
  return sid;
}

export const tracker = {
  track(eventType: string, details: { productId?: number; query?: string; metadata?: any } = {}) {
    const payload = {
      userId: 'user_101',
      sessionId: getSessionId(),
      eventType,
      productId: details.productId,
      query: details.query,
      metadata: details.metadata || {}
    };

    // Fire and forget, completely non-blocking
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(() => {
      // Ignore background telemetry errors
    });
  },

  trackViewProduct(productId: number, title?: string) {
    this.track('VIEW_PRODUCT', { productId, metadata: { title } });
  },

  trackSearch(query: string) {
    this.track('SEARCH', { query });
  },

  trackAddToCart(productId: number, quantity = 1) {
    this.track('ADD_TO_CART', { productId, metadata: { quantity } });
  },

  trackRemoveFromCart(productId: number) {
    this.track('REMOVE_FROM_CART', { productId });
  },

  trackWishlist(productId: number) {
    this.track('WISHLIST', { productId });
  },

  trackPurchase(orderId: string, totalAmount: number, itemsCount: number) {
    this.track('PURCHASE', { metadata: { orderId, totalAmount, itemsCount } });
  },

  trackCategoryView(category: string) {
    this.track('CATEGORY_VIEW', { metadata: { category } });
  }
};
