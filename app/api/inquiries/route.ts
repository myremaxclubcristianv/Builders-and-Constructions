import { NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';
import { sendTelegramNotification } from '@/lib/telegram';

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
  'work_with_us',
  'research_request_form',
  'report_error',
  'correction_request',
  'industry',
  'search',
  'editorial',
  'direct'
];

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (
      !body ||
      typeof body.name !== 'string' ||
      body.name.trim().length === 0 ||
      body.name.length > 200 ||
      typeof body.email !== 'string' ||
      body.email.length > 200 ||
      !emailPattern.test(body.email) ||
      (body.message !== undefined && (typeof body.message !== 'string' || body.message.length > 5000)) ||
      (body.company !== undefined && (typeof body.company !== 'string' || body.company.length > 300))
    ) {
      return NextResponse.json(
        { ok: false, error: 'Please provide a valid name and business email.' },
        { status: 400 }
      );
    }

    const source = validSources.includes(body.source) ? body.source : 'homepage';
    const timestamp = new Date().toISOString();

    // 1. Determine Internal Notification Header & Subject
    let header = 'NEW CONSTRUCTIONS RESEARCH REQUEST';
    if (source === 'work_with_us' || body.leadType === 'partnership_request' || body.kind === 'work') {
      header = 'NEW CONSTRUCTIONS PARTNERSHIP REQUEST';
    } else if (source === 'report_error' || source === 'correction_request' || body.leadType === 'correction_request') {
      header = 'NEW CONSTRUCTIONS PROFILE CORRECTION';
    } else if (source === 'research_request_form' || body.leadType === 'research_request') {
      header = 'NEW CONSTRUCTIONS RESEARCH REQUEST';
    }

    const subjectLine = body.company
      ? `Research Request — Subject: ${escapeHtml(body.company)}`
      : 'General Research Request';

    const telegramText = [
      `<b>${header}</b>`,
      header === 'NEW CONSTRUCTIONS RESEARCH REQUEST' ? `<b>Subject:</b> ${subjectLine}` : null,
      body.company ? `<b>Entity / Organization:</b> ${escapeHtml(body.company)}` : null,
      `<b>Name:</b> ${escapeHtml(body.name)}`,
      `<b>Email:</b> ${escapeHtml(body.email)}`,
      body.phone ? `<b>Phone:</b> ${escapeHtml(body.phone)}` : null,
      body.requestType ? `<b>Category:</b> ${escapeHtml(body.requestType)}` : null,
      body.message ? `<b>Details:</b> ${escapeHtml(body.message)}` : null,
      `<b>Source:</b> https://constructions.cristianvaduva.com/${source}`,
      `<b>Timestamp:</b> ${timestamp}`
    ]
      .filter(Boolean)
      .join('\n');

    const telegramSent = await sendTelegramNotification(telegramText);

    // 2. Persist to Supabase if configured (Optional secondary persistence)
    const client = getServiceClient();
    if (client) {
      try {
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

        await client
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
            lead_type: body.leadType || 'research_request'
          });
      } catch (dbErr) {
        console.error('[Inquiry DB Exception]', dbErr);
      }
    }

    // 3. Operational Delivery Check: Telegram is REQUIRED for operational success
    if (telegramSent) {
      return NextResponse.json(
        {
          ok: true,
          message: 'Request received. The CONSTRUCTIONS research team will review it.'
        },
        { status: 201 }
      );
    }

    // Operational delivery failed
    const hasCreds = Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID && process.env.TELEGRAM_BOT_TOKEN.trim() !== '' && process.env.TELEGRAM_CHAT_ID.trim() !== '');
    console.error('[TELEGRAM_NOTIFICATION_FAILED]', {
      reason: hasCreds ? 'telegram_api_rejected' : 'missing_credentials',
      source,
      timestamp
    });

    return NextResponse.json(
      {
        ok: false,
        error: "We couldn't submit the request right now. Please try again shortly."
      },
      { status: 500 }
    );
  } catch (err) {
    console.error('[Inquiry API Error]', err);
    return NextResponse.json(
      {
        ok: false,
        error: "We couldn't submit the request right now. Please try again shortly."
      },
      { status: 500 }
    );
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
