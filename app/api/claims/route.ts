import { NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/rate-limit';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const rateLimit = checkRateLimit(request, 'claims', { maxRequests: 5, windowMs: 10 * 60 * 1000 });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfterSeconds)
          }
        }
      );
    }

    const body = await request.json().catch(() => null);
    if (
      !body ||
      typeof body.name !== 'string' ||
      body.name.trim().length === 0 ||
      body.name.length > 200 ||
      typeof body.email !== 'string' ||
      body.email.length > 200 ||
      !emailPattern.test(body.email) ||
      typeof body.companySlug !== 'string' ||
      body.companySlug.trim().length === 0 ||
      body.companySlug.length > 200 ||
      (body.phone !== undefined && (typeof body.phone !== 'string' || body.phone.length > 50)) ||
      (body.role !== undefined && (typeof body.role !== 'string' || body.role.length > 100)) ||
      (body.website !== undefined && (typeof body.website !== 'string' || body.website.length > 300)) ||
      (body.message !== undefined && (typeof body.message !== 'string' || body.message.length > 5000)) ||
      (body.company !== undefined && (typeof body.company !== 'string' || body.company.length > 300))
    ) {
      return NextResponse.json({ error: 'Please provide valid claim details including name, valid business email, and company.' }, { status: 400 });
    }

    const client = getServiceClient();
    if (!client) {
      return NextResponse.json({ error: 'Profile claims are not configured yet.' }, { status: 503 });
    }

    // 1. Resolve company
    const { data: company } = await client
      .from('companies')
      .select('id, name')
      .eq('slug', body.companySlug)
      .maybeSingle();

    // 2. Insert claim
    const { error } = await client.from('profile_claims').insert({
      claimant_name: body.name.trim(),
      claimant_company: body.company?.trim() || null,
      email: body.email.trim(),
      phone: body.phone?.trim() || null,
      role: body.role?.trim() || null,
      website: body.website?.trim() || null,
      message: body.message?.trim() || null,
      company_slug: body.companySlug,
      company_id: company?.id || null,
      status: 'new'
    });

    if (error) {
      return NextResponse.json({ error: 'We could not submit the claim.' }, { status: 500 });
    }

    // 3. Connect / Create Opportunity & log activity if company exists
    if (company?.id) {
      const { data: existingOpp } = await client
        .from('private_opportunity_scores')
        .select('company_id, signals')
        .eq('company_id', company.id)
        .maybeSingle();

      if (!existingOpp) {
        await client.from('private_opportunity_scores').insert({
          company_id: company.id,
          opportunity: 'high',
          opportunity_score: 85,
          score_reasons: ['Claimed company profile (+35)', 'Direct executive stakeholder engagement (+25)'],
          pipeline_status: 'new',
          signals: ['Claimed Company Profile', 'High Intent Stakeholder'],
          recommended_services: ['Website', 'Branding', 'Project Marketing'],
          notes: `Profile claim submitted by ${body.name} (${body.role || 'Executive'}, ${body.email}).`
        });
      }

      await client.from('sales_activities').insert({
        company_id: company.id,
        activity_type: 'other',
        summary: `Profile claim submitted: ${body.name} (${body.role || 'Stakeholder'})`,
        details: `Email: ${body.email}. Message: ${body.message || 'No message provided'}`,
        author_name: 'System / Claim Funnel'
      });
    }

    // 4. Record analytics event
    await client.from('analytics_events').insert({
      event_type: 'claim_click',
      entity_type: 'company',
      entity_id: company?.id || null,
      entity_slug: body.companySlug,
      source: 'claim_profile'
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error submitting claim.' }, { status: 500 });
  }
}
