import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getServiceClient } from '@/lib/supabase';
import { adminLogAuditEvent } from '@/lib/admin-data';

export async function GET(request: Request) {
  try {
    await requireAdmin('admin');
    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get('entityType');
    const entityId = searchParams.get('entityId');

    const client = getServiceClient();
    if (!client) return NextResponse.json([]);

    let q = client.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(100);
    if (entityType) q = q.eq('entity_type', entityType);
    if (entityId) q = q.eq('entity_id', entityId);

    const { data, error } = await q;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin('admin', 'sales', 'editor');
    const body = await request.json();
    const { action, entity_type, entity_id, metadata } = body;

    const result = await adminLogAuditEvent({
      actor: admin.email,
      actorRole: admin.role,
      action,
      entityType: entity_type,
      entityId: entity_id,
      metadata
    });

    return NextResponse.json(result || { ok: true }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unauthorized' }, { status: 401 });
  }
}
