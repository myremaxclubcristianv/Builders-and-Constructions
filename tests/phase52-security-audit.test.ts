import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeHtml, safeJsonLdStringify } from '../lib/sanitize';
import { getPublicClient } from '../lib/supabase';

test('PHASE 52: ADVERSARIAL DEFENSIVE SECURITY AUDIT SUITE', async (t) => {
  await t.test('1. HTML Sanitizer strips executable <script> tags and payloads', () => {
    const malicious = '<p>Normal text</p><script>alert("XSS")</script><b>Bold text</b>';
    const sanitized = sanitizeHtml(malicious);
    assert.strictEqual(sanitized.includes('<script>'), false);
    assert.strictEqual(sanitized.includes('alert("XSS")'), false);
    assert.strictEqual(sanitized.includes('<p>Normal text</p>'), true);
    assert.strictEqual(sanitized.includes('<b>Bold text</b>'), true);
  });

  await t.test('2. HTML Sanitizer strips <iframe>, <object>, <embed>, <base>, and <meta> tags', () => {
    const malicious = '<iframe src="https://evil.com"></iframe><embed src="malware.swf"><object data="exploit.pdf"></object><base href="https://evil.com"><meta http-equiv="refresh" content="0;url=evil.com">';
    const sanitized = sanitizeHtml(malicious);
    assert.strictEqual(sanitized.includes('<iframe'), false);
    assert.strictEqual(sanitized.includes('<embed'), false);
    assert.strictEqual(sanitized.includes('<object'), false);
    assert.strictEqual(sanitized.includes('<base'), false);
    assert.strictEqual(sanitized.includes('<meta'), false);
  });

  await t.test('3. HTML Sanitizer strips on* event handlers (quoted and unquoted)', () => {
    const malicious = '<img src="valid.jpg" onerror="alert(1)" onload = "malicious()" onclick=\'steal()\' onfocus=bad() />';
    const sanitized = sanitizeHtml(malicious);
    assert.strictEqual(sanitized.includes('onerror'), false);
    assert.strictEqual(sanitized.includes('onload'), false);
    assert.strictEqual(sanitized.includes('onclick'), false);
    assert.strictEqual(sanitized.includes('onfocus'), false);
  });

  await t.test('4. HTML Sanitizer neutralizes javascript: and data: pseudo-protocols in links and attributes', () => {
    const malicious = '<a href="javascript:alert(1)">Click Me</a><a href=\'javascript:void(0)\'>Link</a><a href="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">Data</a>';
    const sanitized = sanitizeHtml(malicious);
    assert.strictEqual(sanitized.includes('javascript:'), false);
    assert.strictEqual(sanitized.includes('data:text/html'), false);
    assert.strictEqual(sanitized.includes('href="#"'), true);
  });

  await t.test('5. safeJsonLdStringify escapes HTML markup and script-breaking tags', () => {
    const payload = {
      name: 'Romanian Construction</script><script>alert("PWNED")</script>',
      description: 'Building > Infrastructure & Development'
    };
    const serialized = safeJsonLdStringify(payload);
    assert.strictEqual(serialized.includes('</script>'), false);
    assert.strictEqual(serialized.includes('\\u003c/script\\u003e'), true);
    assert.strictEqual(serialized.includes('\\u003e'), true);
    assert.strictEqual(serialized.includes('\\u0026'), true);
  });

  await t.test('6. getPublicClient does not fall back to SUPABASE_SERVICE_ROLE_KEY', () => {
    const originalAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const originalService = process.env.SUPABASE_SERVICE_ROLE_KEY;

    try {
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'secret-service-role-key-test';

      const publicClient = getPublicClient();
      // Must be null if anon key is missing; must NOT instantiate with service role key
      assert.strictEqual(publicClient, null);
    } finally {
      if (originalAnon) process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalAnon;
      if (originalService) process.env.SUPABASE_SERVICE_ROLE_KEY = originalService;
    }
  });
});
