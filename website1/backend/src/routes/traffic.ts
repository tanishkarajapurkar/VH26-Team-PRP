import { Router, Request, Response } from 'express';
import { db } from '../database/db.js';

export const trafficRoutes = Router();

// In-memory activity state
let lastRealUserActivity = Date.now();
const activeSessions = new Set<string>();

export function markUserActivity(sessionId?: string) {
  lastRealUserActivity = Date.now();
  if (sessionId) {
    activeSessions.add(sessionId);
    // Keep set bounded
    if (activeSessions.size > 100) {
      activeSessions.clear();
    }
  }
}

// GET /api/v1/traffic/activity
// Polled by the standalone traffic simulator to dynamically scale workload
trafficRoutes.get('/activity', (_req: Request, res: Response) => {
  const now = Date.now();
  const secondsSinceActivity = Math.floor((now - lastRealUserActivity) / 1000);

  // Determine suggested simulator mode based on idle time
  let recommendedMode: 'LOW' | 'NORMAL' | 'HIGH' | 'SURGE';
  if (secondsSinceActivity < 120) {
    // Real human actively browsing: Keep simulation LOW
    recommendedMode = 'LOW';
  } else if (secondsSinceActivity < 300) {
    // Inactive for 2-5 minutes: Increase simulation to NORMAL
    recommendedMode = 'NORMAL';
  } else if (secondsSinceActivity < 600) {
    // Inactive for 5-10 minutes: Ramp up to HIGH workload
    recommendedMode = 'HIGH';
  } else {
    // Inactive for > 10 minutes: SURGE mode
    recommendedMode = 'SURGE';
  }

  res.json({
    lastUserActivity: lastRealUserActivity,
    secondsSinceActivity,
    recommendedMode,
    activeSessionsCount: activeSessions.size
  });
});

// POST /api/v1/traffic/events
trafficRoutes.post('/events', async (req: Request, res: Response) => {
  try {
    const {
      endpoint,
      method,
      status_code,
      response_time,
      source,
      scenario,
      session_id,
      product_id
    } = req.body;

    if (!endpoint || !method) {
      return res.status(400).json({ error: 'endpoint and method are required' });
    }

    await db.recordTrafficEvent({
      endpoint,
      method,
      status_code: status_code || 200,
      response_time: response_time || 10,
      source: source || 'simulator',
      scenario,
      session_id,
      product_id
    });

    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

// GET /api/v1/traffic/stats
trafficRoutes.get('/stats', (_req: Request, res: Response) => {
  res.json(db.getTrafficStats());
});
