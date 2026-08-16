import { NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventType, entityType, entityId, entitySlug, source, metadata } = body;

    if (!eventType) {
      return NextResponse.json({ error: 'eventType is required.' }, { status: 400 });
    }

    const client = getServiceClient();
    if (client) {
      await client.from('analytics_events').insert({
        event_type: String(eventType).slice(0, 50),
        entity_type: entityType ? String(entityType).slice(0, 50) : null,
        entity_id: entityId ? String(entityId).slice(0, 50) : null,
        entity_slug: entitySlug ? String(entitySlug).slice(0, 100) : null,
        source: source ? String(source).slice(0, 50) : null,
        metadata: typeof metadata === 'object' ? metadata : {}
      });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to record analytics event.' }, { status: 500 });
  }
}
