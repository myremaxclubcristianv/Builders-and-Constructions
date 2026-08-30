import fs from 'fs';
import path from 'path';
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

async function runPhase25Audit() {
  console.log('===========================================================');
  console.log(' CONSTRUCTIONS PHASE 25 — PRODUCTIZATION & DATA DEPTH AUDIT');
  console.log('===========================================================');

  // [1/8] BASELINE DATASET COUNT AUDIT
  const devs = realCompaniesDataset.filter(c => c.type === 'developer').length;
  const agencies = realCompaniesDataset.filter(c => c.type === 'real_estate_agency').length;
  const contractors = realCompaniesDataset.filter(c => c.type === 'general_contractor' || c.type === 'construction_company' || c.type === 'infrastructure').length;
  const architects = realCompaniesDataset.filter(c => c.type === 'architecture').length;
  const engineers = realCompaniesDataset.filter(c => c.type === 'engineering' || c.type === 'structural_engineering' || c.type === 'mep').length;

  console.log('\n[1/8] BASELINE DATASET DEPTH & COUNT INTEGRITY:');
  console.log(`  Companies (Entities): ${realCompaniesDataset.length} (Target: 146)`);
  console.log(`    - Developers:        ${devs} (Target: 50)`);
  console.log(`    - Agencies:          ${agencies} (Target: 20)`);
  console.log(`    - Contractors:       ${contractors} (Target: 30)`);
  console.log(`    - Architects:        ${architects} (Target: 21)`);
  console.log(`    - Engineers:         ${engineers} (Target: 25)`);
  console.log(`  Projects:             ${realProjectsDataset.length} (Target: 76)`);
  console.log(`  Locations / Hubs:     ${realLocationsDataset.length} (Target: 36)`);

  const countsMatch = (
    realCompaniesDataset.length === 146 &&
    devs === 50 &&
    agencies === 20 &&
    contractors === 30 &&
    architects === 21 &&
    engineers === 25 &&
    realProjectsDataset.length === 76 &&
    realLocationsDataset.length === 36
  );

  if (countsMatch) {
    console.log('  ✓ Baseline dataset matches exact verified count targets 100%.');
  } else {
    console.error('  ❌ Baseline dataset count mismatch!');
  }

  // [2/8] NON-FABRICATION & PROVENANCE LEDGER AUDIT
  console.log('\n[2/8] FACTUAL PROVENANCE & NON-FABRICATION AUDIT:');
  let missingProvenance = 0;
  let invalidWebsites = 0;

  for (const c of realCompaniesDataset) {
    if (!c.sources || c.sources.length === 0) missingProvenance++;
    if (!c.website || !c.website.startsWith('http')) invalidWebsites++;
  }

  for (const p of realProjectsDataset) {
    if (!p.sources || p.sources.length === 0) missingProvenance++;
  }

  if (missingProvenance === 0 && invalidWebsites === 0) {
    console.log('  ✓ 100% of companies and projects contain verified provenance ledgers and valid websites.');
  } else {
    console.error(`  ❌ Provenance/Website audit failed! (Missing provenance: ${missingProvenance}, Invalid websites: ${invalidWebsites})`);
  }

  // [3/8] COMMERCIAL NEUTRALITY & THIRD-PARTY PROXY LEAD AUDIT
  console.log('\n[3/8] COMMERCIAL NEUTRALITY & PROXY LEAD LANGUAGE AUDIT:');
  const forbiddenPhrases = [
    'contact developer',
    'contact this company',
    'get in touch with the company',
    'send your details to the developer',
    'lead for company',
    'request a quote from',
    'the company will contact you'
  ];

  let phraseViolations = 0;
  const appDir = path.join(process.cwd(), 'app');
  const componentsDir = path.join(process.cwd(), 'components');

  function scanDirectory(dir: string) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const fullPath = path.join(dir, f);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
        const content = fs.readFileSync(fullPath, 'utf-8').toLowerCase();
        for (const phrase of forbiddenPhrases) {
          if (content.includes(phrase)) {
            console.error(`❌ Forbidden phrase "${phrase}" detected in ${f}`);
            phraseViolations++;
          }
        }
      }
    }
  }

  scanDirectory(appDir);
  scanDirectory(componentsDir);

  if (phraseViolations === 0) {
    console.log('  ✓ Zero proxy lead capture or unauthorized commercial representation phrases found.');
  } else {
    console.error(`  ❌ Neutrality violations detected: ${phraseViolations}`);
  }

  // [4/8] YOUTUBE SOURCE LOCK & MEDIA AUDIT
  console.log('\n[4/8] YOUTUBE OFFICIAL SOURCE LOCK AUDIT:');
  const officialChannelId = 'UCN2nPu7isc_06exwPOHYC1Q';
  let invalidVideos = 0;

  for (const v of REAL_CONSTRUCTIONS_VIDEOS as any[]) {
    const chId = v.channelId || v.channel_id;
    if (chId !== officialChannelId) {
      console.error(`❌ Video "${v.title}" not locked to official channel ID ${officialChannelId}`);
      invalidVideos++;
    }
  }

  if (invalidVideos === 0 && REAL_CONSTRUCTIONS_VIDEOS.length >= 8) {
    console.log(`  ✓ All ${REAL_CONSTRUCTIONS_VIDEOS.length} audited videos strictly locked to channel @CristianVaduvaCV.`);
  } else {
    console.error(`  ❌ YouTube video source lock failed! (${invalidVideos} invalid videos found)`);
  }

  // [5/8] PROJECT INVESTMENT LABEL RENDERING AUDIT
  console.log('\n[5/8] PROJECT INVESTMENT LABEL RENDERING BUG AUDIT:');
  let rawLabelBugs = 0;
  for (const p of realProjectsDataset) {
    if (p.investment_label && p.investment_label.toUpperCase() === 'ANNOUNCED INVESTMENT') {
      console.error(`❌ Project ${p.name} has raw label bug: "ANNOUNCED INVESTMENT"`);
      rawLabelBugs++;
    }
  }

  if (rawLabelBugs === 0) {
    console.log('  ✓ Zero raw internal investment labels rendered as values.');
  } else {
    console.error(`  ❌ Investment label rendering bugs detected: ${rawLabelBugs}`);
  }

  // [6/8] SEARCH TERMINAL & DIACRITIC NORMALIZATION AUDIT
  console.log('\n[6/8] SEARCH DIACRITIC NORMALIZATION AUDIT:');
  const erbasuMatch = realCompaniesDataset.find(c => normalizeDiacritics(c.name).includes('erbasu'));
  const timisoaraMatch = realCompaniesDataset.find(c => normalizeDiacritics(c.location).includes('timisoara'));

  if (erbasuMatch && timisoaraMatch) {
    console.log(`  ✓ Diacritic search "Erbasu" matched: "${erbasuMatch.name}"`);
    console.log(`  ✓ Diacritic search "Timisoara" matched location: "${timisoaraMatch.location}"`);
  } else {
    console.error('  ❌ Diacritic search test failed!');
  }

  // [7/8] TELEGRAM CREDENTIAL SECURITY AUDIT
  console.log('\n[7/8] TELEGRAM SERVER-SIDE CREDENTIAL AUDIT:');
  let clientTelegramSecrets = 0;
  function checkClientSecretExposure(dir: string) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const fullPath = path.join(dir, f);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        checkClientSecretExposure(fullPath);
      } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
        if (!fullPath.includes('/api/') && !fullPath.includes('lib/telegram.ts') && !fullPath.includes('scripts/')) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          if (content.includes('process.env.TELEGRAM_BOT_TOKEN') || content.includes('process.env.TELEGRAM_CHAT_ID')) {
            console.error(`❌ Telegram secret exposed in client code: ${f}`);
            clientTelegramSecrets++;
          }
        }
      }
    }
  }

  checkClientSecretExposure(appDir);
  checkClientSecretExposure(componentsDir);

  if (clientTelegramSecrets === 0) {
    console.log('  ✓ Telegram bot credentials strictly server-side isolated.');
  } else {
    console.error(`  ❌ Client Telegram secret exposure detected: ${clientTelegramSecrets}`);
  }

  // [8/8] SUMMARY VERDICT
  console.log('\n[8/8] AUDIT SUMMARY:');
  const allPassed = (
    countsMatch &&
    missingProvenance === 0 &&
    invalidWebsites === 0 &&
    phraseViolations === 0 &&
    invalidVideos === 0 &&
    rawLabelBugs === 0 &&
    erbasuMatch &&
    timisoaraMatch &&
    clientTelegramSecrets === 0
  );

  if (allPassed) {
    console.log('===========================================================');
    console.log('✅ PHASE 25 PRODUCTIZATION & DATA DEPTH AUDIT PASSED 100%');
    console.log('===========================================================');
  } else {
    console.error('===========================================================');
    console.error('❌ PHASE 25 PRODUCTIZATION & DATA DEPTH AUDIT FAILED     ');
    console.error('===========================================================');
    process.exit(1);
  }
}

runPhase25Audit();
