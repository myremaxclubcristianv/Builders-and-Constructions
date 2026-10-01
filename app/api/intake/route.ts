import { NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';
import { sendTelegramNotification } from '@/lib/telegram';
import { executeOperationalPipeline } from '@/lib/operational-pipeline';
import { checkRateLimit } from '@/lib/rate-limit';
import { getServiceBySlug, IntakeSubmissionPayload } from '@/lib/services-config';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+0-9\s().-]{6,25}$/;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function generateLeadId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `LEAD-${timestamp}-${rand}`;
}

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting Protection
    const rateLimit = checkRateLimit(request, 'intake', { maxRequests: 8, windowMs: 10 * 60 * 1000 });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { ok: false, error: 'Prea multe solicitări. Te rugăm să încerci din nou mai târziu.' },
        {
          status: 429,
          headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) }
        }
      );
    }

    // 2. Parse and basic shape validation
    const body: IntakeSubmissionPayload = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { ok: false, error: 'Format de solicitare invalid.' },
        { status: 400 }
      );
    }

    // Anti-spam honeypot detection
    if (body.website_hp && typeof body.website_hp === 'string' && body.website_hp.trim().length > 0) {
      return NextResponse.json(
        { ok: true, leadId: generateLeadId(), message: 'Solicitarea a fost recepționată.' },
        { status: 200 }
      );
    }

    // 3. Field validation
    const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : '';
    if (fullName.length < 2 || fullName.length > 200) {
      return NextResponse.json(
        { ok: false, error: 'Te rugăm să introduci un nume valid (minim 2 caractere).' },
        { status: 400 }
      );
    }

    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';

    const hasValidEmail = email.length > 0 && emailPattern.test(email) && email.length <= 200;
    const hasValidPhone = phone.length > 0 && phonePattern.test(phone) && phone.length <= 30;

    if (!hasValidEmail && !hasValidPhone) {
      return NextResponse.json(
        { ok: false, error: 'Te rugăm să furnizezi o adresă de email validă sau un număr de telefon valid.' },
        { status: 400 }
      );
    }

    if (body.consent !== true) {
      return NextResponse.json(
        { ok: false, error: 'Pentru a transmite solicitarea, este necesar acordul de prelucrare a datelor.' },
        { status: 400 }
      );
    }

    // Resolve service metadata
    const serviceDef = getServiceBySlug(body.serviceId);
    const serviceTitle = serviceDef ? serviceDef.title : (body.serviceName || 'Serviciu General / Nespecificat');
    const serviceCategory = serviceDef ? serviceDef.categoryLabel : 'General';

    const roleDisplay = body.role === 'Alt rol' && body.customRole
      ? `${body.customRole} (Alt rol)`
      : (body.role || 'Nespecificat');

    const leadId = generateLeadId();
    const timestamp = new Date().toISOString();

    // 4. Construct Telegram Operational Notification (strictly sanitized, no sensitive credentials)
    const companyDisplay = body.isCompany && body.companyName
      ? ` / ${escapeHtml(body.companyName)}${body.cui ? ` (CUI: ${escapeHtml(body.cui)})` : ''}`
      : '';

    let projectDisplay = 'Fără proiect specificat';
    if (body.isProjectRelated === 'yes') {
      const parts = [
        body.projectName ? escapeHtml(body.projectName) : 'Proiect activ',
        body.projectType ? `Tip: ${escapeHtml(body.projectType)}` : null,
        body.builtArea ? `Suprafață: ${escapeHtml(body.builtArea)}` : null
      ].filter(Boolean);
      projectDisplay = parts.join(' | ');
    } else if (body.isProjectRelated === 'planning') {
      projectDisplay = 'Faza de identificare / planificare';
    }

    const locationParts = [
      body.projectCity,
      body.projectCounty,
      body.projectAddress,
      body.companyLocation
    ].filter(Boolean).map(x => escapeHtml(String(x)));
    const locationDisplay = locationParts.length > 0 ? locationParts.join(', ') : 'Nespecificată';

    const stageDisplay = body.projectStage ? escapeHtml(body.projectStage) : 'Nespecificat';
    const urgencyDisplay = body.urgency || 'Normal';

    const source = body.source || 'services_intake';
    const sourceDisplay = escapeHtml(source);
    const landingPath = body.landingPath || '/contact';
    const pageDisplay = `https://constructions.cristianvaduva.com${escapeHtml(landingPath)}`;

    const contactChannels = [];
    if (email) contactChannels.push(`Email: ${escapeHtml(email)}`);
    if (phone) contactChannels.push(`Tel: ${escapeHtml(phone)}`);
    if (body.preferredContact) contactChannels.push(`Canal preferat: ${escapeHtml(body.preferredContact)}`);
    if (body.preferredInterval) contactChannels.push(`Interval: ${escapeHtml(body.preferredInterval)}`);
    const contactDisplay = contactChannels.join('\n');

    // Format service-specific details
    const specificEntries = body.serviceSpecificData && typeof body.serviceSpecificData === 'object'
      ? Object.entries(body.serviceSpecificData)
          .filter(([_, v]) => v !== undefined && v !== null && String(v).trim() !== '')
          .map(([k, v]) => `• <b>${escapeHtml(k)}:</b> ${escapeHtml(String(v))}`)
      : [];

    const specificBlock = specificEntries.length > 0
      ? `<b>SPECIFIC INTAKE DETAILS</b>\n${specificEntries.join('\n')}`
      : null;

    const messageDisplay = body.message && body.message.trim() !== ''
      ? escapeHtml(body.message.trim())
      : 'Nu a fost lăsat mesaj adițional.';

    const telegramLines = [
      '🏗️ <b>CONSTRUCTIONS by AiXLuxury — NEW LEAD</b>',
      '',
      '<b>SERVICE</b>',
      `${escapeHtml(serviceTitle)} (${escapeHtml(serviceCategory)})`,
      '',
      '<b>WHO</b>',
      `${escapeHtml(fullName)}${companyDisplay}`,
      '',
      '<b>ROLE</b>',
      escapeHtml(roleDisplay),
      '',
      '<b>PROJECT</b>',
      projectDisplay,
      '',
      '<b>LOCATION</b>',
      locationDisplay,
      '',
      '<b>STAGE</b>',
      stageDisplay,
      '',
      '<b>URGENCY</b>',
      escapeHtml(urgencyDisplay),
      '',
      '<b>SOURCE</b>',
      sourceDisplay,
      '',
      '<b>PAGE</b>',
      pageDisplay,
      '',
      '<b>CONTACT</b>',
      contactDisplay,
      '',
      specificBlock,
      '',
      '<b>MESSAGE</b>',
      messageDisplay,
      '',
      '<b>LEAD ID</b>',
      `<code>${leadId}</code>`
    ].filter(x => x !== null);

    const telegramText = telegramLines.join('\n');
    const telegramSent = await sendTelegramNotification(telegramText);

    // 5. Supabase Persistence (defensive handling)
    const client = getServiceClient();
    let dbRecordId: string | null = null;
    if (client) {
      try {
        const insertPayload: Record<string, any> = {
          name: fullName,
          company_name: body.companyName?.trim() || null,
          email: email || (phone ? `${phone.replace(/[^0-9]/g, '')}@phone.placeholder` : 'contact@placeholder.local'),
          phone: phone || null,
          request_type: serviceTitle,
          message: [
            body.message ? `[Mesaj Client]: ${body.message}` : null,
            `[Rol]: ${roleDisplay}`,
            body.isCompany ? `[Companie CUI]: ${body.cui || 'N/A'} | Domeniu: ${body.industryField || 'N/A'}` : null,
            body.isProjectRelated === 'yes' ? `[Proiect]: ${body.projectName || 'N/A'} | Tip: ${body.projectType || 'N/A'} | Stadiu: ${stageDisplay}` : null,
            `[Urgență]: ${urgencyDisplay}`,
            `[Canal Preferat]: ${body.preferredContact || 'Orice'} (${body.preferredInterval || 'Oricând'})`,
            `[Lead ID]: ${leadId}`
          ].filter(Boolean).join('\n'),
          source: body.source && body.source.length < 50 ? body.source : 'homepage',
          lead_type: 'company_inquiry',
          status: 'new',
          landing_path: landingPath,
          referrer: body.referrer || null
        };

        const { data: leadRecord, error: leadErr } = await client
          .from('leads')
          .insert(insertPayload)
          .select('id')
          .maybeSingle();

        if (leadRecord?.id) {
          dbRecordId = leadRecord.id;

          if (specificEntries.length > 0) {
            try {
              await client.from('lead_notes').insert({
                lead_id: dbRecordId,
                body: `[Intake Smart Data]:\n` + JSON.stringify(body.serviceSpecificData, null, 2)
              });
            } catch {
              // Ignore note insertion failure
            }
          }
        } else if (leadErr) {
          console.warn('[Intake DB Insert Warning]', leadErr);
        }
      } catch (dbErr) {
        console.error('[Intake DB Exception]', dbErr);
      }
    }

    // 6. Operational Intelligence Event Execution
    try {
      await executeOperationalPipeline({
        sourceName: `Intake Form: ${fullName}`,
        sourceType: 'FORM_SUBMISSION',
        sourceUrl: pageDisplay,
        triggerType: 'WEBHOOK',
        entityNameCandidate: body.companyName || fullName,
        eventType: 'COMMERCIAL_INQUIRY',
        evidenceText: `Verified ${serviceTitle} intake from ${email || phone} (Urgency: ${urgencyDisplay})`,
        commercialRelevance: urgencyDisplay === 'Urgent' ? 'CRITICAL' : 'HIGH',
        rawPayload: {
          leadId,
          dbRecordId,
          name: fullName,
          email,
          phone,
          company: body.companyName,
          service: serviceTitle,
          role: roleDisplay,
          project: body.projectName,
          stage: stageDisplay,
          urgency: urgencyDisplay,
          submittedAt: timestamp
        }
      });
    } catch (pipeErr) {
      console.error('[Operational Pipeline Exception]', pipeErr);
    }

    // 7. Response
    return NextResponse.json(
      {
        ok: true,
        leadId,
        telegramDelivered: telegramSent,
        message: 'Solicitarea a fost transmisă. Am primit informațiile tale și solicitarea a fost înregistrată.'
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[Intake API Route Exception]', err);
    return NextResponse.json(
      { ok: false, error: 'A apărut o eroare la transmiterea solicitării. Te rugăm să încerci din nou.' },
      { status: 500 }
    );
  }
}
