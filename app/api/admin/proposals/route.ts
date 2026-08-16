import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getServiceClient } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    await requireAdmin('admin', 'sales');
    const body = await request.json();
    const { company_id, title, services, objectives, scope, estimated_value, notes, status } = body;

    if (!company_id || !title) {
      return NextResponse.json({ error: 'Company ID and Title are required.' }, { status: 400 });
    }

    const client = getServiceClient();
    if (!client) {
      return NextResponse.json({
        id: `mock-prop-${Date.now()}`,
        company_id,
        title,
        status: status || 'draft',
        services: services || [],
        objectives: objectives || null,
        scope: scope || null,
        estimated_value: estimated_value || null,
        notes: notes || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { status: 201 });
    }

    const { data, error } = await client
      .from('proposals')
      .insert({
        company_id,
        title: title.trim(),
        status: status || 'draft',
        services: services || [],
        objectives: objectives?.trim() || null,
        scope: scope?.trim() || null,
        estimated_value: estimated_value ? Number(estimated_value) : null,
        notes: notes?.trim() || null
      })
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log sales activity
    await client.from('sales_activities').insert({
      company_id,
      activity_type: 'proposal',
      summary: `Proposal created: "${title}"`,
      details: `Status: ${status || 'draft'}. Scope: ${scope || 'Standard digital engagement'}.`,
      author_name: 'Sales Team'
    });

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unauthorized' }, { status: 401 });
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin('admin', 'sales');
    const body = await request.json();
    const { id, title, services, objectives, scope, estimated_value, notes, status } = body;

    if (!id) {
      return NextResponse.json({ error: 'Proposal ID is required.' }, { status: 400 });
    }

    const client = getServiceClient();
    if (!client) {
      return NextResponse.json({ ok: true, id, ...body });
    }

    const updatePayload: Record<string, any> = { updated_at: new Date().toISOString() };
    if (title !== undefined) updatePayload.title = title;
    if (services !== undefined) updatePayload.services = services;
    if (objectives !== undefined) updatePayload.objectives = objectives;
    if (scope !== undefined) updatePayload.scope = scope;
    if (estimated_value !== undefined) updatePayload.estimated_value = estimated_value ? Number(estimated_value) : null;
    if (notes !== undefined) updatePayload.notes = notes;
    if (status !== undefined) updatePayload.status = status;

    const { data, error } = await client
      .from('proposals')
      .update(updatePayload)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unauthorized' }, { status: 401 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin('admin', 'sales');
    const { searchParams } = new URL(request.url);
    const proposalId = searchParams.get('id');

    if (!proposalId) {
      return NextResponse.json({ error: 'Proposal ID is required' }, { status: 400 });
    }

    const client = getServiceClient();
    if (client) {
      await client.from('proposals').delete().eq('id', proposalId);
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unauthorized' }, { status: 401 });
  }
}
