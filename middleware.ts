import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PRIVATE_HTML_PREFIXES = [
  '/workspace',
  '/command',
  '/dealflow',
  '/accounts',
  '/outreach',
  '/actions',
  '/decisions',
  '/commercial',
  '/product-health'
];

const ALLOWED_ORIGINS = [
  'https://constructions.cristianvaduva.com',
  'https://cristianvaduva.com',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin = request.headers.get('origin');

  // Handle CORS preflight OPTIONS requests
  if (request.method === 'OPTIONS') {
    const isAllowedOrigin = origin && ALLOWED_ORIGINS.includes(origin);
    const preflightResponse = new NextResponse(null, { status: 204 });
    if (isAllowedOrigin) {
      preflightResponse.headers.set('Access-Control-Allow-Origin', origin);
      preflightResponse.headers.set('Access-Control-Allow-Credentials', 'true');
      preflightResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      preflightResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-requested-with');
      preflightResponse.headers.set('Access-Control-Max-Age', '86400');
    }
    return preflightResponse;
  }

  // Determine if path is private HTML or API route
  const isAdminLogin = pathname === '/admin/login';
  const isAdminSessionApi = pathname === '/api/admin/session';
  const isAdminHtml = pathname === '/admin' || (pathname.startsWith('/admin/') && !isAdminLogin);
  const isPrivateHtml = isAdminHtml || PRIVATE_HTML_PREFIXES.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`));
  const isPrivateApi = pathname.startsWith('/api/admin') && !isAdminSessionApi;

  // Check authentication session token from cookie or Authorization header
  const token = request.cookies.get('aix_admin_session')?.value || request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

  if (!token) {
    if (isPrivateHtml) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl, 307);
    }
    if (isPrivateApi) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  // Generate dynamic cryptographic nonce for Content Security Policy
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ""};
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: blob: https:;
    font-src 'self' data:;
    connect-src 'self' https://*.supabase.co;
    frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com;
    frame-ancestors 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  // Forward request with injected headers for Server Components & Layouts
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('x-pathname', pathname);
  requestHeaders.set('Content-Security-Policy', cspHeader);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders
    }
  });

  // Attach Security & CSP Headers to Response
  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=(), accelerometer=(), gyroscope=(), magnetometer=()');
  response.headers.set('X-DNS-Prefetch-Control', 'on');

  // Attach CORS headers if origin is legitimate
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-requested-with');
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt)$).*)'
  ]
};
