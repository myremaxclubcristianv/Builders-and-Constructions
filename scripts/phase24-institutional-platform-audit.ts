import { realCompaniesDataset, realProjectsDataset, realLocationsDataset } from '../lib/real-romanian-data';
import { REAL_CONSTRUCTIONS_VIDEOS } from '../lib/video-data';

function normalizeDiacritics(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ș/g, 's')
    .replace(/ț/g, 't')
    .replace(/ă/g, 'a')
    .replace(/â/g, 'a')
    .replace(/î/g, 'i');
}

async function auditPhase24InstitutionalPlatform() {
  console.log('===========================================================');
  console.log(' CONSTRUCTIONS PHASE 24 — INSTITUTIONAL PLATFORM AUDIT     ');
  console.log('===========================================================');

  // 1. BASELINE DATASET AUDIT
  const devCount = realCompaniesDataset.filter(c => c.type === 'developer').length;
  const agencyCount = realCompaniesDataset.filter(c => c.type === 'real_estate_agency').length;
  const contractorCount = realCompaniesDataset.filter(c => c.type === 'general_contractor' || c.type === 'construction_company' || c.type === 'infrastructure').length;
  const architectCount = realCompaniesDataset.filter(c => c.type === 'architecture').length;
  const engineerCount = realCompaniesDataset.filter(c => c.type === 'engineering' || c.type === 'structural_engineering' || c.type === 'mep').length;

  console.log('\n[1/6] VERIFIED BASELINE INTEGRITY AUDIT:');
  console.log(`  Total Indexed Entities (Companies): ${realCompaniesDataset.length} (Target: 146)`);
  console.log(`    - Developers:                     ${devCount} (Target: 50)`);
  console.log(`    - Real Estate Agencies:           ${agencyCount} (Target: 20)`);
  console.log(`    - General & Spec. Contractors:    ${contractorCount} (Target: 30)`);
  console.log(`    - Architecture Practices:         ${architectCount} (Target: 21)`);
  console.log(`    - Engineering Consultancies:      ${engineerCount} (Target: 25)`);
  console.log(`  Total Construction Projects:        ${realProjectsDataset.length} (Target: 76)`);
  console.log(`  Total Regional Market Hubs:         ${realLocationsDataset.length} (Target: 36)`);

  const passesBaseline = (
    realCompaniesDataset.length === 146 &&
    devCount === 50 &&
    agencyCount === 20 &&
    contractorCount === 30 &&
    architectCount === 21 &&
    engineerCount === 25 &&
    realProjectsDataset.length === 76 &&
    realLocationsDataset.length === 36
  );

  if (passesBaseline) {
    console.log('  ✓ Baseline counts match exact target baseline 100%.');
  } else {
    console.error('  ❌ Baseline dataset count mismatch!');
  }

  // 2. DISCOVERY TERMINAL & SEARCH AUDIT
  console.log('\n[2/6] SEARCH TERMINAL & DIACRITICS AUDIT:');
  const erbasuMatch = realCompaniesDataset.find(c => normalizeDiacritics(c.name).includes('erbasu'));
  const timisoaraMatch = realCompaniesDataset.find(c => normalizeDiacritics(c.location).includes('timisoara'));

  if (erbasuMatch && timisoaraMatch) {
    console.log(`  ✓ Search "Erbasu" matched: "${erbasuMatch.name}"`);
    console.log(`  ✓ Search "Timisoara" matched location: "${timisoaraMatch.location}"`);
  } else {
    console.error('  ❌ Diacritic search test failed!');
  }

  // 3. MEDIA SOURCE LOCK AUDIT
  console.log('\n[3/6] YOUTUBE OFFICIAL SOURCE LOCK AUDIT:');
  const officialChannelId = 'UCN2nPu7isc_06exwPOHYC1Q';
  let invalidChannelVideos = 0;

  for (const video of REAL_CONSTRUCTIONS_VIDEOS as any[]) {
    const chId = video.channelId || video.channel_id;
    if (chId !== officialChannelId) {
      console.error(`❌ Foreign channel video detected: ${video.title} (${chId})`);
      invalidChannelVideos++;
    }
  }

  if (invalidChannelVideos === 0 && REAL_CONSTRUCTIONS_VIDEOS.length >= 10) {
    console.log(`  ✓ 100% of ${REAL_CONSTRUCTIONS_VIDEOS.length} audited videos locked to official channel @CristianVaduvaCV (${officialChannelId}).`);
  } else {
    console.error(`  ❌ Video source lock failed! (${invalidChannelVideos} invalid videos found)`);
  }

  // 4. IMAGE HASH UNICITY AUDIT
  console.log('\n[4/6] PROJECT MEDIA UNICITY AUDIT:');
  const imageHashes = new Set<string>();
  let duplicateImages = 0;

  for (const proj of realProjectsDataset) {
    const img = proj.image || '';
    if (imageHashes.has(img)) {
      console.error(`❌ Duplicate project image URL found: ${img}`);
      duplicateImages++;
    }
    imageHashes.add(img);
  }

  if (duplicateImages === 0) {
    console.log(`  ✓ All ${realProjectsDataset.length} projects contain 100% unique image parameters.`);
  } else {
    console.error(`  ❌ Duplicate images detected: ${duplicateImages}`);
  }

  // 5. PROVENANCE & DISCLOSURE BOUNDS
  console.log('\n[5/6] PROVENANCE & DISCLOSURE AUDIT:');
  let missingSources = 0;
  for (const c of realCompaniesDataset) {
    if (!c.sources || c.sources.length === 0) {
      console.error(`❌ Missing sources for company: ${c.name}`);
      missingSources++;
    }
  }

  for (const p of realProjectsDataset) {
    if (!p.sources || p.sources.length === 0) {
      console.error(`❌ Missing sources for project: ${p.name}`);
      missingSources++;
    }
  }

  if (missingSources === 0) {
    console.log('  ✓ 100% of companies and projects contain verified source provenance ledgers.');
  } else {
    console.error(`  ❌ Missing provenance records: ${missingSources}`);
  }

  // 6. SUMMARY VERDICT
  console.log('\n[6/6] AUDIT SUMMARY:');
  const allPassed = passesBaseline && erbasuMatch && timisoaraMatch && invalidChannelVideos === 0 && duplicateImages === 0 && missingSources === 0;

  if (allPassed) {
    console.log('===========================================================');
    console.log('✅ PHASE 24 INSTITUTIONAL PLATFORM AUDIT PASSED 100%       ');
    console.log('===========================================================');
  } else {
    console.error('===========================================================');
    console.error('❌ PHASE 24 INSTITUTIONAL PLATFORM AUDIT FAILED           ');
    console.error('===========================================================');
    process.exit(1);
  }
}

auditPhase24InstitutionalPlatform();
