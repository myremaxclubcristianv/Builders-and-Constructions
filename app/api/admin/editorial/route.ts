import {NextResponse} from 'next/server';
import {requireAdmin} from '@/lib/admin-auth';
import {getServiceClient} from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const actor = await requireAdmin('admin', 'editor');
    const body = await request.json();

    const title = String(body.title || '').trim();
    let slug = String(body.slug || '').trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
    if (!slug) slug = title.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');

    if (!title || !slug) {
      return NextResponse.json({ error: 'Title and slug are required.' }, { status: 400 });
    }

    const client = getServiceClient();
    if (!client) return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 });

    const contentState = body.content_state || 'draft';
    const isPublished = contentState === 'published';

    const insertPayload = {
      title,
      slug,
      excerpt: body.excerpt || null,
      body: body.body || null,
      category: body.category || 'Architecture & Development',
      author: body.author || actor.email || 'Editorial Team',
      cover_image: body.cover_image || null,
      seo_title: body.seo_title || title,
      seo_description: body.seo_description || body.excerpt || null,
      related_companies: Array.isArray(body.related_companies) ? body.related_companies : [],
      related_projects: Array.isArray(body.related_projects) ? body.related_projects : [],
      content_state: contentState,
      published_at: isPublished ? new Date().toISOString() : null
    };

    const { data, error } = await client.from('editorial_content').insert(insertPayload).select().single();

    if (error) {
      return NextResponse.json({ error: error.code === '23505' ? 'An article with this slug already exists.' : error.message }, { status: 400 });
    }

    await client.from('audit_log').insert({
      actor_id: actor.id,
      action: 'editorial_created',
      entity_type: 'editorial_content',
      entity_id: data.id
    });

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
  }
}
