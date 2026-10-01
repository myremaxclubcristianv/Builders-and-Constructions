import test from 'node:test';
import assert from 'node:assert/strict';
import { validateSourceUrl, computeContentHash, processRawSourcePayload } from '../lib/source-adapters/index.ts';
import { resolveCompanyEntity } from '../lib/entity-resolution.ts';
import { generateDeterministicWhyNow } from '../lib/why-now.ts';

test('Phase 44: Source URL Allowlist & SSRF Security Guard', () => {
  // Valid allowlisted domains
  const validUrl = validateSourceUrl('https://constructions.cristianvaduva.com/signals');
  assert.equal(validUrl.isValid, true);

  const validYt = validateSourceUrl('https://www.youtube.com/watch?v=12345');
  assert.equal(validYt.isValid, true);

  // SSRF Localhost / Private IP Rejection
  const ssrfLocal = validateSourceUrl('http://localhost:3000/admin');
  assert.equal(ssrfLocal.isValid, false);
  assert.match(ssrfLocal.reason, /SSRF Guard/);

  const ssrfIp = validateSourceUrl('http://127.0.0.1/secret');
  assert.equal(ssrfIp.isValid, false);

  const ssrfPrivateNet = validateSourceUrl('http://192.168.1.1/router');
  assert.equal(ssrfPrivateNet.isValid, false);

  // Non-allowlisted domain rejection
  const unallowedDomain = validateSourceUrl('https://untrusted-third-party-site.com/data');
  assert.equal(unallowedDomain.isValid, false);
  assert.match(unallowedDomain.reason, /allowlist/);
});

test('Phase 44: Content Hash Deduplication & Idempotency', () => {
  const payload1 = { title: 'New Permit Issued', permitNo: '123/2026', entity: 'Nordis' };
  const payload2 = { entity: 'Nordis', permitNo: '123/2026', title: 'New Permit Issued' };

  const hash1 = computeContentHash(payload1);
  const hash2 = computeContentHash(payload2);

  // Keys in different order produce identical content hash
  assert.equal(hash1, hash2);
  assert.equal(hash1.length, 64); // SHA256 hex string
});

test('Phase 44: Hierarchical Entity Resolution (CUI -> Domain -> Name)', () => {
  const mockCanonical = [
    { id: 'c-1', name: 'Bog-Art Building Management', cui_cif: 'RO123456', official_website: 'https://bogart.ro' },
    { id: 'c-2', name: 'Nordis Group', cui_cif: 'RO987654', official_website: 'https://nordis.ro' }
  ];

  // 1. CUI Match
  const resCui = resolveCompanyEntity({ rawName: 'Random Trade Name', rawCui: '123456' }, mockCanonical);
  assert.equal(resCui.canonicalId, 'c-1');
  assert.equal(resCui.resolutionMethod, 'CUI_MATCH');

  // 2. Domain Match
  const resDom = resolveCompanyEntity({ rawName: 'Nordis Agency', rawDomain: 'nordis.ro' }, mockCanonical);
  assert.equal(resDom.canonicalId, 'c-2');
  assert.equal(resDom.resolutionMethod, 'DOMAIN_MATCH');

  // 3. Normalized Name Match
  const resName = resolveCompanyEntity({ rawName: "Bog'Art Building Management" }, mockCanonical);
  assert.equal(resName.canonicalId, 'c-1');
  assert.equal(resName.resolutionMethod, 'NORMALIZED_NAME_MATCH');

  // 4. Unresolved Fallback
  const resUnknown = resolveCompanyEntity({ rawName: 'Unknown Enterprise LLC' }, mockCanonical);
  assert.equal(resUnknown.canonicalId, null);
  assert.equal(resUnknown.resolutionMethod, 'UNRESOLVED');
});

test('Phase 44: Deterministic Why-Now Calculation', () => {
  const whyNow = generateDeterministicWhyNow({
    companyName: 'Bog-Art',
    latestPermit: { permitNumber: 'BUCH-992', projectName: 'Office Tower Phase 1', issueDate: '2026-08-30' }
  });

  assert.equal(whyNow.urgency, 'HIGH');
  assert.match(whyNow.primaryReason, /BUCH-992/);
});
