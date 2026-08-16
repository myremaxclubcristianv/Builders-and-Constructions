import {NextResponse} from 'next/server';
import {requireAdmin} from '@/lib/admin-auth';
import {getServiceClient} from '@/lib/supabase';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'application/pdf'
];

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

const BUCKET_MAP: Record<string, string> = {
  companies: 'company-media',
  projects: 'project-media',
  editorial: 'editorial-media',
  editorial_content: 'editorial-media'
};

function sanitizeFilename(originalName: string): string {
  const clean = originalName.toLowerCase().replace(/[^a-z0-9.-]/g, '_');
  const ext = clean.substring(clean.lastIndexOf('.'));
  const base = clean.substring(0, clean.lastIndexOf('.')).slice(0, 30);
  const randomSuffix = Math.random().toString(36).substring(2, 9);
  return `${Date.now()}_${base}_${randomSuffix}${ext}`;
}

export async function POST(request: Request) {
  try {
    const actor = await requireAdmin('admin', 'editor');
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const entityType = String(formData.get('entityType') || '');
    const entityId = String(formData.get('entityId') || '');
    const altText = String(formData.get('altText') || '');
    const caption = String(formData.get('caption') || '');
    const credit = String(formData.get('credit') || '');
    const source = String(formData.get('source') || '');
    const isHero = formData.get('isHero') === 'true';

    if (!file || !entityType || !entityId) {
      return NextResponse.json({ error: 'File and entity info are required.' }, { status: 400 });
    }

    const bucket = BUCKET_MAP[entityType];
    if (!bucket) {
      return NextResponse.json({ error: 'Invalid entity type for media upload.' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({
        error: 'Invalid file format. Supported formats: JPEG, PNG, WEBP, AVIF, PDF.'
      }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File exceeds 15MB size limit.' }, { status: 400 });
    }

    const client = getServiceClient();
    if (!client) return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 });

    const safeFilename = sanitizeFilename(file.name);
    const storagePath = `${entityId}/${safeFilename}`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase storage bucket
    const { error: uploadError } = await client.storage.from(bucket).upload(storagePath, buffer, {
      contentType: file.type,
      upsert: false
    });

    if (uploadError) {
      return NextResponse.json({ error: `Storage upload failed: ${uploadError.message}` }, { status: 500 });
    }

    // If setting as hero, atomically unset any existing hero for this entity
    if (isHero) {
      let heroReset = client.from('media').update({ is_hero: false });
      if (entityType === 'companies') heroReset = heroReset.eq('company_id', entityId);
      else if (entityType === 'projects') heroReset = heroReset.eq('project_id', entityId);
      else if (entityType === 'editorial' || entityType === 'editorial_content') heroReset = heroReset.eq('article_id', entityId);
      await heroReset;
    }

    // Calculate next sort order
    let countQuery = client.from('media').select('id', { count: 'exact', head: true });
    if (entityType === 'companies') countQuery = countQuery.eq('company_id', entityId);
    else if (entityType === 'projects') countQuery = countQuery.eq('project_id', entityId);
    else if (entityType === 'editorial' || entityType === 'editorial_content') countQuery = countQuery.eq('article_id', entityId);
    const { count: curCount } = await countQuery;

    const mediaType = file.type.startsWith('image/') ? 'image' : file.type === 'application/pdf' ? 'document' : 'image';

    const insertPayload: Record<string, unknown> = {
      storage_key: `${bucket}/${storagePath}`,
      filename: file.name,
      file_type: file.type,
      file_size: file.size,
      media_type: mediaType,
      alt_text: altText || null,
      caption: caption || null,
      credit: credit || null,
      source: source || null,
      is_hero: isHero,
      is_public: true,
      sort_order: (curCount || 0) + 1,
      uploaded_by: actor.id
    };

    if (entityType === 'companies') insertPayload.company_id = entityId;
    else if (entityType === 'projects') insertPayload.project_id = entityId;
    else if (entityType === 'editorial' || entityType === 'editorial_content') insertPayload.article_id = entityId;

    const { data: mediaRecord, error: dbError } = await client.from('media').insert(insertPayload).select().single();

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 400 });
    }

    await client.from('audit_log').insert({
      actor_id: actor.id,
      action: 'media_uploaded',
      entity_type: entityType,
      entity_id: entityId
    });

    return NextResponse.json(mediaRecord, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
  }
}

export async function PATCH(request: Request) {
  try {
    const actor = await requireAdmin('admin', 'editor');
    const body = await request.json();
    const { id, isHero, altText, caption, credit, source, sortOrder, entityType, entityId } = body;

    if (!id) return NextResponse.json({ error: 'Media ID required.' }, { status: 400 });

    const client = getServiceClient();
    if (!client) return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 });

    // If setting as hero, unset previous hero atomically
    if (isHero && entityType && entityId) {
      let heroReset = client.from('media').update({ is_hero: false });
      if (entityType === 'companies') heroReset = heroReset.eq('company_id', entityId);
      else if (entityType === 'projects') heroReset = heroReset.eq('project_id', entityId);
      else if (entityType === 'editorial' || entityType === 'editorial_content') heroReset = heroReset.eq('article_id', entityId);
      await heroReset;
    }

    const updates: Record<string, unknown> = {};
    if (typeof isHero === 'boolean') updates.is_hero = isHero;
    if (altText !== undefined) updates.alt_text = altText;
    if (caption !== undefined) updates.caption = caption;
    if (credit !== undefined) updates.credit = credit;
    if (source !== undefined) updates.source = source;
    if (typeof sortOrder === 'number') updates.sort_order = sortOrder;

    const { data, error } = await client.from('media').update(updates).eq('id', id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    await client.from('audit_log').insert({
      actor_id: actor.id,
      action: 'media_updated',
      entity_type: 'media',
      entity_id: id
    });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
  }
}

export async function DELETE(request: Request) {
  try {
    const actor = await requireAdmin('admin', 'editor');
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Media ID is required.' }, { status: 400 });

    const client = getServiceClient();
    if (!client) return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 });

    // Fetch media to delete file from storage bucket
    const { data: media } = await client.from('media').select('*').eq('id', id).maybeSingle();
    if (media?.storage_key) {
      const parts = media.storage_key.split('/');
      const bucket = parts[0];
      const path = parts.slice(1).join('/');
      if (bucket && path) {
        await client.storage.from(bucket).remove([path]);
      }
    }

    const { error } = await client.from('media').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    await client.from('audit_log').insert({
      actor_id: actor.id,
      action: 'media_deleted',
      entity_type: 'media',
      entity_id: id
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
  }
}
