import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import { getServiceClient } from '@/lib/supabase';

export type AdminRole = 'admin' | 'editor' | 'sales';
export type AdminIdentity = { id: string; email: string; role: AdminRole };

export class ApiAuthError extends Error {
  statusCode: 401 | 403;
  constructor(statusCode: 401 | 403, message: string) {
    super(message);
    this.name = 'ApiAuthError';
    this.statusCode = statusCode;
  }
}

export async function getAdminIdentity(): Promise<AdminIdentity | null> {
  try {
    const reqHeaders = await headers();
    const reqCookies = await cookies();
    const token = reqHeaders.get('authorization')?.replace(/^Bearer\s+/i, '') || reqCookies.get('aix_admin_session')?.value;
    const client = getServiceClient();
    if (!token || !client) return null;
    const { data: { user } } = await client.auth.getUser(token);
    if (!user) return null;
    const { data: profile } = await client.from('admin_profiles').select('role').eq('id', user.id).maybeSingle();
    if (!profile || !['admin', 'editor', 'sales'].includes(profile.role)) return null;
    return { id: user.id, email: user.email || '', role: profile.role as AdminRole };
  } catch {
    return null;
  }
}

export async function requireAdmin(...roles: ReadonlyArray<AdminRole>): Promise<AdminIdentity> {
  const identity = await getAdminIdentity();
  const reqHeaders = await headers();
  const pathname = reqHeaders.get('x-pathname') || '';
  const accept = reqHeaders.get('accept') || '';
  const isApi = pathname.startsWith('/api/') || (!accept.includes('text/html') && accept.includes('application/json'));

  if (!identity) {
    if (isApi) {
      throw new ApiAuthError(401, 'Unauthorized');
    }
    redirect('/admin/login');
  }

  if (roles.length && !roles.includes(identity.role)) {
    throw new ApiAuthError(403, 'Forbidden: Insufficient role permissions');
  }

  return identity;
}

export async function requireAdminApi(...roles: ReadonlyArray<AdminRole>): Promise<AdminIdentity> {
  const identity = await getAdminIdentity();
  if (!identity) {
    throw new ApiAuthError(401, 'Unauthorized');
  }
  if (roles.length && !roles.includes(identity.role)) {
    throw new ApiAuthError(403, 'Forbidden: Insufficient role permissions');
  }
  return identity;
}

export async function verifyAdminApi(...roles: ReadonlyArray<AdminRole>): Promise<{ identity: AdminIdentity } | { errorResponse: NextResponse }> {
  try {
    const identity = await requireAdminApi(...roles);
    return { identity };
  } catch (err: any) {
    const status = err instanceof ApiAuthError ? err.statusCode : 401;
    const message = err?.message || (status === 401 ? 'Unauthorized' : 'Forbidden');
    return {
      errorResponse: NextResponse.json({ error: message }, { status })
    };
  }
}

export async function requireAdminOrRole(roles: ReadonlyArray<AdminRole>) {
  return requireAdmin(...roles);
}

