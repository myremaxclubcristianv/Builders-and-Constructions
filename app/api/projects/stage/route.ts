import { NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, stage } = body;

    if (!slug || typeof slug !== 'string') {
      return NextResponse.json({ error: 'Project slug is required.' }, { status: 400 });
    }

    const normalizedStage = String(stage || '').toLowerCase();
    if (!VALID_STAGES.includes(normalizedStage as any)) {
      return NextResponse.json({ error: 'Invalid construction stage value.' }, { status: 400 });
    }

    const client = getServiceClient();
    if (!client) {
      return NextResponse.json(
        { error: 'Unable to save pipeline stage. Database unavailable.', databaseSynced: false },
        { status: 503 }
      );
    }

    // Try updating Supabase project by slug or id
    const { data, error } = await client
      .from('projects')
      .update({
        current_stage: normalizedStage,
        updated_at: new Date().toISOString()
      })
      .eq('slug', slug)
      .select('id, slug, current_stage')
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message, databaseSynced: false }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      slug,
      stage: normalizedStage,
      databaseSynced: true,
      data
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Unable to update project stage.', databaseSynced: false },
      { status: 500 }
    );
  }
}
