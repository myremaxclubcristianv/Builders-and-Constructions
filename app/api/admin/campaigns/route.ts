import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getServiceClient } from '@/lib/supabase';

export async function GET() {
  try {
    await requireAdmin('admin', 'sales');
    const client = getServiceClient();
    if (!client) {
      return NextResponse.json([
        {
          id: 'camp-1',
          name: 'Romania Construction Companies — No Website',
          description: 'Targeting general contractors and construction firms with high project activity and missing web presence.',
          target_type: 'Construction Company',
          target_criteria: { no_website: true },
          target_country: 'Romania',
          created_at: new Date().toISOString()
        },
        {
          id: 'camp-2',
          name: 'Bucharest Developers — Weak Project Presentation',
          description: 'Residential & mixed-use developers in Bucharest lacking dedicated project microsites and video progress.',
          target_type: 'Developer',
          target_city: 'Bucharest',
          target_criteria: { weak_project_presentation: true },
          target_country: 'Romania',
          created_at: new Date().toISOString()
        }
      ]);
    }

    const { data, error } = await client
      .from('target_campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin('admin', 'sales');
    const body = await request.json();
    const { name, description, target_type, target_criteria, target_city, target_country } = body;

    if (!name) return NextResponse.json({ error: 'Campaign name is required' }, { status: 400 });

    const client = getServiceClient();
    if (!client) {
      return NextResponse.json({
        id: `mock-camp-${Date.now()}`,
        name,
        description: description || null,
        target_type: target_type || null,
        target_criteria: target_criteria || {},
        target_city: target_city || null,
        target_country: target_country || 'Romania',
        created_at: new Date().toISOString()
      }, { status: 201 });
    }

    const { data, error } = await client
      .from('target_campaigns')
      .insert({
        name: name.trim(),
        description: description?.trim() || null,
        target_type: target_type || null,
        target_criteria: target_criteria || {},
        target_city: target_city?.trim() || null,
        target_country: target_country || 'Romania'
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
    await requireAdmin('admin', 'sales');
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Campaign ID is required' }, { status: 400 });

    const client = getServiceClient();
    if (client) {
      await client.from('target_campaigns').delete().eq('id', id);
    }
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unauthorized' }, { status: 401 });
  }
}
