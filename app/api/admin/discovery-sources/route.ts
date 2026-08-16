import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getServiceClient } from '@/lib/supabase';

export async function GET() {
  try {
    await requireAdmin('admin', 'editor');
    const client = getServiceClient();

    if (!client) {
      return NextResponse.json([
        {
          id: 'src-1',
          name: 'Bucharest City Hall Urbanism Register',
          url: 'https://pmb.ro/urbanism',
          type: 'GOVERNMENT_REGISTRY',
          country: 'Romania',
          coverage: 'Bucharest (Sector 1-6)',
          status: 'active',
          last_checked_at: new Date().toISOString(),
          notes: 'Public construction & building permits database.'
        },
        {
          id: 'src-2',
          name: 'SEAP / SICAP Public Procurement Portal',
          url: 'https://e-licitatie.ro',
          type: 'PUBLIC_PROCUREMENT',
          country: 'Romania',
          coverage: 'National',
          status: 'active',
          last_checked_at: new Date().toISOString(),
          notes: 'Official infrastructure and public civil engineering contracts.'
        }
      ]);
    }

    const { data, error } = await client.from('discovery_sources').select('*').order('created_at', { ascending: false });
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
    const { name, url, type, country, coverage, notes } = body;

    if (!name || !url) return NextResponse.json({ error: 'Source name and URL are required' }, { status: 400 });

    const client = getServiceClient();
    if (!client) {
      return NextResponse.json({
        id: `mock-src-${Date.now()}`,
        name,
        url,
        type: type || 'OFFICIAL_WEBSITE',
        country: country || 'Romania',
        coverage: coverage || null,
        status: 'active',
        last_checked_at: new Date().toISOString(),
        notes: notes || null,
        created_at: new Date().toISOString()
      }, { status: 201 });
    }

    const { data, error } = await client.from('discovery_sources').insert({
      name: name.trim(),
      url: url.trim(),
      type: type || 'OFFICIAL_WEBSITE',
      country: country || 'Romania',
      coverage: coverage?.trim() || null,
      notes: notes?.trim() || null,
      status: 'active',
      last_checked_at: new Date().toISOString()
    }).select('*').single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unauthorized' }, { status: 401 });
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin('admin', 'editor');
    const body = await request.json();
    const { id, status, notes } = body;

    if (!id) return NextResponse.json({ error: 'Source ID is required' }, { status: 400 });

    const client = getServiceClient();
    if (client) {
      await client.from('discovery_sources').update({
        ...(status ? { status } : {}),
        ...(notes !== undefined ? { notes } : {}),
        last_checked_at: new Date().toISOString()
      }).eq('id', id);
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unauthorized' }, { status: 401 });
  }
}
