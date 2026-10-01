import test from 'node:test';
import assert from 'node:assert/strict';
import { validateSourceUrl, computeContentHash, processRawSourcePayload } from '../lib/source-adapters/index.ts';
import { resolveCompanyEntity } from '../lib/entity-resolution.ts';
import { executeOperationalPipeline } from '../lib/operational-pipeline.ts';

test('Phase 45: SSRF Security Protocol & Allowlist Verification', () => {
  // Reject HTTP non-allowlisted
  const res1 = validateSourceUrl('http://malicious-external-domain.com');
  assert.equal(res1.isValid, false);

  // Reject internal loopback & RFC1918 private IPs
  const res2 = validateSourceUrl('http://127.0.0.1/admin');
  assert.equal(res2.isValid, false);

  const res3 = validateSourceUrl('http://10.0.1.5/internal');
  assert.equal(res3.isValid, false);

  // Allow legitimate production host
  const res4 = validateSourceUrl('https://constructions.cristianvaduva.com/signals');
  assert.equal(res4.isValid, true);
});

test('Phase 45: Content Hash Determinism & Idempotency Model', () => {
  const p1 = { source: 'SEAP', awardAmount: 1500000, company: 'Erbașu Edilkonstrukt' };
  const p2 = { company: 'Erbașu Edilkonstrukt', source: 'SEAP', awardAmount: 1500000 };

  const hash1 = computeContentHash(p1);
  const hash2 = computeContentHash(p2);

  assert.equal(hash1, hash2);
  assert.equal(hash1.length, 64);
});

test('Phase 45: Operational Pipeline Execution Trace', async () => {
  const result = await executeOperationalPipeline({
    sourceName: 'SEAP Tender Award Notice',
    sourceType: 'PUBLIC_REGISTRY',
    sourceUrl: 'https://seap.ro/notice/award-test-2026',
    triggerType: 'SYSTEM',
    entityNameCandidate: 'Erbașu Edilkonstrukt',
    domainCandidate: 'erbasu.ro',
    eventType: 'TENDER_AWARDED',
    evidenceText: 'Verified tender award notice for municipal infrastructure.',
    commercialRelevance: 'HIGH',
    rawPayload: {
      awardId: 'SEAP-2026-881',
      tenderName: 'District Heating Rehabilitation',
      entityName: 'Erbașu Edilkonstrukt'
    }
  });

  assert.equal(result.success, true);
  assert.equal(typeof result.jobId, 'string');
  assert.equal(typeof result.observationId, 'string');
  assert.equal(result.resolvedEntityName, 'Erbașu Edilkonstrukt');
  assert.equal(result.resolutionMethod, 'DOMAIN_MATCH');
  assert.equal(typeof result.signalId, 'string');
  assert.equal(typeof result.whyNowReason, 'string');
});
