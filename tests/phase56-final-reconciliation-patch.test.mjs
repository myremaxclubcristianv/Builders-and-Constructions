import test from 'node:test';
import assert from 'node:assert/strict';
import {
  realProjectsDataset,
  realCompaniesDataset,
  realLocationsDataset,
  getCanonicalCapexSummary,
  getVerifiedHubStatistics
} from '../lib/real-romanian-data.ts';

test('PHASE 56: FINAL DATA RECONCILIATION PATCH AUDIT SUITE', async (t) => {
  await t.test('1. Podul Brăila — Canonical Deduplication Matrix', () => {
    const p1 = realProjectsDataset.find(p => p.slug === 'podul-suspendat-braila');
    const p2 = realProjectsDataset.find(p => p.slug === 'podul-suspendat-braila-webuild');
    const p3 = realProjectsDataset.find(p => p.slug === 'podul-braila-connectors');

    assert.ok(p1, 'podul-suspendat-braila must exist as canonical main contract');
    assert.ok(p2, 'podul-suspendat-braila-webuild must exist as audited contractor portfolio entry');
    assert.ok(p3, 'podul-braila-connectors must exist as audited link roads entry');

    // Canonical main contract
    assert.equal(p1.investment_eur, 500_000_000);
    assert.equal(p1.status, 'completed');

    // Duplicate contractor entry marked and documented
    assert.equal(p2.investment_eur, 500_000_000);
    assert.ok(p2.investment_label.includes('Exclus din CAPEX Net'), 'p2 must indicate exclusion from net capex');

    // Connectors entry marked as included in global contract
    assert.equal(p3.investment_eur, 500_000_000);
    assert.ok(p3.investment_label.includes('Inclus în Contractul Principal'), 'p3 must indicate inclusion in main contract');
    assert.ok(p3.investment_label.includes('Exclus din CAPEX Net'), 'p3 must indicate exclusion from net capex');

    const capex = getCanonicalCapexSummary();
    assert.equal(capex.overlaps.brailaWebuildDuplicateEur, 500_000_000, 'Webuild duplicate excluded: €500M');
    assert.equal(capex.overlaps.brailaConnectorsIncludedEur, 500_000_000, 'Connectors duplicate excluded: €500M');
  });

  await t.test('2. Silk District Iași — Masterplan & Phase 1 Reconciliation', () => {
    const phase1 = realProjectsDataset.find(p => p.slug === 'silk-district-iasi-phase-1');
    const masterplan = realProjectsDataset.find(p => p.slug === 'silk-district-iasi');

    assert.ok(phase1, 'silk-district-iasi-phase-1 must exist');
    assert.ok(masterplan, 'silk-district-iasi must exist');

    assert.equal(phase1.investment_eur, 90_000_000, 'Phase 1 delivered capex is €90M');
    assert.equal(masterplan.investment_eur, 200_000_000, 'Masterplan total capex is €200M');

    // Overlap exclusion
    const capex = getCanonicalCapexSummary();
    assert.equal(capex.overlaps.silkDistrictPhase1IncludedEur, 90_000_000, 'Phase 1 overlap excluded: €90M');
  });

  await t.test('3. CAPEX Presentation — Exact Gross, Overlaps, and Net Reconciliation', () => {
    const capex = getCanonicalCapexSummary();

    // Gross capex = €11.948B rounded to €11.95B
    assert.equal(capex.grossCapexEur, 11_948_000_000);
    assert.equal(capex.grossCapexLabel, '€11.95 MLD. EUR');

    // Total overlaps = €500M + €500M + €90M = €1.09B
    assert.equal(capex.overlaps.totalOverlapsEur, 1_090_000_000);

    // Net capex = €11.948B - €1.09B = €10.858B rounded to €10.86B
    assert.equal(capex.netReconciledCapexEur, 10_858_000_000);
    assert.equal(capex.netReconciledCapexLabel, '€10.86 MLD. EUR');

    // Category breakdown
    // Public infrastructure: €5.515B gross - €1.000B overlaps = €4.515B net (~€4.52B)
    assert.equal(capex.publicInfrastructureGrossEur, 5_515_000_000);
    assert.equal(capex.publicInfrastructureNetEur, 4_515_000_000);

    // Private real estate: €6.433B gross - €0.090B overlap = €6.343B net (~€6.34B)
    assert.equal(capex.privateRealEstateGrossEur, 6_433_000_000);
    assert.equal(capex.privateRealEstateNetEur, 6_343_000_000);

    // Math integrity check
    assert.equal(
      capex.publicInfrastructureNetEur + capex.privateRealEstateNetEur,
      capex.netReconciledCapexEur
    );
  });

  await t.test('4. Brașov — Statistical Reconciliation & Status Integrity', () => {
    const brasovProjects = realProjectsDataset.filter(
      p => /brașov|brasov/i.test(p.location) || /brașov|brasov/i.test(p.county || '')
    );

    assert.equal(brasovProjects.length, 4, 'Exactly 4 projects indexed for Brașov');

    const vgp = brasovProjects.find(p => p.slug === 'vgp-park-brasov');
    const hospital = brasovProjects.find(p => p.slug === 'spitalul-pneumoftiziologie-brasov');
    const afi = brasovProjects.find(p => p.slug === 'afi-park-brasov');
    const maurer = brasovProjects.find(p => p.slug === 'maurer-residence-brasov');

    assert.ok(vgp && hospital && afi && maurer, 'All 4 Brașov projects must be identified');

    assert.equal(hospital.status, 'under_construction', 'Spitalul Pneumoftiziologie is under construction');
    assert.equal(vgp.status, 'completed', 'VGP Park Brașov is completed');
    assert.equal(afi.status, 'completed', 'AFI Park Brașov is completed');
    assert.equal(maurer.status, 'partially_delivered', 'Maurer Residence Brașov is partially delivered');

    // Verified Hub Statistics
    const hubStats = getVerifiedHubStatistics();
    const brasovHub = hubStats.find(h => h.slug === 'brasov');
    assert.ok(brasovHub, 'Brașov hub statistic exists');
    assert.equal(brasovHub.indexedCount, 4);
    assert.equal(brasovHub.activeCount, 1);
    assert.equal(brasovHub.deliveredCount, 2);
    assert.equal(brasovHub.partiallyDeliveredCount, 1);
    assert.equal(
      brasovHub.activeCount + brasovHub.deliveredCount + brasovHub.partiallyDeliveredCount,
      brasovHub.indexedCount,
      'Brașov mathematical reconciliation: 1 active + 2 delivered + 1 phased = 4 indexed'
    );

    // Location dataset
    const brasovLoc = realLocationsDataset.find(l => l.slug === 'brasov');
    assert.ok(brasovLoc);
    assert.equal(brasovLoc.projects_count, 4);
    assert.equal(brasovLoc.active_sites_count, 1);
  });

  await t.test('5. System Invariants — 76 Projects and 143 Companies Preserved', () => {
    assert.equal(realProjectsDataset.length, 76, 'Dataset must preserve exactly 76 projects');
    assert.equal(realCompaniesDataset.length, 143, 'Dataset must preserve exactly 143 companies');
  });
});
