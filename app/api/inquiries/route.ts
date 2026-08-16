import { NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const validSources = [
  'homepage',
  'company_profile',
  'project_profile',
  'promote_company',
  'promote_project',
  'claim_profile',
  'work_with_company',
  'work_with_project',
  'industry',
  'search',
  'editorial',
  'direct'
];

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body.name !== 'string' || !emailPattern.test(body.email)) {
      return NextResponse.json({ error: 'Please provide a name, a valid business email, and a valid source.' }, { status: 400 });
    }

    const source = validSources.includes(body.source) ? body.source : 'homepage';
    const client = getServiceClient();

    if (!client) {
      return NextResponse.json({ error: 'Lead storage is not configured yet. Please contact the platform team.' }, { status: 503 });
    }

    // 1. Resolve company_id if not explicitly provided
    let companyId = body.companyId || body.target_company_id || null;
    if (!companyId && body.company) {
      const { data: comp } = await client
        .from('companies')
        .select('id')
        .ilike('name', body.company.trim())
        .limit(1)
        .maybeSingle();
      if (comp) companyId = comp.id;
    }

    const projectId = body.projectId || body.target_project_id || null;

    // 2. Insert Lead
    const { data: lead, error: leadErr } = await client
      .from('leads')
      .insert({
        name: body.name.trim(),
        company_name: body.company?.trim() || null,
        email: body.email.trim(),
        phone: body.phone?.trim() || null,
        company_id: companyId,
        project_id: projectId,
        target_company_id: companyId,
        target_project_id: projectId,
        landing_path: body.landing_path || null,
        referrer: body.referrer || null,
        request_type: body.requestType || null,
        message: body.message?.trim() || null,
        source,
        lead_type: body.leadType || (source.includes('project') ? 'project_inquiry' : 'company_inquiry')
      })
      .select('id')
      .single();

    if (leadErr) {
      return NextResponse.json({ error: 'We could not save your request. Please try again.' }, { status: 500 });
    }

    // 3. Connect / Create Sales Opportunity if companyId exists
    if (companyId) {
      const { data: existingOpp } = await client
        .from('private_opportunity_scores')
        .select('company_id, signals, recommended_services')
        .eq('company_id', companyId)
        .maybeSingle();

      if (!existingOpp) {
        // Create initial opportunity automatically
        await client.from('private_opportunity_scores').insert({
          company_id: companyId,
          opportunity: 'high',
          opportunity_score: 80,
          score_reasons: ['Inbound lead conversion inquiry received (+30)', 'Strong commercial intent (+20)'],
          pipeline_status: 'new',
          signals: ['Inbound Lead Received', 'High Intent'],
          recommended_services: ['Website', 'Project Marketing', 'Lead Generation'],
          notes: `Automated opportunity created from inbound lead by ${body.name} (${body.email}) via ${source}.`
        });
      }

      // Log chronological sales activity
      await client.from('sales_activities').insert({
        company_id: companyId,
        activity_type: 'other',
        summary: `Inbound lead received: ${body.name} (${body.email})`,
        details: `Source: ${source}. Message: ${body.message || 'No additional note'}. Phone: ${body.phone || 'N/A'}`,
        author_name: 'System / Inbound Funnel'
      });
    }

    // 4. Telemetry event
    await client.from('analytics_events').insert({
      event_type: 'contact_submit',
      entity_type: companyId ? 'company' : projectId ? 'project' : 'general',
      entity_id: companyId || projectId || null,
      source
    });

    return NextResponse.json({ ok: true, leadId: lead?.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error processing inquiry.' }, { status: 500 });
  }
}
