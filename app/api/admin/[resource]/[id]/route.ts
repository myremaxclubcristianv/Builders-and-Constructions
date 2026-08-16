import {NextResponse} from 'next/server';
import {requireAdmin} from '@/lib/admin-auth';
import {getServiceClient} from '@/lib/supabase';

const resources = {
  companies: {
    roles: ['admin', 'editor'],
    fields: [
      'name',
      'slug',
      'type',
      'description',
      'website',
      'founded_year',
      'services',
      'specializations',
      'markets',
      'certifications',
      'content_state',
      'website_verification',
      'founded_verification',
      'is_featured',
      'published_at',
      'archived_at'
    ]
  },
  projects: {
    roles: ['admin', 'editor'],
    fields: [
      'name',
      'slug',
      'status',
      'project_type',
      'description',
      'estimated_completion',
      'surface_area',
      'unit_count',
      'estimated_investment',
      'content_state',
      'completion_verification',
      'is_featured',
      'published_at',
      'archived_at'
    ]
  },
  leads: {
    roles: ['admin', 'sales'],
    fields: ['status', 'assigned_to', 'last_contacted_at', 'next_action', 'message']
  },
  profile_claims: {
    roles: ['admin', 'sales'],
    fields: ['claim_status', 'reviewed_by', 'reviewed_at', 'reviewer_notes', 'company_id']
  },
  private_opportunity_scores: {
    roles: ['admin', 'sales'],
    fields: [
      'opportunity',
      'pipeline_status',
      'recommended_services',
      'signals',
      'notes',
      'owner_id',
      'last_contacted_at',
      'next_follow_up_at',
      'website_quality',
      'social_presence',
      'project_visibility',
      'content_quality',
      'brand_quality',
      'lead_generation_capability'
    ]
  },
  editorial_content: {
    roles: ['admin', 'editor'],
    fields: [
      'title',
      'slug',
      'excerpt',
      'body',
      'category',
      'cover_image',
      'author',
      'seo_title',
      'seo_description',
      'related_companies',
      'related_projects',
      'content_state',
      'published_at',
      'archived_at'
    ]
  }
} as const;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ resource: string; id: string }> }
) {
  const { resource, id } = await params;
  const config = resources[resource as keyof typeof resources];
  if (!config) return NextResponse.json({ error: 'Unknown resource.' }, { status: 404 });

  try {
    const actor = await requireAdmin(...config.roles);
    const payload = await request.json();
    const update = Object.fromEntries(
      Object.entries(payload).filter(([key]) => (config.fields as readonly string[]).includes(key))
    ) as Record<string, unknown>;

    if (!Object.keys(update).length) {
      return NextResponse.json({ error: 'No permitted changes.' }, { status: 400 });
    }

    if ('is_featured' in update) {
      update.is_featured = update.is_featured === 'true' || update.is_featured === true;
    }

    if ((resource === 'companies' || resource === 'projects' || resource === 'editorial_content') && update.content_state === 'published') {
      update.published_at = new Date().toISOString();
      update.archived_at = null;
    }
    if ((resource === 'companies' || resource === 'projects' || resource === 'editorial_content') && update.content_state === 'archived') {
      update.archived_at = new Date().toISOString();
      update.published_at = null;
    }

    const client = getServiceClient();
    if (!client) return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 503 });

    const { data, error } = await client
      .from(resource)
      .update({ ...update, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    await client.from('audit_log').insert({
      actor_id: actor.id,
      action: `${resource}_updated`,
      entity_type: resource,
      entity_id: id
    });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Not authorized.' }, { status: 403 });
  }
}
