import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getServiceClient } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get('entityType');
    const entityId = searchParams.get('entityId');

    if (!entityType || !entityId) {
      return NextResponse.json({ error: 'entityType and entityId are required' }, { status: 400 });
    }

    const client = getServiceClient();
    if (!client) return NextResponse.json([]);

    const { data, error } = await client
      .from('entity_sources')
      .select('*')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error fetching sources' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin('admin', 'editor', 'sales');
    const body = await request.json();
    const { entity_type, entity_id, source_url, source_title, source_type, source_tier, verification_status, notes } = body;

    if (!entity_type || !entity_id || !source_url || !source_title) {
      return NextResponse.json({ error: 'entity_type, entity_id, source_url, and source_title are required.' }, { status: 400 });
    }

    const client = getServiceClient();
    if (!client) {
      return NextResponse.json({
        id: `mock-src-${Date.now()}`,
        entity_type,
        entity_id,
        source_url,
        source_title,
        source_type: source_type || 'OFFICIAL_WEBSITE',
        source_tier: source_tier || 'primary',
        verification_status: verification_status || 'verified',
        notes: notes || null,
        created_at: new Date().toISOString()
      }, { status: 201 });
    }

    const { data, error } = await client
      .from('entity_sources')
      .insert({
        entity_type,
        entity_id,
        source_url: source_url.trim(),
        source_title: source_title.trim(),
        source_type: source_type || 'OFFICIAL_WEBSITE',
        source_tier: source_tier || 'primary',
        verification_status: verification_status || 'verified',
        notes: notes?.trim() || null
      })
      .select('*')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unauthorized' }, { status: 401 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin('admin', 'editor');
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Source ID is required' }, { status: 400 });

    const client = getServiceClient();
    if (client) {
      await client.from('entity_sources').delete().eq('id', id);
    }
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unauthorized' }, { status: 401 });
  }
}
