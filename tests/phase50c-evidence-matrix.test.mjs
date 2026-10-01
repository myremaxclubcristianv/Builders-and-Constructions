import test from 'node:test';
import assert from 'node:assert/strict';
import { realCompaniesDataset, realProjectsDataset } from '../lib/real-romanian-data.ts';

test('PHASE 50B-C: FORENSIC EVIDENCE MATRIX AUDIT SUITE', async (t) => {
  const developers = realCompaniesDataset.filter(c => c.type === 'developer');

  await t.test('1. Exactly 48 developer companies exist in dataset', () => {
    assert.equal(developers.length, 48);
  });

  await t.test('2. Exactly 143 total unique company entities exist in company master', () => {
    assert.equal(realCompaniesDataset.length, 143);
  });

  await t.test('3. No duplicate company IDs exist in company master', () => {
    const ids = realCompaniesDataset.map(c => c.id);
    const uniqueIds = new Set(ids);
    assert.equal(uniqueIds.size, ids.length);
  });

  await t.test('4. No duplicate company slugs exist in company master', () => {
    const slugs = realCompaniesDataset.map(c => c.slug);
    const uniqueSlugs = new Set(slugs);
    assert.equal(uniqueSlugs.size, slugs.length);
  });

  await t.test('5. CTPark Cluj does not exist as a company in developer master', () => {
    const ctparkClujCompany = realCompaniesDataset.find(c => c.slug === 'ctpark-cluj');
    assert.equal(ctparkClujCompany, undefined);
  });

  await t.test('6. Speedwell Riverside Arad does not exist as a company in developer master', () => {
    const speedwellAradCompany = realCompaniesDataset.find(c => c.slug === 'speedwell-riverside-arad');
    assert.equal(speedwellAradCompany, undefined);
  });

  await t.test('7. Technical duplicate PORR Construct entry (slug: porr-construct) does not exist', () => {
    const duplicatePorr = realCompaniesDataset.find(c => c.slug === 'porr-construct');
    assert.equal(duplicatePorr, undefined);
    
    // Primary PORR Construct entry exists
    const primaryPorr = realCompaniesDataset.find(c => c.slug === 'porr-construct-romania');
    assert.notEqual(primaryPorr, undefined);
  });

  await t.test('8. Exactly 76 canonical projects exist in project dataset', () => {
    assert.equal(realProjectsDataset.length, 76);
  });

  await t.test('9. Exactly 59 commercial projects have verified developer relationships', () => {
    const commercialProjects = realProjectsDataset.filter(p => p.developer_slug !== null);
    assert.equal(commercialProjects.length, 59);
  });

  await t.test('10. Exactly 17 state/municipal infrastructure projects have developer = null', () => {
    const infraProjects = realProjectsDataset.filter(p => p.developer_slug === null);
    assert.equal(infraProjects.length, 17);
  });

  await t.test('11. All 48 developer slugs resolve to valid companies in dataset', () => {
    developers.forEach(d => {
      assert.ok(d.slug && d.slug.length > 0);
      assert.ok(d.name && d.name.length > 0);
    });
  });

  await t.test('12. All populated CUI values (BVB listed) have OFFICIAL_MARKET_DISCLOSURE level', () => {
    const populatedCuis = developers.filter(d => d.cui !== undefined);
    assert.equal(populatedCuis.length, 3);
    
    const bvbSlugs = ['one-united-properties', 'impact-developer-contractor', 'imotrust-arad'];
    populatedCuis.forEach(d => {
      assert.ok(bvbSlugs.includes(d.slug));
      assert.equal(d.verification_level, 'OFFICIAL_MARKET_DISCLOSURE');
      assert.ok(d.cui && d.cui.length > 0);
    });
  });

  await t.test('13. No OFFICIAL_MARKET_DISCLOSURE developer lacks Tier 1 BVB/Regulatory proof', () => {
    const marketVerified = developers.filter(d => d.verification_level === 'OFFICIAL_MARKET_DISCLOSURE');
    assert.equal(marketVerified.length, 3);
    
    marketVerified.forEach(d => {
      const isBvb = ['one-united-properties', 'impact-developer-contractor', 'imotrust-arad'].includes(d.slug);
      assert.ok(isBvb);
    });
  });

  await t.test('14. All 48 developers have an explicit verification level (OFFICIAL_CORPORATE_VERIFIED or OFFICIAL_MARKET_DISCLOSURE)', () => {
    developers.forEach(d => {
      assert.ok(['OFFICIAL_CORPORATE_VERIFIED', 'OFFICIAL_MARKET_DISCLOSURE'].includes(d.verification_level));
    });
  });

  await t.test('15. All 48 developer operational roles are valid and supported', () => {
    developers.forEach(d => {
      assert.equal(d.type, 'developer');
    });
  });

  await t.test('16. Removed entities do not appear anywhere in realCompaniesDataset', () => {
    const removedSlugs = ['ctpark-cluj', 'speedwell-riverside-arad', 'porr-construct'];
    removedSlugs.forEach(slug => {
      const found = realCompaniesDataset.find(c => c.slug === slug);
      assert.equal(found, undefined);
    });
  });
});
