import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getServiceClient } from '@/lib/supabase';

export async function GET() {
  try {
    await requireAdmin('admin', 'sales', 'editor');
    const client = getServiceClient();

    if (!client) {
      return NextResponse.json([
        {
          id: 'sig-1',
          entity_type: 'project',
          entity_name: 'Riverside Quarter Masterplan',
          signal_type: 'project_update',
          summary: 'Superstructure civil works milestone verified by municipal inspection.',
          confidence: 'verified',
          created_at: new Date().toISOString()
        },
        {
          id: 'sig-2',
          entity_type: 'company',
          entity_name: 'Erbașu Construcții',
          signal_type: 'company_update',
          summary: 'New infrastructure general contracting tender award identified.',
          confidence: 'high',
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ]);
    }

    const { data, error } = await client
      .from('market_activity_signals')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin('admin', 'editor');
    const body = await request.json();
    const { entity_type, entity_id, entity_name, signal_type, summary, source_url, confidence } = body;

    if (!entity_name || !signal_type || !summary) {
      return NextResponse.json({ error: 'entity_name, signal_type, and summary are required' }, { status: 400 });
    }

    const client = getServiceClient();
    if (!client) {
      return NextResponse.json({
        id: `mock-sig-${Date.now()}`,
        entity_type: entity_type || 'company',
        entity_name,
        signal_type,
        summary,
        confidence: confidence || 'verified',
        created_at: new Date().toISOString()
      }, { status: 201 });
    }

    const { data, error } = await client.from('market_activity_signals').insert({
      entity_type: entity_type || 'company',
      entity_id: entity_id || null,
      entity_name: entity_name.trim(),
      signal_type,
      summary: summary.trim(),
      source_url: source_url?.trim() || null,
      confidence: confidence || 'verified'
    }).select('*').single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unauthorized' }, { status: 401 });
  }
}
