import {NextResponse} from 'next/server';
import {requireAdmin} from '@/lib/admin-auth';
import {getServiceClient} from '@/lib/supabase';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const actor = await requireAdmin('admin', 'sales');
    const { id: leadId } = await params;
    const body = await request.json();
    const content = String(body.content || '').trim();

    if (!content) {
      return NextResponse.json({ error: 'Note content cannot be empty.' }, { status: 400 });
    }

    const client = getServiceClient();
    if (!client) return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 });

    const { data, error } = await client
      .from('lead_notes')
      .insert({
        lead_id: leadId,
        author_id: actor.id,
        author_name: actor.email || 'Sales Team',
        body: content
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    await client.from('audit_log').insert({
      actor_id: actor.id,
      action: 'lead_note_created',
      entity_type: 'lead',
      entity_id: leadId
    });

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const actor = await requireAdmin('admin', 'sales');
    const { id: leadId } = await params;
    const body = await request.json();
    const { noteId, content } = body;

    if (!noteId || !String(content || '').trim()) {
      return NextResponse.json({ error: 'Note ID and non-empty content required.' }, { status: 400 });
    }

    const client = getServiceClient();
    if (!client) return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 });

    const { data, error } = await client
      .from('lead_notes')
      .update({
        body: String(content).trim(),
        updated_at: new Date().toISOString()
      })
      .eq('id', noteId)
      .eq('lead_id', leadId)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    await client.from('audit_log').insert({
      actor_id: actor.id,
      action: 'lead_note_updated',
      entity_type: 'lead_notes',
      entity_id: noteId
    });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const actor = await requireAdmin('admin', 'sales');
    const { id: leadId } = await params;
    const { searchParams } = new URL(request.url);
    const noteId = searchParams.get('noteId');

    if (!noteId) return NextResponse.json({ error: 'Note ID is required.' }, { status: 400 });

    const client = getServiceClient();
    if (!client) return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 });

    const { error } = await client.from('lead_notes').delete().eq('id', noteId).eq('lead_id', leadId);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    await client.from('audit_log').insert({
      actor_id: actor.id,
      action: 'lead_note_deleted',
      entity_type: 'lead_notes',
      entity_id: noteId
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
  }
}
