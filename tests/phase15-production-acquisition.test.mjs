/**
 * Phase 15 Production Acquisition & Revenue Attribution Test Suite
 * CONSTRUCTIONS by AiXLuxury
 */

import assert from 'node:assert';
import test from 'node:test';

import {
  governAcquisitionPriority
} from '../lib/acquisition-governance.ts';

import {
  generateSignalReason,
  processMarketActivitySignal
} from '../lib/market-signals.ts';

import {
  assertNoFabricatedEntity,
  assertVerifiedRelationship,
  assertProductionAuthority,
  assertOutreachEligible
} from '../lib/data-integrity.ts';

import {
  generateFactBasedOutreach
} from '../lib/acquisition.ts';

test('1. Production Acquisition Governance & High Confidence Verdict', () => {
  const verifiedProspect = {
    companyId: 'co-erbasu',
    companyName: 'Erbașu Construcții',
    companyType: 'General Contractor',
    city: 'Bucharest',
    county: 'Bucharest',
    website: 'https://erbasu.ro',
    websiteStatus: 'weak',
    websiteVerification: 'verified',
    activeProjects: [
      { id: 'p1', name: 'Clinical Hospital Facility', status: 'under_construction' },
      { id: 'p2', name: 'Campus Complex', status: 'under_construction' }
    ],
    primaryDecisionMaker: {
      name: 'Cristian Erbașu',
      role: 'CEO',
      phone: '+40 21 232 3000',
      email: 'cristian.erbasu@erbasu.ro',
      verificationState: 'company_verified'
    },
    baseOpportunityScore: 85,
    opportunitySignals: ['Weak project presentation', 'No lead funnel']
  };

  const governed = governAcquisitionPriority(verifiedProspect);

  assert.ok(governed.totalScore >= 75, 'Must achieve high priority score');
  assert.strictEqual(governed.confidence, 'HIGH', 'Must be categorized as HIGH confidence');
  assert.strictEqual(governed.verdict, 'YES — CONTACT NOW', 'Must generate clear YES verdict');
  assert.ok(governed.factors.constructionActivity > 0);
});

test('2. Hard Blocker & Disqualification Governance', () => {
  const disqualifiedProspect = {
    companyId: 'co-blocked',
    companyName: 'Blocked Contractor SRL',
    isNotAFit: true
  };

  const governed = governAcquisitionPriority(disqualifiedProspect);

  assert.strictEqual(governed.totalScore, 0, 'Disqualified must score 0');
  assert.strictEqual(governed.confidence, 'DISQUALIFIED', 'Must be flagged DISQUALIFIED');
  assert.strictEqual(governed.verdict, 'NO — DO NOT CONTACT', 'Verdict must be NO');
});

test('3. Signal-Triggered Re-evaluation & Audit Explanations', () => {
  const permitSignal = {
    signalType: 'PERMIT',
    title: 'AC 84/2025 Clinical Complex',
    commercialRelevance: 'HIGH'
  };

  const reason = generateSignalReason(permitSignal);
  assert.ok(reason.includes('HIGH IMPACT'), 'Must reflect commercial impact tier');
  assert.ok(reason.includes('building permit'), 'Must cite verified permit');
});

test('4. Signal Processing Ingestion Integrity', async () => {
  const result = await processMarketActivitySignal({
    companyId: 'co-erbasu',
    signalType: 'CONTRACT_AWARD',
    title: 'SEAP Award €42M Hospital',
    sourceUrl: 'https://e-licitatie.ro/100234',
    sourceTier: 'PRIMARY',
    eventDate: '2026-08-16',
    commercialRelevance: 'CRITICAL'
  });

  assert.strictEqual(result.success, true);
  assert.ok(result.scoreDelta > 0, 'Critical signal must increase opportunity score');
  assert.ok(result.reason.includes('tender award'));
});

test('5. Rejection of Signal without Source Evidence', async () => {
  await assert.rejects(
    async () => {
      await processMarketActivitySignal({
        companyId: 'co-1',
        signalType: 'PERMIT',
        title: 'Unverified rumor',
        sourceUrl: '',
        sourceTier: 'TERTIARY',
        eventDate: '2026-08-16',
        commercialRelevance: 'LOW'
      });
    },
    { message: /Verified source URL is required/ }
  );
});

test('6. Complete Outreach Traceability Chain', () => {
  const outreach = generateFactBasedOutreach({
    companyId: 'co-bogart',
    companyName: 'Bog\'Art',
    city: 'Bucharest',
    activeProjects: [{ id: 'p-4', name: 'Riverside Quarter', status: 'under_construction' }],
    primaryDecisionMaker: {
      name: 'Dan Boghiu',
      role: 'Commercial Director',
      verificationState: 'company_verified'
    }
  });

  assert.ok(outreach.executive_email.message.includes('Dan Boghiu'));
  assert.ok(outreach.executive_email.message.includes('Riverside Quarter'));
  assert.ok(outreach.whatsapp.message.includes('Bog\'Art'));
});
