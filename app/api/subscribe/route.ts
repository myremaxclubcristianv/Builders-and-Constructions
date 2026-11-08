import { NextRequest, NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/rate-limit';
import { sendTelegramNotification } from '@/lib/telegram';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting
    const rateLimit = await checkRateLimit(request, 'newsletter_subscribe', { maxRequests: 5, windowMs: 10 * 60 * 1000, failClosed: true });
    if (!rateLimit.allowed) {
      const status = rateLimit.status || 429;
      const error = status === 503
        ? 'Subscription service temporarily unavailable. Please try again later.'
        : 'Too many requests. Please try again shortly.';
      return NextResponse.json(
        { ok: false, error },
        { status, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ ok: false, error: 'Invalid request payload.' }, { status: 400 });
    }

    // 2. Anti-spam honeypot
    if (body.website_hp || body.company_tax_id_confirm || body.honeypot) {
      return NextResponse.json({ ok: true, message: 'Subscribed successfully.' }, { status: 200 });
    }

    // 3. Validation
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const consent = Boolean(body.consent);

    if (!email || !emailPattern.test(email) || email.length > 255) {
      return NextResponse.json({ ok: false, error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (!consent) {
      return NextResponse.json({ ok: false, error: 'Consent to privacy policy is required.' }, { status: 400 });
    }

    const client = getServiceClient();
    if (!client) {
      // In offline / staging environments without active Supabase credentials, return local success
      return NextResponse.json({ ok: true, status: 'simulated_local_success', message: 'Subscribed successfully.' });
    }

    if (client) {
      try {
        const { data: existing } = await client
          .from('leads')
          .select('id, status')
          .eq('email', email)
          .eq('lead_type', 'newsletter')
          .maybeSingle();

        if (existing) {
          return NextResponse.json({
            ok: true,
            status: 'already_subscribed',
            message: 'You are already subscribed to market intelligence alerts.'
          });
        }

        await client
          .from('leads')
          .insert({
            name: 'Newsletter Subscriber',
            email,
            lead_type: 'newsletter',
            source: 'newsletter_subscription',
            status: 'new',
            budget_range: 'NONE',
            notes: `User subscribed to construction intelligence newsletter with GDPR consent at ${new Date().toISOString()}`
          });
      } catch (dbErr) {
        console.warn('[Newsletter DB Warning]', dbErr);
      }
    }

    // 5. Notify team via Telegram if configured
    await sendTelegramNotification(`📬 <b>NEW NEWSLETTER SUBSCRIBER</b>\nEmail: <code>${email}</code>\nConsent: Verified\nTime: ${new Date().toISOString()}`).catch(() => {});

    return NextResponse.json({
      ok: true,
      message: 'Subscription confirmed. You will receive factual construction market briefs.'
    });
  } catch {
    return NextResponse.json({ ok: false, error: 'An unexpected error occurred. Please try again later.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { email } = await request.json().catch(() => ({}));
    if (!email || !emailPattern.test(String(email))) {
      return NextResponse.json({ ok: false, error: 'Invalid email address.' }, { status: 400 });
    }

    const client = getServiceClient();
    if (client) {
      await client
        .from('leads')
        .update({ status: 'unsubscribed' })
        .eq('email', String(email).trim().toLowerCase())
        .eq('lead_type', 'newsletter');
    }

    return NextResponse.json({ ok: true, message: 'Unsubscribed successfully.' });
  } catch {
    return NextResponse.json({ ok: false, error: 'Could not process unsubscribe request.' }, { status: 500 });
  }
}
