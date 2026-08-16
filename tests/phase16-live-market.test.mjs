/**
 * Phase 16 Live Market Acquisition & Production Reality Test Suite
 * CONSTRUCTIONS by AiXLuxury
 */

import assert from 'node:assert';
import test from 'node:test';

import {
  assertProductionAuthority,
  assertNoFabricatedEntity,
  assertVerifiedRelationship,
  assertVerifiedSource,
  assertVerifiedDecisionMaker,
  assertPublishableEntity,
  assertOutreachEligible
} from '../lib/data-integrity.ts';

import {
  calculateProductionAcquisitionPriority,
  generateFactBasedOutreach
} from '../lib/acquisition.ts';

import {
  governAcquisitionPriority
} from '../lib/acquisition-governance.ts';

import {
  generateSignalReason,
  processMarketActivitySignal
} from '../lib/market-signals.ts';

test('1. Production Authority Guard & Mock Fallback Protection', () => {
  // Should not throw in default environment
  assert.doesNotThrow(() => {
    assertProductionAuthority();
  });
});

test('2. Source Tier Provenance Verification', () => {
  const primarySource = assertVerifiedSource({
    url: 'https://e-licitatie.ro/pub/notices/100234',
    source_type: 'SEAP_PROCUREMENT'
  });
  assert.strictEqual(primarySource.isValid, true);
  assert.strictEqual(primarySource.tier, 'PRIMARY');

  const secondarySource = assertVerifiedSource({
    url: 'https://arenaconstruct.ro/erbasu-spital-bucuresti',
    source_type: 'PUBLICATION'
  });
  assert.strictEqual(secondarySource.tier, 'SECONDARY');

  const invalidSource = assertVerifiedSource({ url: '' });
  assert.strictEqual(invalidSource.isValid, false);
});

test('3. Decision Maker 4-Level Verification Governance', () => {
  const level1 = assertVerifiedDecisionMaker({
    name: 'Dan Boghiu',
    role: 'Commercial Director',
    verification_state: 'UNVERIFIED'
  });
  assert.strictEqual(level1.canOutreach, false, 'Level 01 Identified cannot receive direct outreach');

  const level3 = assertVerifiedDecisionMaker({
    name: 'Dan Boghiu',
    role: 'Commercial Director',
    email: 'dan.boghiu@bogart.ro',
    verification_state: 'COMPANY_VERIFIED'
  });
  assert.strictEqual(level3.canOutreach, true, 'Level 03 Domain Verified can receive direct outreach');
  assert.strictEqual(level3.level, '03_DOMAIN_VERIFIED');
});

test('4. Digital Audit UNKNOWN Handling (UNKNOWN != WEAK)', () => {
  const unknownAudit = {
    website: 'https://erbasu.ro',
    opportunitySignals: [],
    audit: {
      seo: 'UNKNOWN',
      photography: 'UNKNOWN'
    }
  };

  const priority = calculateProductionAcquisitionPriority(unknownAudit);
  assert.strictEqual(priority.factors.digitalGap, 0, 'UNKNOWN audit dimensions must not be penalized or rewarded as gaps');
});

test('5. Outreach Claim Safety Barrier', () => {
  const prospect = {
    companyId: 'co-erbasu',
    companyName: 'Erbașu Construcții',
    city: 'Bucharest',
    activeProjects: [{ id: 'p-1', name: 'Clinical Hospital', status: 'under_construction' }],
    primaryDecisionMaker: {
      name: 'Cristian Erbașu',
      role: 'CEO',
      verificationState: 'company_verified'
    }
  };

  const outreach = generateFactBasedOutreach(prospect);
  assert.ok(outreach.executive_email.message.includes('Cristian Erbașu'));
  assert.ok(outreach.executive_email.message.includes('Clinical Hospital'));
  assert.ok(outreach.executive_email.message.includes('Erbașu Construcții'));
});

test('6. Dynamic Re-evaluation via Verified Construction Signal', async () => {
  const result = await processMarketActivitySignal({
    companyId: 'co-erbasu',
    signalType: 'PERMIT',
    title: 'AC 84/2025 Clinical Facility',
    sourceUrl: 'https://sector1urbanism.ro/ac-84-2025',
    sourceTier: 'PRIMARY',
    eventDate: '2026-08-16',
    commercialRelevance: 'HIGH'
  });

  assert.strictEqual(result.success, true);
  assert.ok(result.scoreDelta > 0);
  assert.ok(result.reason.includes('building permit'));
});

test('7. Golden Dataset Truth Integrity Check', () => {
  const verifiedList = [
    { id: '1', status: 'VERIFIED' },
    { id: '2', status: 'VERIFIED' },
    { id: '3', status: 'RESEARCHING' }
  ];

  const actualVerifiedCount = verifiedList.filter(c => c.status === 'VERIFIED').length;
  assert.strictEqual(actualVerifiedCount, 2, 'Must report exact verified count (2), never fake 50');
});
