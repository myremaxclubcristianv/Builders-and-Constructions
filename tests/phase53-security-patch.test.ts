import test from 'node:test';
import assert from 'node:assert/strict';
import { checkRateLimit, getClientIp } from '../lib/rate-limit';

test('PHASE 53: SECURITY PATCH MICRO-AUDIT VERIFICATION SUITE', async (t) => {
  await t.test('1. Rate Limiter accurately resolves client IP from Vercel headers', () => {
    // Case A: x-real-ip
    const req1 = new Request('https://constructions.cristianvaduva.com/api/inquiries', {
      headers: { 'x-real-ip': '198.51.100.1' }
    });
    assert.strictEqual(getClientIp(req1), '198.51.100.1');

    // Case B: x-vercel-ip
    const req2 = new Request('https://constructions.cristianvaduva.com/api/inquiries', {
      headers: { 'x-vercel-ip': '198.51.100.2' }
    });
    assert.strictEqual(getClientIp(req2), '198.51.100.2');

    // Case C: x-forwarded-for chain
    const req3 = new Request('https://constructions.cristianvaduva.com/api/inquiries', {
      headers: { 'x-forwarded-for': '198.51.100.3, 10.0.0.1, 10.0.0.2' }
    });
    assert.strictEqual(getClientIp(req3), '198.51.100.3');
  });

  await t.test('2. Rate Limiter permits within limit and blocks on threshold with 429 Retry-After', () => {
    const testIp = '203.0.113.99';
    const req = new Request('https://constructions.cristianvaduva.com/api/inquiries', {
      headers: { 'x-real-ip': testIp }
    });

    const endpoint = `test_inquiries_${Date.now()}`;
    const options = { maxRequests: 3, windowMs: 60 * 1000 };

    // Request 1: Allowed
    const res1 = checkRateLimit(req, endpoint, options);
    assert.strictEqual(res1.allowed, true);
    assert.strictEqual(res1.remaining, 2);

    // Request 2: Allowed
    const res2 = checkRateLimit(req, endpoint, options);
    assert.strictEqual(res2.allowed, true);
    assert.strictEqual(res2.remaining, 1);

    // Request 3: Allowed
    const res3 = checkRateLimit(req, endpoint, options);
    assert.strictEqual(res3.allowed, true);
    assert.strictEqual(res3.remaining, 0);

    // Request 4: Blocked (429)
    const res4 = checkRateLimit(req, endpoint, options);
    assert.strictEqual(res4.allowed, false);
    assert.strictEqual(res4.remaining, 0);
    assert.strictEqual(res4.retryAfterSeconds > 0, true);
    assert.strictEqual(res4.retryAfterSeconds <= 60, true);
  });

  await t.test('3. Rate Limiter isolates limits between endpoints and client IPs', () => {
    const ipA = '192.0.2.10';
    const ipB = '192.0.2.20';
    const endpoint = `endpoint_iso_${Date.now()}`;
    const options = { maxRequests: 1, windowMs: 60 * 1000 };

    const reqA = new Request('https://constructions.cristianvaduva.com/api/claims', {
      headers: { 'x-real-ip': ipA }
    });
    const reqB = new Request('https://constructions.cristianvaduva.com/api/claims', {
      headers: { 'x-real-ip': ipB }
    });

    // Client A consumes quota
    assert.strictEqual(checkRateLimit(reqA, endpoint, options).allowed, true);
    assert.strictEqual(checkRateLimit(reqA, endpoint, options).allowed, false);

    // Client B is unaffected
    assert.strictEqual(checkRateLimit(reqB, endpoint, options).allowed, true);
  });
});
