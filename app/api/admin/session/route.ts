import { NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';
import { checkAuthLockout, recordAuthFailure, clearAuthFailures, checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    // 1. Check if client IP is currently locked out from prior failed login attempts
    const lockout = await checkAuthLockout(request);
    if (!lockout.allowed) {
      const status = lockout.status || 429;
      const error = status === 503
        ? 'Authentication service temporarily unavailable. Please try again later.'
        : 'Too many failed login attempts. Please wait before retrying.';
      return NextResponse.json(
        { error },
        { status, headers: { 'Retry-After': String(lockout.retryAfterSeconds) } }
      );
    }

    // 2. Coarse total request throttle to prevent socket exhaustion
    const coarseLimit = await checkRateLimit(request, 'admin_session_total', { maxRequests: 25, windowMs: 15 * 60 * 1000, failClosed: true });
    if (!coarseLimit.allowed) {
      const status = coarseLimit.status || 429;
      const error = status === 503
        ? 'Service temporarily unavailable. Please try again later.'
        : 'Too many requests. Please wait before retrying.';
      return NextResponse.json(
        { error },
        { status, headers: { 'Retry-After': String(coarseLimit.retryAfterSeconds) } }
      );
    }

    const { accessToken } = await request.json().catch(() => ({}));
    const client = getServiceClient();
    if (!accessToken || !client) {
      await recordAuthFailure(request);
      return NextResponse.json({ error: 'Authentication is not configured or token missing.' }, { status: 503 });
    }

    const { data: { user } } = await client.auth.getUser(accessToken);
    if (!user) {
      await recordAuthFailure(request);
      return NextResponse.json({ error: 'Invalid session.' }, { status: 401 });
    }

    const { data: profile } = await client.from('admin_profiles').select('role').eq('id', user.id).maybeSingle();
    if (!profile || !['admin', 'editor', 'sales'].includes(profile.role)) {
      await recordAuthFailure(request);
      return NextResponse.json({ error: 'This account has no administrator role.' }, { status: 403 });
    }

    // Authentication succeeded: clear previous failure counters
    await clearAuthFailures(request);

    const response = NextResponse.json({ role: profile.role });
    response.cookies.set('aix_admin_session', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8
    });
    return response;
  } catch (error) {
    // Defensive failure mode: safe generic error response
    return NextResponse.json({ error: 'Authentication service temporarily unavailable.' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set('aix_admin_session', '', { httpOnly: true, path: '/', maxAge: 0 });
  return response;
}
