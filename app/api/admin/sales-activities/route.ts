import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getServiceClient } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin('admin', 'sales');
    const body = await request.json();
    const { company_id, activity_type, summary, details, activity_date } = body;

    if (!company_id || !summary) {
      return NextResponse.json({ error: 'Company ID and summary are required.' }, { status: 400 });
    }

    const client = getServiceClient();
    if (!client) {
      return NextResponse.json({
        id: `mock-${Date.now()}`,
        company_id,
        activity_type: activity_type || 'note',
        summary,
        details: details || null,
        activity_date: activity_date || new Date().toISOString(),
        author_name: admin.email || 'Sales User',
        created_at: new Date().toISOString()
      }, { status: 201 });
    }

    const { data, error } = await client
      .from('sales_activities')
      .insert({
        company_id,
        activity_type: activity_type || 'note',
        summary: summary.trim(),
        details: details?.trim() || null,
        activity_date: activity_date || new Date().toISOString(),
        author_id: admin.id || null,
        author_name: admin.email || 'Sales Team'
      })
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unauthorized' }, { status: 401 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin('admin', 'sales');
    const { searchParams } = new URL(request.url);
    const activityId = searchParams.get('id');

    if (!activityId) {
      return NextResponse.json({ error: 'Activity ID is required' }, { status: 400 });
    }

    const client = getServiceClient();
    if (client) {
      await client.from('sales_activities').delete().eq('id', activityId);
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unauthorized' }, { status: 401 });
  }
}
