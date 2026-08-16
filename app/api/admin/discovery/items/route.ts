import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getServiceClient } from '@/lib/supabase';

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin('admin', 'editor');
    const body = await request.json();
    const { itemId, action } = body; // action: 'approve' | 'ignore' | 'not_a_fit'

    if (!itemId || !action) {
      return NextResponse.json({ error: 'itemId and action are required' }, { status: 400 });
    }

    const client = getServiceClient();
    if (!client) return NextResponse.json({ ok: true });

    // 1. Fetch item
    const { data: item, error: fetchErr } = await client
      .from('discovery_items')
      .select('*')
      .eq('id', itemId)
      .single();

    if (fetchErr || !item) {
      return NextResponse.json({ error: 'Discovery item not found' }, { status: 404 });
    }

    if (action === 'approve') {
      const norm = item.normalized_data || {};
      const slug = slugify(norm.name || 'item');

      if (item.entity_type === 'company') {
        await client.from('companies').insert({
          name: norm.name,
          slug,
          type: norm.type || 'General Contractor',
          location: norm.city || 'Bucharest',
          website: norm.website || null,
          description: norm.description || null,
          content_state: 'draft',
          research_state: 'unresearched',
          website_verification: 'unverified'
        });
      } else {
        await client.from('projects').insert({
          name: norm.name,
          slug,
          type: norm.type || 'Mixed-Use',
          status: norm.status || 'Under construction',
          location: norm.location || 'Bucharest, Romania',
          description: norm.description || null,
          content_state: 'draft',
          research_state: 'unresearched',
          status_verification: 'unverified'
        });
      }

      await client.from('discovery_items').update({ review_status: 'approved' }).eq('id', itemId);
    } else if (action === 'ignore') {
      await client.from('discovery_items').update({ review_status: 'ignored' }).eq('id', itemId);
    } else if (action === 'not_a_fit') {
      await client.from('discovery_items').update({ review_status: 'not_a_fit' }).eq('id', itemId);
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unauthorized' }, { status: 401 });
  }
}
