/**
 * Anonymous session management for APTS E-Commerce.
 * Assigns a persistent random UUID per browser session.
 * No registration or authentication required.
 */

const SESSION_STORAGE_KEY = 'apts_ecommerce_session_id';

export function getSessionId(): string {
  let sessionId = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
  }
  return sessionId;
}
