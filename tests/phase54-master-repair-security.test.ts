import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { NextRequest } from 'next/server';
import { middleware } from '../middleware';
import { checkRateLimit } from '../lib/rate-limit';

test('PHASE 54: MASTER REPAIR SECURITY HARDENING SUITE', async (t) => {
  await t.test('1. Unauthenticated requests to private HTML routes redirect 307 to /admin/login', () => {
    const privateRoutes = [
      '/admin',
      '/admin/projects',
      '/admin/companies',
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

    for (const route of privateRoutes) {
      const req = new NextRequest(`https://constructions.cristianvaduva.com${route}`, {
        headers: {
          accept: 'text/html'
        }
      });
      const res = middleware(req);
      assert.strictEqual(res.status, 307, `Expected 307 redirect for route ${route}`);
      const location = res.headers.get('location');
      assert.ok(location?.includes('/admin/login'), `Expected redirect location to point to /admin/login for ${route}, got ${location}`);
    }
  });

  await t.test('2. Unauthenticated requests to private API routes return 401 JSON', async () => {
    const apiRoutes = [
      '/api/admin/projects',
      '/api/admin/companies',
      '/api/admin/leads',
      '/api/admin/export',
      '/api/admin/import'
    ];

    for (const route of apiRoutes) {
      const req = new NextRequest(`https://constructions.cristianvaduva.com${route}`, {
        headers: {
          accept: 'application/json'
        }
      });
      const res = middleware(req);
      assert.strictEqual(res.status, 401, `Expected 401 status for private API ${route}`);
      const data = await res.json();
      assert.strictEqual(data.error, 'Unauthorized');
    }
  });

  await t.test('3. Public authentication routes (/admin/login and /api/admin/session) are NOT blocked', () => {
    const loginReq = new NextRequest('https://constructions.cristianvaduva.com/admin/login');
    const loginRes = middleware(loginReq);
    assert.notStrictEqual(loginRes.status, 307);
    assert.notStrictEqual(loginRes.status, 401);

    const sessionReq = new NextRequest('https://constructions.cristianvaduva.com/api/admin/session', {
      method: 'POST'
    });
    const sessionRes = middleware(sessionReq);
    assert.notStrictEqual(sessionRes.status, 307);
    assert.notStrictEqual(sessionRes.status, 401);
  });

  await t.test('4. Nonce-based Content-Security-Policy is cryptographically dynamic on each response', () => {
    const req1 = new NextRequest('https://constructions.cristianvaduva.com/');
    const res1 = middleware(req1);
    const csp1 = res1.headers.get('Content-Security-Policy') || '';

    const req2 = new NextRequest('https://constructions.cristianvaduva.com/');
    const res2 = middleware(req2);
    const csp2 = res2.headers.get('Content-Security-Policy') || '';

    assert.ok(csp1.includes('nonce-'), 'CSP must include nonce');
    assert.ok(csp2.includes('nonce-'), 'CSP must include nonce');
    assert.notStrictEqual(csp1, csp2, 'Each request must generate a distinct cryptographic nonce');
    assert.ok(csp1.includes("'strict-dynamic'"), 'CSP must include strict-dynamic');
  });

  await t.test('5. CORS allows legitimate origins and rejects unauthorized origins', () => {
    // Authorized origin
    const validReq = new NextRequest('https://constructions.cristianvaduva.com/api/inquiries', {
      headers: { origin: 'https://constructions.cristianvaduva.com' }
    });
    const validRes = middleware(validReq);
    assert.strictEqual(validRes.headers.get('Access-Control-Allow-Origin'), 'https://constructions.cristianvaduva.com');
    assert.strictEqual(validRes.headers.get('Access-Control-Allow-Credentials'), 'true');

    // Unauthorized origin
    const rogueReq = new NextRequest('https://constructions.cristianvaduva.com/api/inquiries', {
      headers: { origin: 'https://malicious-attacker.com' }
    });
    const rogueRes = middleware(rogueReq);
    assert.strictEqual(rogueRes.headers.get('Access-Control-Allow-Origin'), null);

    // Preflight OPTIONS on allowed origin
    const optReq = new NextRequest('https://constructions.cristianvaduva.com/api/inquiries', {
      method: 'OPTIONS',
      headers: { origin: 'https://constructions.cristianvaduva.com' }
    });
    const optRes = middleware(optReq);
    assert.strictEqual(optRes.status, 204);
    assert.strictEqual(optRes.headers.get('Access-Control-Allow-Origin'), 'https://constructions.cristianvaduva.com');
  });

  await t.test('6. security.txt exists, conforms to RFC 9116 and contains canonical and contact details', () => {
    const secFilePath = path.join(process.cwd(), 'public', '.well-known', 'security.txt');
    assert.ok(fs.existsSync(secFilePath), 'public/.well-known/security.txt must exist');
    const content = fs.readFileSync(secFilePath, 'utf-8');
    assert.ok(content.includes('Contact: mailto:contact@cristianvaduva.com'), 'Must contain verified contact email');
    assert.ok(content.includes('Expires:'), 'Must contain RFC 9116 Expires field');
    assert.ok(content.includes('Canonical: https://constructions.cristianvaduva.com/.well-known/security.txt'), 'Must contain exact Canonical URL');
    assert.ok(content.includes('Preferred-Languages:'), 'Must declare preferred languages');
  });

  await t.test('7. Admin login rate limiting blocks abusive requests with 429 Retry-After', () => {
    const testIp = '198.51.100.42';
    const fakeRequest = (ip: string) =>
      new Request('https://constructions.cristianvaduva.com/api/admin/session', {
        method: 'POST',
        headers: { 'x-forwarded-for': ip }
      });

    // 5 requests within limit
    for (let i = 0; i < 5; i++) {
      const res = checkRateLimit(fakeRequest(testIp), 'test_login', { maxRequests: 5, windowMs: 60000 });
      assert.strictEqual(res.allowed, true);
    }

    // 6th request triggers rate limit
    const blockedRes = checkRateLimit(fakeRequest(testIp), 'test_login', { maxRequests: 5, windowMs: 60000 });
    assert.strictEqual(blockedRes.allowed, false);
    assert.ok(blockedRes.retryAfterSeconds > 0);
  });
});
