import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getServiceClient } from '@/lib/supabase';
import { executeOperationalPipeline } from '@/lib/operational-pipeline';

export async function GET() {
  try {
    await requireAdmin('admin', 'editor');
    const client = getServiceClient();

    if (!client) {
      return NextResponse.json({
        jobs: [
          {
            id: 'job-sample-1',
            source_name: 'Bucharest City Hall Permit Feed',
            source_type: 'PUBLIC_REGISTRY',
            trigger_type: 'MANUAL',
            status: 'COMPLETED',
            records_seen: 1,
            records_created: 1,
            duplicate_count: 0,
            started_at: new Date().toISOString()
          }
        ],
        observations: [],
        opportunityCandidates: []
      });
    }

    const [{ data: jobs }, { data: observations }, { data: opportunityCandidates }] = await Promise.all([
      client.from('intelligence_ingestion_jobs').select('*').order('started_at', { ascending: false }).limit(20),
      client.from('intelligence_observations').select('*').order('created_at', { ascending: false }).limit(20),
      client.from('intelligence_opportunity_candidates').select('*').order('generated_at', { ascending: false }).limit(20)
    ]);

    return NextResponse.json({
      jobs: jobs || [],
      observations: observations || [],
      opportunityCandidates: opportunityCandidates || []
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin('admin', 'editor');
    const body = await request.json();

    const {
      sourceName,
      sourceType,
      sourceUrl,
      rawPayload,
      entityNameCandidate,
      cuiCandidate,
      domainCandidate,
      eventType,
      evidenceText,
      commercialRelevance
    } = body;

    if (!sourceName || !sourceUrl || !rawPayload) {
      return NextResponse.json({ error: 'sourceName, sourceUrl, and rawPayload are required' }, { status: 400 });
    }

    const result = await executeOperationalPipeline({
      sourceName,
      sourceType: sourceType || 'OFFICIAL',
      sourceUrl,
      rawPayload,
      triggerType: 'MANUAL',
      entityNameCandidate,
      cuiCandidate,
      domainCandidate,
      eventType,
      evidenceText,
      commercialRelevance
    });

    return NextResponse.json({ ok: true, result }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unauthorized' }, { status: 401 });
  }
}
