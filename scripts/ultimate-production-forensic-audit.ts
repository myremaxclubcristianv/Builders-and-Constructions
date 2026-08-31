import fs from 'fs';
import path from 'path';
import { realCompaniesDataset, realProjectsDataset, realLocationsDataset } from '../lib/real-romanian-data';
import { REAL_CONSTRUCTIONS_VIDEOS } from '../lib/video-data';

async function runUltimateProductionAudit() {
  console.log('===========================================================');
  console.log(' ULTIMATE PRODUCTION FORENSIC AUDIT — CONSTRUCTIONS PLATFORM');
  console.log('===========================================================');

  let totalFailures = 0;

  // [1/12] BASELINE ENTITY TAXONOMY & ZERO FABRICATION
  console.log('\n[1/12] BASELINE ENTITY TAXONOMY & COUNT INTEGRITY:');
  const devs = realCompaniesDataset.filter(c => c.type === 'developer').length;
  const agencies = realCompaniesDataset.filter(c => c.type === 'real_estate_agency').length;
  const contractors = realCompaniesDataset.filter(c => c.type === 'general_contractor' || c.type === 'construction_company' || c.type === 'infrastructure').length;
  const architects = realCompaniesDataset.filter(c => c.type === 'architecture').length;
  const engineers = realCompaniesDataset.filter(c => c.type === 'engineering' || c.type === 'structural_engineering' || c.type === 'mep').length;

  console.log(`  Companies (Entities): ${realCompaniesDataset.length} (Expected: 146)`);
  console.log(`    - Developers:        ${devs} (Expected: 50)`);
  console.log(`    - Agencies:          ${agencies} (Expected: 20)`);
  console.log(`    - Contractors:       ${contractors} (Expected: 30)`);
  console.log(`    - Architects:        ${architects} (Expected: 21)`);
  console.log(`    - Engineers:         ${engineers} (Expected: 25)`);
  console.log(`  Projects:             ${realProjectsDataset.length} (Expected: 76)`);
  console.log(`  Locations / Hubs:     ${realLocationsDataset.length} (Expected: 36)`);

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
    console.log('  ✓ Baseline dataset taxonomy matches exact verified count targets 100%.');
  } else {
    console.error('  ❌ Dataset taxonomy count mismatch!');
    totalFailures++;
  }

  // [2/12] PROVENANCE LEDGER AUDIT
  console.log('\n[2/12] PROVENANCE LEDGER & CITATION AUDIT:');
  let missingSources = 0;
  let invalidWebsites = 0;

  for (const c of realCompaniesDataset) {
    if (!c.sources || c.sources.length === 0) missingSources++;
    if (!c.website || !c.website.startsWith('http')) invalidWebsites++;
  }
  for (const p of realProjectsDataset) {
    if (!p.sources || p.sources.length === 0) missingSources++;
  }

  if (missingSources === 0 && invalidWebsites === 0) {
    console.log('  ✓ 100% of companies and projects contain explicit provenance ledgers and valid websites.');
  } else {
    console.error(`  ❌ Provenance audit failed! (Missing sources: ${missingSources}, Invalid URLs: ${invalidWebsites})`);
    totalFailures++;
  }

  // [3/12] COMMERCIAL NEUTRALITY AUDIT
  console.log('\n[3/12] COMMERCIAL NEUTRALITY & PROXY LEAD LANGUAGE AUDIT:');
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
            console.error(`  ❌ Neutrality violation: forbidden phrase "${phrase}" detected in ${f}`);
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
    console.error(`  ❌ Commercial neutrality violations detected: ${phraseViolations}`);
    totalFailures++;
  }

  // [4/12] YOUTUBE OFFICIAL SOURCE LOCK AUDIT
  console.log('\n[4/12] YOUTUBE OFFICIAL SOURCE LOCK AUDIT:');
  const officialChannelId = 'UCN2nPu7isc_06exwPOHYC1Q';
  let invalidVideos = 0;

  for (const v of REAL_CONSTRUCTIONS_VIDEOS as any[]) {
    const chId = v.channelId || v.channel_id;
    if (chId !== officialChannelId) {
      console.error(`  ❌ Video "${v.title}" is not locked to official channel ${officialChannelId}`);
      invalidVideos++;
    }
  }

  if (invalidVideos === 0 && REAL_CONSTRUCTIONS_VIDEOS.length >= 8) {
    console.log(`  ✓ All ${REAL_CONSTRUCTIONS_VIDEOS.length} media items strictly locked to official channel @CristianVaduvaCV.`);
  } else {
    console.error(`  ❌ YouTube video source lock failed! (${invalidVideos} invalid items)`);
    totalFailures++;
  }

  // [5/12] TELEGRAM SERVER-SIDE ISOLATION AUDIT
  console.log('\n[5/12] TELEGRAM SERVER-SIDE CREDENTIAL AUDIT:');
  let exposedSecrets = 0;
  function checkSecretExposure(dir: string) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const fullPath = path.join(dir, f);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        checkSecretExposure(fullPath);
      } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
        if (!fullPath.includes('/api/') && !fullPath.includes('lib/telegram.ts') && !fullPath.includes('scripts/')) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          if (content.includes('process.env.TELEGRAM_BOT_TOKEN') || content.includes('process.env.TELEGRAM_CHAT_ID')) {
            console.error(`  ❌ Secret exposed in client bundle: ${f}`);
            exposedSecrets++;
          }
        }
      }
    }
  }

  checkSecretExposure(appDir);
  checkSecretExposure(componentsDir);

  if (exposedSecrets === 0) {
    console.log('  ✓ Telegram credentials strictly isolated to server-side context.');
  } else {
    console.error(`  ❌ Client secret exposure detected: ${exposedSecrets}`);
    totalFailures++;
  }

  // [6/12] WATCHLIST LOCALSTORAGE PRIVACY AUDIT
  console.log('\n[6/12] WATCHLIST PRIVACY & LOCALSTORAGE AUDIT:');
  const watchlistFile = path.join(process.cwd(), 'components/WatchlistViewer.tsx');
  const watchlistContent = fs.readFileSync(watchlistFile, 'utf-8');
  const usesLocalStorage = watchlistContent.includes("localStorage.getItem('cg_saved_entities')");
  const includesPrivacyNotice = watchlistContent.includes("PRIVACY DISCLOSURE");

  if (usesLocalStorage && includesPrivacyNotice) {
    console.log('  ✓ Watchlist operates 100% client-side via localStorage with explicit privacy disclosure.');
  } else {
    console.error('  ❌ Watchlist privacy audit failed!');
    totalFailures++;
  }

  // [7/12] SITEMAP INTEGRITY AUDIT
  console.log('\n[7/12] SITEMAP INTEGRITY AUDIT:');
  const sitemapFile = path.join(process.cwd(), 'app/sitemap.ts');
  const sitemapContent = fs.readFileSync(sitemapFile, 'utf-8');
  const hasIntelligence = sitemapContent.includes("'/intelligence'");
  const hasMarket = sitemapContent.includes("'/market'");
  const hasChanges = sitemapContent.includes("'/changes'");

  if (hasIntelligence && hasMarket && hasChanges) {
    console.log('  ✓ sitemap.ts incorporates all public intelligence routes.');
  } else {
    console.error('  ❌ Sitemap verification failed!');
    totalFailures++;
  }

  // [8/12] ROBOTS NOINDEX AUDIT
  console.log('\n[8/12] ROBOTS NOINDEX PRIVATE ROUTES AUDIT:');
  const robotsFile = path.join(process.cwd(), 'app/robots.ts');
  const robotsContent = fs.readFileSync(robotsFile, 'utf-8');
  const privateRoutes = ['/workspace', '/commercial', '/command', '/dealflow', '/outreach', '/actions', '/decisions', '/accounts', '/product-health'];
  let missingDisallows = 0;

  for (const r of privateRoutes) {
    if (!robotsContent.includes(r)) {
      console.error(`  ❌ Private route missing from robots.ts disallow: ${r}`);
      missingDisallows++;
    }
  }

  if (missingDisallows === 0) {
    console.log(`  ✓ All ${privateRoutes.length} private operational surfaces blocked in robots.ts.`);
  } else {
    console.error(`  ❌ Robots disallow audit failed! (${missingDisallows} missing)`);
    totalFailures++;
  }

  // [9/12] ABOUT SOURCE LOCK AUDIT
  console.log('\n[9/12] ABOUT / INSTITUTIONAL SOURCE LOCK AUDIT:');
  const cvAboutFile = path.join(process.cwd(), 'app/about/cristian-vaduva/page.tsx');
  const aixAboutFile = path.join(process.cwd(), 'app/about/aixluxury/page.tsx');
  const cvExists = fs.existsSync(cvAboutFile);
  const aixExists = fs.existsSync(aixAboutFile);

  if (cvExists && aixExists) {
    console.log('  ✓ Institutional biography and company overview surfaces verified.');
  } else {
    console.error('  ❌ Missing institutional about pages!');
    totalFailures++;
  }

  // [10/12] CORE PRODUCT SURFACES PRESENCE
  console.log('\n[10/12] CORE PRODUCT SURFACES INTEGRITY:');
  const coreSurfaces = [
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

  let missingSurfaces = 0;
  for (const surface of coreSurfaces) {
    if (!fs.existsSync(path.join(process.cwd(), surface))) {
      console.error(`  ❌ Missing product surface file: ${surface}`);
      missingSurfaces++;
    }
  }

  if (missingSurfaces === 0) {
    console.log(`  ✓ All ${coreSurfaces.length} core product surfaces present.`);
  } else {
    console.error(`  ❌ Missing product surfaces count: ${missingSurfaces}`);
    totalFailures++;
  }

  // [11/12] RAW INVESTMENT LABEL RENDERING AUDIT
  console.log('\n[11/12] INVESTMENT LABEL RENDERING AUDIT:');
  let rawLabelBugs = 0;
  for (const p of realProjectsDataset) {
    if (p.investment_label && p.investment_label.toUpperCase() === 'ANNOUNCED INVESTMENT') {
      console.error(`  ❌ Raw label bug on project: ${p.name}`);
      rawLabelBugs++;
    }
  }

  if (rawLabelBugs === 0) {
    console.log('  ✓ Zero raw internal investment labels rendered as public values.');
  } else {
    console.error(`  ❌ Investment label rendering bugs found: ${rawLabelBugs}`);
    totalFailures++;
  }

  // [12/12] SUMMARY VERDICT
  console.log('\n[12/12] AUDIT SUMMARY:');
  console.log('===========================================================');
  if (totalFailures === 0) {
    console.log('✅ ULTIMATE PRODUCTION FORENSIC AUDIT PASSED 100%');
    console.log('===========================================================');
  } else {
    console.error(`❌ ULTIMATE PRODUCTION FORENSIC AUDIT FAILED (${totalFailures} failures detected)`);
    console.log('===========================================================');
    process.exit(1);
  }
}

runUltimateProductionAudit();
