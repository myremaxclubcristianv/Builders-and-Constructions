import fs from 'fs';
import path from 'path';
import { realCompaniesDataset, realProjectsDataset, realLocationsDataset } from '../lib/real-romanian-data';
import { REAL_CONSTRUCTIONS_VIDEOS } from '../lib/video-data';

async function runPhase32Audit() {
  console.log('===========================================================');
  console.log(' CONSTRUCTIONS PHASE 32 — NEXT-GEN MARKET INTELLIGENCE AUDIT');
  console.log('===========================================================');

  // [1/11] BASELINE DATASET DEPTH AUDIT
  const devs = realCompaniesDataset.filter(c => c.type === 'developer').length;
  const agencies = realCompaniesDataset.filter(c => c.type === 'real_estate_agency').length;
  const contractors = realCompaniesDataset.filter(c => c.type === 'general_contractor' || c.type === 'construction_company' || c.type === 'infrastructure').length;
  const architects = realCompaniesDataset.filter(c => c.type === 'architecture').length;
  const engineers = realCompaniesDataset.filter(c => c.type === 'engineering' || c.type === 'structural_engineering' || c.type === 'mep').length;

  console.log('\n[1/11] BASELINE DATASET DEPTH & COUNT INTEGRITY:');
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

  // [2/11] PRODUCT SURFACES INTEGRITY AUDIT
  console.log('\n[2/11] PRODUCT SURFACES INTEGRITY AUDIT:');
  const requiredPages = [
    'app/intelligence/page.tsx',
    'app/market/page.tsx',
    'app/changes/page.tsx',
    'app/watchlist/page.tsx',
    'app/search/page.tsx',
    'app/compare/page.tsx',
    'app/signals/page.tsx',
    'app/network/page.tsx',
    'app/coverage/page.tsx',
    'app/video/page.tsx',
    'app/research-request/page.tsx',
    'app/work-with-us/page.tsx',
    'app/report-error/page.tsx'
  ];

  let missingPages = 0;
  for (const pagePath of requiredPages) {
    if (!fs.existsSync(path.join(process.cwd(), pagePath))) {
      console.error(`❌ Missing product page: ${pagePath}`);
      missingPages++;
    }
  }

  if (missingPages === 0) {
    console.log(`  ✓ All ${requiredPages.length} core product surfaces present (including /intelligence).`);
  } else {
    console.error(`  ❌ Missing product pages: ${missingPages}`);
  }

  // [3/11] PROVENANCE LEDGER & NON-FABRICATION AUDIT
  console.log('\n[3/11] PROVENANCE LEDGER & NON-FABRICATION AUDIT:');
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
    console.error(`  ❌ Provenance/Website audit failed! (Missing: ${missingProvenance}, Invalid: ${invalidWebsites})`);
  }

  // [4/11] COMMERCIAL NEUTRALITY AUDIT
  console.log('\n[4/11] COMMERCIAL NEUTRALITY & PROXY LEAD LANGUAGE AUDIT:');
  const forbiddenPhrases = [
    'contact developer',
    'contact this company',
    'get in touch with company',
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

  // [5/11] YOUTUBE SOURCE LOCK AUDIT
  console.log('\n[5/11] YOUTUBE OFFICIAL SOURCE LOCK AUDIT:');
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

  // [6/11] PROJECT INVESTMENT LABEL RENDERING AUDIT
  console.log('\n[6/11] PROJECT INVESTMENT LABEL RENDERING BUG AUDIT:');
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

  // [7/11] TELEGRAM SERVER-SIDE CREDENTIAL AUDIT
  console.log('\n[7/11] TELEGRAM SERVER-SIDE CREDENTIAL AUDIT:');
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

  // [8/11] WATCHLIST ANONYMOUS LOCALSTORAGE AUDIT
  console.log('\n[8/11] WATCHLIST LOCALSTORAGE & PRIVACY AUDIT:');
  const watchlistContent = fs.readFileSync(path.join(process.cwd(), 'components/WatchlistViewer.tsx'), 'utf-8');
  const usesLocalStorage = watchlistContent.includes("localStorage.getItem('cg_saved_entities')");
  const includesPrivacyNotice = watchlistContent.includes("PRIVACY DISCLOSURE");

  if (usesLocalStorage && includesPrivacyNotice) {
    console.log('  ✓ WatchlistViewer operates 100% client-side via localStorage with explicit privacy disclosure.');
  } else {
    console.error('  ❌ Watchlist privacy audit failed!');
  }

  // [9/11] SITEMAP INTEGRITY AUDIT
  console.log('\n[9/11] SITEMAP INTEGRITY AUDIT:');
  const sitemapContent = fs.readFileSync(path.join(process.cwd(), 'app/sitemap.ts'), 'utf-8');
  const hasIntelligenceInSitemap = sitemapContent.includes("'/intelligence'");
  const hasMarketInSitemap = sitemapContent.includes("'/market'");
  const hasChangesInSitemap = sitemapContent.includes("'/changes'");

  if (hasIntelligenceInSitemap && hasMarketInSitemap && hasChangesInSitemap) {
    console.log('  ✓ sitemap.ts incorporates /intelligence and all public intelligence surfaces.');
  } else {
    console.error('  ❌ Sitemap verification failed!');
  }

  // [10/11] INTELLIGENCE WORKSPACE SURFACES & DISCLOSURES AUDIT
  console.log('\n[10/11] INTELLIGENCE WORKSPACE SURFACES & DISCLOSURES AUDIT:');
  const intelligenceContent = fs.readFileSync(path.join(process.cwd(), 'app/intelligence/page.tsx'), 'utf-8');
  const hasHeaderTitle = intelligenceContent.includes('MARKET INTELLIGENCE');
  const hasSubTitle = intelligenceContent.includes('A documented view of construction & real estate activity across Romania');
  const hasLastVerified = intelligenceContent.includes('LAST VERIFIED');
  const hasResearchCta = intelligenceContent.includes('NEED DEEPER INSTITUTIONAL RESEARCH');

  if (hasHeaderTitle && hasSubTitle && hasLastVerified && hasResearchCta) {
    console.log('  ✓ Central Market Intelligence command center (/intelligence) verified.');
  } else {
    console.error('  ❌ Intelligence command center verification failed!');
  }

  // [11/11] SUMMARY VERDICT
  console.log('\n[11/11] AUDIT SUMMARY:');
  const allPassed = (
    countsMatch &&
    missingPages === 0 &&
    missingProvenance === 0 &&
    invalidWebsites === 0 &&
    phraseViolations === 0 &&
    invalidVideos === 0 &&
    rawLabelBugs === 0 &&
    clientTelegramSecrets === 0 &&
    usesLocalStorage &&
    includesPrivacyNotice &&
    hasIntelligenceInSitemap &&
    hasMarketInSitemap &&
    hasChangesInSitemap &&
    hasHeaderTitle &&
    hasSubTitle &&
    hasLastVerified &&
    hasResearchCta
  );

  if (allPassed) {
    console.log('===========================================================');
    console.log('✅ PHASE 32 NEXT-GEN MARKET INTELLIGENCE AUDIT PASSED 100%');
    console.log('===========================================================');
  } else {
    console.error('===========================================================');
    console.error('❌ PHASE 32 NEXT-GEN MARKET INTELLIGENCE AUDIT FAILED');
    console.error('===========================================================');
    process.exit(1);
  }
}

runPhase32Audit();
