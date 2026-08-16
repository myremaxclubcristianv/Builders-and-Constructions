import {NextResponse} from 'next/server';
import {requireAdmin} from '@/lib/admin-auth';
import {getServiceClient} from '@/lib/supabase';

const VALID_STAGES = [
  'planning',
  'permits',
  'foundation',
  'structure',
  'facade',
  'mep',
  'finishing',
  'delivered'
] as const;

const VALID_VERIFICATIONS = ['unknown', 'unverified', 'verified'] as const;

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const actor = await requireAdmin('admin', 'editor');
    const { id: projectId } = await params;
    const body = await request.json();

    const stage = String(body.stage || '').toLowerCase();
    const percentage = Number(body.percentage);
    const note = body.note ? String(body.note) : null;
    const progressDate = body.progressDate ? String(body.progressDate) : null;
    const imageUrl = body.imageUrl ? String(body.imageUrl) : null;
    const source = body.source ? String(body.source) : null;
    const verification = String(body.verification || 'unverified').toLowerCase();

    if (!VALID_STAGES.includes(stage as (typeof VALID_STAGES)[number])) {
      return NextResponse.json({ error: 'Invalid construction stage.' }, { status: 400 });
    }

    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      return NextResponse.json({ error: 'Percentage must be between 0 and 100.' }, { status: 400 });
    }

    const client = getServiceClient();
    if (!client) return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 });

    const insertPayload = {
      project_id: projectId,
      stage,
      percentage,
      note,
      progress_date: progressDate,
      image_url: imageUrl,
      source,
      verification: VALID_VERIFICATIONS.includes(verification as (typeof VALID_VERIFICATIONS)[number])
        ? verification
        : 'unverified',
      verified_at: verification === 'verified' ? new Date().toISOString() : null
    };

    const { data, error } = await client.from('project_progress').insert(insertPayload).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    // Optionally update current_progress_percent and current_stage on the project record if verified
    if (verification === 'verified') {
      await client.from('projects').update({
        current_progress_percent: percentage,
        current_stage: stage,
        updated_at: new Date().toISOString()
      }).eq('id', projectId);
    }

    await client.from('audit_log').insert({
      actor_id: actor.id,
      action: 'progress_created',
      entity_type: 'project',
      entity_id: projectId
    });

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const actor = await requireAdmin('admin', 'editor');
    const { id: projectId } = await params;
    const body = await request.json();
    const { progressId, stage, percentage, note, progressDate, imageUrl, source, verification } = body;

    if (!progressId) return NextResponse.json({ error: 'Progress ID required.' }, { status: 400 });

    const client = getServiceClient();
    if (!client) return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 });

    const updates: Record<string, unknown> = {};
    if (stage && VALID_STAGES.includes(stage.toLowerCase())) updates.stage = stage.toLowerCase();
    if (percentage !== undefined && !isNaN(Number(percentage))) updates.percentage = Number(percentage);
    if (note !== undefined) updates.note = note || null;
    if (progressDate !== undefined) updates.progress_date = progressDate || null;
    if (imageUrl !== undefined) updates.image_url = imageUrl || null;
    if (source !== undefined) updates.source = source || null;
    if (verification && VALID_VERIFICATIONS.includes(verification.toLowerCase())) {
      updates.verification = verification.toLowerCase();
      updates.verified_at = verification.toLowerCase() === 'verified' ? new Date().toISOString() : null;
    }

    const { data, error } = await client
      .from('project_progress')
      .update(updates)
      .eq('id', progressId)
      .eq('project_id', projectId)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    await client.from('audit_log').insert({
      actor_id: actor.id,
      action: 'progress_updated',
      entity_type: 'project_progress',
      entity_id: progressId
    });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const actor = await requireAdmin('admin', 'editor');
    const { id: projectId } = await params;
    const { searchParams } = new URL(request.url);
    const progressId = searchParams.get('progressId');

    if (!progressId) return NextResponse.json({ error: 'Progress ID is required.' }, { status: 400 });

    const client = getServiceClient();
    if (!client) return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 });

    const { error } = await client.from('project_progress').delete().eq('id', progressId).eq('project_id', projectId);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    await client.from('audit_log').insert({
      actor_id: actor.id,
      action: 'progress_deleted',
      entity_type: 'project_progress',
      entity_id: progressId
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
  }
}
