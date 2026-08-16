import { getServiceClient } from '@/lib/supabase';

export type AnalyticsEventPayload = {
  eventType: string;
  entityType?: string;
  entityId?: string;
  entitySlug?: string;
  source?: string;
  metadata?: Record<string, unknown>;
};

export async function logServerAnalytics(event: AnalyticsEventPayload) {
  try {
    const client = getServiceClient();
    if (!client) return;
    await client.from('analytics_events').insert({
      event_type: event.eventType,
      entity_type: event.entityType || null,
      entity_id: event.entityId || null,
      entity_slug: event.entitySlug || null,
      source: event.source || null,
      metadata: event.metadata || {}
    });
  } catch (err) {
    // Non-blocking telemetry
    console.error('Analytics event insert failed:', err);
  }
}

export function logClientAnalytics(event: AnalyticsEventPayload) {
  if (typeof window === 'undefined') return;
  try {
    fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
      keepalive: true
    }).catch(() => {});
  } catch {
    // Silent fail
  }
}
