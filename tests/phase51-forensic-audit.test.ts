import test from 'node:test';
import assert from 'node:assert/strict';
import { realProjectsDataset, realCompaniesDataset } from '../lib/real-romanian-data';
import { mappedRealProjects } from '../lib/data';
import { REAL_CONSTRUCTIONS_VIDEOS, getVerifiedVideos } from '../lib/video-data';

test('PHASE 51: Project count reconciliation', (t) => {
  assert.equal(realProjectsDataset.length, 76, 'Canonical dataset must contain exactly 76 projects');
  assert.equal(mappedRealProjects.length, 76, 'Mapped project dataset must contain exactly 76 projects');
  
  const commercial = realProjectsDataset.filter(p => p.developer_slug !== null && p.developer_slug !== undefined && p.developer_slug !== '');
  const infra = realProjectsDataset.filter(p => !p.developer_slug || p.developer_slug === null);
  
  assert.equal(commercial.length, 59, 'Commercial developments with assigned developer count must be 59');
  assert.equal(infra.length, 17, 'Public/state infrastructure projects count must be 17');
  assert.equal(commercial.length + infra.length, 76, 'Sum of commercial + infra must equal 76');
});

test('PHASE 51: Infrastructure units and physical dimensions', (t) => {
  // A7 Moldovei
  const a7 = realProjectsDataset.find(p => p.slug === 'autostrada-a7-moldovei-umb');
  assert.ok(a7, 'A7 Moldovei must exist');
  assert.equal(a7?.surface_area_sqm, undefined, 'A7 must NOT have surface_area_sqm');
  assert.equal(a7?.infrastructure_length_km, 255.7, 'A7 must have infrastructure_length_km of 255.7 for all 10 UMB lots');
  assert.ok(a7?.description?.includes('255.7 km'), 'A7 description must specify 255.7 km scope across 10 UMB lots');

  // A1 Sibiu-Pitesti Sec 5
  const a1Sec5 = realProjectsDataset.find(p => p.slug === 'a1-highway-sibiu-pitesti');
  assert.ok(a1Sec5, 'A1 Sec 5 must exist');
  assert.equal(a1Sec5?.surface_area_sqm, undefined);
  assert.equal(a1Sec5?.infrastructure_length_km, 30.35);

  // A1 Lot 4
  const a1Lot4 = realProjectsDataset.find(p => p.slug === 'autostrada-a1-lot-4-porr');
  assert.ok(a1Lot4, 'A1 Lot 4 must exist');
  assert.equal(a1Lot4?.surface_area_sqm, undefined);
  assert.equal(a1Lot4?.infrastructure_length_km, 9.86);

  // A1 Lot 1
  const a1Lot1 = realProjectsDataset.find(p => p.slug === 'autostrada-a1-sibiu-boita');
  assert.ok(a1Lot1, 'A1 Lot 1 must exist');
  assert.equal(a1Lot1?.surface_area_sqm, undefined);
  assert.equal(a1Lot1?.infrastructure_length_km, 13.17);

  // A3 Nadaselu
  const a3 = realProjectsDataset.find(p => p.slug === 'autostrada-a3-nadaselu-mihaiesti');
  assert.ok(a3, 'A3 must exist');
  assert.equal(a3?.surface_area_sqm, undefined);
  assert.equal(a3?.infrastructure_length_km, 16.8);

  // M6 Lot 1
  const m6 = realProjectsDataset.find(p => p.slug === 'metrou-m6-lot-1-tokyo');
  assert.ok(m6, 'M6 must exist');
  assert.equal(m6?.surface_area_sqm, undefined);
  assert.equal(m6?.infrastructure_length_km, 6.6);

  // M5
  const m5 = realProjectsDataset.find(p => p.slug === 'metrou-m5-raul-doamnei-eroilor');
  assert.ok(m5, 'M5 must exist');
  assert.equal(m5?.surface_area_sqm, undefined);
  assert.equal(m5?.infrastructure_length_km, 6.9);

  // Braila Bridge
  const braila = realProjectsDataset.find(p => p.slug === 'podul-suspendat-braila-webuild');
  assert.ok(braila, 'Braila bridge must exist');
  assert.equal(braila?.surface_area_sqm, undefined);
  assert.equal(braila?.span_length_m, 1974);
  assert.equal(braila?.infrastructure_length_km, 1.974);

  // Steaua Stadium
  const steaua = realProjectsDataset.find(p => p.slug === 'stadionul-steaua-ghencea');
  assert.ok(steaua, 'Steaua stadium must exist');
  assert.equal(steaua?.unit_count, undefined);
  assert.equal(steaua?.capacity_seats, 31254);
});

