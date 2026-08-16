import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getServiceClient } from '@/lib/supabase';
import { normalizeEntityData } from '@/lib/scoring';

export async function GET() {
  try {
    await requireAdmin('admin', 'editor');
    const client = getServiceClient();

    if (!client) {
      return NextResponse.json({
        jobs: [
          {
            id: 'job-1',
            name: 'Bucharest Landmark General Contractors Ingestion',
            target_entity: 'company',
            geography: 'Bucharest',
            company_type: 'General Contractor',
            status: 'completed',
            results_count: 8,
            discovered_count: 6,
            duplicate_count: 2,
            created_at: new Date().toISOString()
          }
        ],
        items: []
      });
    }

    const [{ data: jobs }, { data: items }] = await Promise.all([
      client.from('discovery_jobs').select('*').order('created_at', { ascending: false }),
      client.from('discovery_items').select('*').order('created_at', { ascending: false }).limit(50)
    ]);

    return NextResponse.json({ jobs: jobs || [], items: items || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin('admin', 'editor');
    const body = await request.json();
    const { name, sourceId, targetEntity, geography, companyType, projectType, rawItems } = body;

    if (!name || !targetEntity || !Array.isArray(rawItems)) {
      return NextResponse.json({ error: 'Job name, targetEntity, and rawItems are required' }, { status: 400 });
    }

    const client = getServiceClient();
    if (!client) {
      return NextResponse.json({
        ok: true,
        jobId: `mock-job-${Date.now()}`,
        discoveredCount: rawItems.length,
        duplicateCount: 0
      });
    }

    // 1. Fetch existing entities for duplicate check
    let existing: any[] = [];
    if (targetEntity === 'company') {
      const { data } = await client.from('companies').select('id, name, slug, website');
      existing = data || [];
    } else {
      const { data } = await client.from('projects').select('id, name, slug, location');
      existing = data || [];
    }

    // 2. Insert Job record
    const { data: job, error: jobErr } = await client.from('discovery_jobs').insert({
      name: name.trim(),
      source_id: sourceId || null,
      target_entity: targetEntity,
      geography: geography || 'Romania',
      company_type: companyType || null,
      project_type: projectType || null,
      created_by: admin.email,
      status: 'completed',
      results_count: rawItems.length
    }).select('*').single();

    if (jobErr) return NextResponse.json({ error: jobErr.message }, { status: 500 });

    // 3. Process & Stage Discovery Items
    let duplicateCount = 0;
    let discoveredCount = 0;

    const stagedItems = rawItems.map((raw: any) => {
      const { normalized } = normalizeEntityData(raw, targetEntity);
      const normName = normalized.name.toLowerCase().replace(/[^a-z0-9]/g, '');

      let duplicateMatch = existing.find(e => {
        const existNorm = e.name.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (existNorm === normName) return true;
        if (targetEntity === 'company' && normalized.website && e.website && e.website.includes(normalized.website.replace('https://', '').replace('http://', ''))) return true;
        return false;
      });

      let duplicateConfidence: 'high' | 'medium' | 'low' | 'none' = 'none';
      let reviewStatus: 'discovered' | 'possible_duplicate' = 'discovered';

      if (duplicateMatch) {
        duplicateConfidence = 'high';
        reviewStatus = 'possible_duplicate';
        duplicateCount++;
      } else {
        discoveredCount++;
      }

      return {
        job_id: job.id,
        entity_type: targetEntity,
        raw_data: raw,
        normalized_data: normalized,
        duplicate_confidence: duplicateConfidence,
        duplicate_match_id: duplicateMatch ? duplicateMatch.id : null,
        review_status: reviewStatus
      };
    });

    if (stagedItems.length > 0) {
      await client.from('discovery_items').insert(stagedItems);
    }

    // Update job counts
    await client.from('discovery_jobs').update({
      discovered_count: discoveredCount,
      duplicate_count: duplicateCount
    }).eq('id', job.id);

    return NextResponse.json({
      ok: true,
      jobId: job.id,
      discoveredCount,
      duplicateCount
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unauthorized' }, { status: 401 });
  }
}