test('PHASE 51: Video feed isolation (zero foreign UAE video in Romanian feed)', async (t) => {
  const verifiedVideos = await getVerifiedVideos();
  const foreignVideoId = 'qUXVPi9sN84';
  
  const foundInVerified = verifiedVideos.some(v => v.id === foreignVideoId);
  assert.equal(foundInVerified, false, 'UAE Reportage video must not appear in verified Romanian feed');
  
  const foundInRealDataset = REAL_CONSTRUCTIONS_VIDEOS.some(v => v.id === foreignVideoId);
  assert.equal(foundInRealDataset, false, 'UAE Reportage video must not appear in REAL_CONSTRUCTIONS_VIDEOS');
  
  // Also verify that no video in REAL_CONSTRUCTIONS_VIDEOS mentions UAE/Dubai/Abu Dhabi
  for (const v of REAL_CONSTRUCTIONS_VIDEOS) {
    const text = `${v.title} ${v.description}`.toLowerCase();
    assert.ok(!text.includes('abu dhabi') && !text.includes('yas island') && !text.includes('reportage'), `Video ${v.id} contains foreign UAE text`);
  }
});

test('PHASE 51: Company entity truth state and group governance', (t) => {
  assert.equal(realCompaniesDataset.length, 143, 'Total unique companies in company master must be 143');
  
  // Exactly 3 BVB listed entities carry OFFICIAL_MARKET_DISCLOSURE (BVB filings inspected)
  const marketVerified = realCompaniesDataset.filter(c => c.verification_level === 'OFFICIAL_MARKET_DISCLOSURE');
  assert.equal(marketVerified.length, 3, 'Only 3 BVB listed entities have OFFICIAL_MARKET_DISCLOSURE');
  const bvbSlugs = ['one-united-properties', 'impact-developer-contractor', 'imotrust-arad'];
  marketVerified.forEach(c => {
    assert.ok(bvbSlugs.includes(c.slug), `${c.slug} must be a BVB listed entity`);
  });

  // Zero entities carry OFFICIAL_REGISTRY_VERIFIED since direct ONRC extracts were not ingested
  const registryVerified = realCompaniesDataset.filter(c => c.verification_level === 'OFFICIAL_REGISTRY_VERIFIED');
  assert.equal(registryVerified.length, 0, 'No entity falsely claims OFFICIAL_REGISTRY_VERIFIED without direct registry extract');

  // All other 140 companies have OFFICIAL_CORPORATE_VERIFIED (95) or OFFICIAL_VERIFIED (45)
  const nonMarketVerified = realCompaniesDataset.filter(c => c.verification_level !== 'OFFICIAL_MARKET_DISCLOSURE');
  assert.equal(nonMarketVerified.length, 140);
  nonMarketVerified.forEach(c => {
    assert.ok(['OFFICIAL_CORPORATE_VERIFIED', 'OFFICIAL_VERIFIED'].includes(c.verification_level));
  });
  
  // One United Properties
  const oup = realCompaniesDataset.find(c => c.slug === 'one-united-properties');
  assert.ok(oup);
  assert.equal(oup?.cui, '22767862');
  assert.equal(oup?.verification_level, 'OFFICIAL_MARKET_DISCLOSURE');
  assert.ok(oup?.ownership_structure?.includes('BVB: ONE'));
  
  // Nordis Group
  const nordis = realCompaniesDataset.find(c => c.slug === 'nordis-group');
  assert.ok(nordis);
  assert.equal(nordis?.verification_level, 'OFFICIAL_CORPORATE_VERIFIED', 'Nordis has corporate verification level without false registry claim');
  assert.equal(nordis?.cui, undefined, 'Nordis commercial group does not fabricate an unverified single-entity CUI');
  
  // CTP Romania
  const ctp = realCompaniesDataset.find(c => c.slug === 'ctp-invest-romania' || c.slug === 'ctp-romania');
  assert.ok(ctp);
  assert.equal(ctp?.verification_level, 'OFFICIAL_CORPORATE_VERIFIED');
  assert.ok(ctp?.ownership_structure?.includes('CTP N.V.') || ctp?.headquarters?.includes('Netherlands') || ctp?.description?.includes('CTP N.V.') || ctp?.name?.includes('CTP'));
});
