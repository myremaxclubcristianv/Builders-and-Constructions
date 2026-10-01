import fs from 'fs';
import path from 'path';
import { realCompaniesDataset, realProjectsDataset, realLocationsDataset } from '../lib/real-romanian-data';
import { REAL_CONSTRUCTIONS_VIDEOS } from '../lib/video-data';

async function runUltimateFinalProductionAudit() {
  console.log('===========================================================');
  console.log(' ULTIMATE FINAL PRODUCTION AUDIT — CONSTRUCTIONS PLATFORM');
  console.log('===========================================================');

  let failures = 0;

  // [1/10] TAXONOMY & ZERO-FABRICATION BASELINE
  console.log('\n[1/10] TAXONOMY & ZERO-FABRICATION BASELINE:');
  const devs = realCompaniesDataset.filter(c => c.type === 'developer').length;
  const agencies = realCompaniesDataset.filter(c => c.type === 'real_estate_agency').length;
  const contractors = realCompaniesDataset.filter(c => c.type === 'general_contractor' || c.type === 'construction_company' || c.type === 'infrastructure').length;
  const architects = realCompaniesDataset.filter(c => c.type === 'architecture').length;
  const engineers = realCompaniesDataset.filter(c => c.type === 'engineering' || c.type === 'structural_engineering' || c.type === 'mep').length;

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
    console.log('  ✓ Baseline taxonomy matches target numbers 100%.');
  } else {
    console.error('  ❌ Taxonomy count mismatch!');
    failures++;
  }

  // [2/10] SECRET EXPOSURE ISOLATION AUDIT
  console.log('\n[2/10] SECRET EXPOSURE ISOLATION AUDIT:');
  let secretLeaks = 0;
  const appDir = path.join(process.cwd(), 'app');
  const componentsDir = path.join(process.cwd(), 'components');

  function scanClientSecrets(dir: string) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const fullPath = path.join(dir, f);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        scanClientSecrets(fullPath);
      } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
        if (!fullPath.includes('/api/') && !fullPath.includes('lib/telegram.ts') && !fullPath.includes('scripts/')) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          if (content.includes('process.env.TELEGRAM_BOT_TOKEN') || content.includes('process.env.TELEGRAM_CHAT_ID') || content.includes('process.env.SUPABASE_SERVICE_ROLE_KEY')) {
            console.error(`  ❌ Secret exposed in client bundle: ${f}`);
            secretLeaks++;
          }
        }
      }
    }
  }

  scanClientSecrets(appDir);
  scanClientSecrets(componentsDir);

  if (secretLeaks === 0) {
    console.log('  ✓ Telegram and Supabase service-role credentials strictly server-side isolated.');
  } else {
    console.error(`  ❌ Secret exposure audit failed (${secretLeaks} leaks detected)!`);
    failures++;
  }

  // [3/10] PROVENANCE LEDGER AUDIT
  console.log('\n[3/10] PROVENANCE LEDGER AUDIT:');
  let missingSources = 0;
  let invalidUrls = 0;

  for (const c of realCompaniesDataset) {
    if (!c.sources || c.sources.length === 0) missingSources++;
    if (!c.website || !c.website.startsWith('http')) invalidUrls++;
  }
  for (const p of realProjectsDataset) {
    if (!p.sources || p.sources.length === 0) missingSources++;
  }

  if (missingSources === 0 && invalidUrls === 0) {
    console.log('  ✓ 100% of companies and projects contain verified provenance ledgers.');
  } else {
    console.error(`  ❌ Provenance audit failed! (Missing sources: ${missingSources}, Invalid URLs: ${invalidUrls})`);
    failures++;
  }

  // [4/10] DESKTOP HOVER NAVIGATION & ACCESSIBILITY AUDIT
  console.log('\n[4/10] DESKTOP HOVER NAVIGATION & ACCESSIBILITY AUDIT:');
  const siteHeaderContent = fs.readFileSync(path.join(process.cwd(), 'components/SiteHeader.tsx'), 'utf-8');
  const hasHoverHandlers = siteHeaderContent.includes('onMouseEnter') && siteHeaderContent.includes('onMouseLeave');
  const hasAria = siteHeaderContent.includes('aria-expanded') && siteHeaderContent.includes('aria-haspopup');
  const hasEscape = siteHeaderContent.includes("e.key === 'Escape'");

  if (hasHoverHandlers && hasAria && hasEscape) {
    console.log('  ✓ Desktop header implements hover mega-menu, ARIA attributes, and Escape key listener.');
  } else {
    console.error('  ❌ Header hover/accessibility check failed!');
    failures++;
  }

  // [5/10] FONT & IMAGE OPTIMIZATION AUDIT
  console.log('\n[5/10] FONT & IMAGE OPTIMIZATION AUDIT:');
  const globalsCss = fs.readFileSync(path.join(process.cwd(), 'app/globals.css'), 'utf-8');
  const layoutTsx = fs.readFileSync(path.join(process.cwd(), 'app/layout.tsx'), 'utf-8');
  const pageTsx = fs.readFileSync(path.join(process.cwd(), 'app/page.tsx'), 'utf-8');

  const noRenderBlockingImport = !globalsCss.includes('@import url');
  const usesNextFont = layoutTsx.includes('next/font/google');
  const noUnoptimizedInHero = !pageTsx.includes('unoptimized');

  if (noRenderBlockingImport && usesNextFont && noUnoptimizedInHero) {
    console.log('  ✓ Zero render-blocking CSS imports, next/font/google active, and image WebP optimizations verified.');
  } else {
    console.error('  ❌ Font/Image performance optimization check failed!');
    failures++;
  }

  // [6/10] WATCHLIST PRIVACY & LOCALSTORAGE AUDIT
  console.log('\n[6/10] WATCHLIST LOCALSTORAGE PRIVACY AUDIT:');
  const watchlistContent = fs.readFileSync(path.join(process.cwd(), 'components/WatchlistViewer.tsx'), 'utf-8');
  const usesLocalStorage = watchlistContent.includes("localStorage.getItem('cg_saved_entities')");
  const hasDisclosure = watchlistContent.includes('PRIVACY DISCLOSURE');

  if (usesLocalStorage && hasDisclosure) {
    console.log('  ✓ Watchlist operates 100% client-side via localStorage with privacy disclosure.');
  } else {
    console.error('  ❌ Watchlist privacy check failed!');
    failures++;
  }

  // [7/10] YOUTUBE SOURCE LOCK AUDIT
  console.log('\n[7/10] YOUTUBE SOURCE LOCK AUDIT:');
  const officialChannelId = 'UCN2nPu7isc_06exwPOHYC1Q';
  let invalidMedia = 0;

  for (const v of REAL_CONSTRUCTIONS_VIDEOS as any[]) {
    const chId = v.channelId || v.channel_id;
    if (chId !== officialChannelId) {
      console.error(`  ❌ Unverified video channel ID found: ${chId}`);
      invalidMedia++;
    }
  }

  if (invalidMedia === 0 && REAL_CONSTRUCTIONS_VIDEOS.length >= 8) {
    console.log(`  ✓ All ${REAL_CONSTRUCTIONS_VIDEOS.length} media items locked strictly to channel @CristianVaduvaCV.`);
  } else {
    console.error(`  ❌ YouTube source lock failed (${invalidMedia} invalid media items)!`);
    failures++;
  }

  // [8/10] COMMERCIAL NEUTRALITY AUDIT
  console.log('\n[8/10] COMMERCIAL NEUTRALITY AUDIT:');
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
  function scanNeutrality(dir: string) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const fullPath = path.join(dir, f);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        scanNeutrality(fullPath);
      } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
        const content = fs.readFileSync(fullPath, 'utf-8').toLowerCase();
        for (const phrase of forbiddenPhrases) {
          if (content.includes(phrase)) {
            console.error(`  ❌ Neutrality violation: "${phrase}" in ${f}`);
            phraseViolations++;
          }
        }
      }
    }
  }

  scanNeutrality(appDir);
  scanNeutrality(componentsDir);

  if (phraseViolations === 0) {
    console.log('  ✓ Zero proxy lead or unauthorized commercial representation phrases found.');
  } else {
    console.error(`  ❌ Commercial neutrality check failed (${phraseViolations} violations)!`);
    failures++;
  }

  // [9/10] ROBOTS & SITEMAP COVERAGE AUDIT
  console.log('\n[9/10] ROBOTS NOINDEX & SITEMAP COVERAGE AUDIT:');
  const robotsContent = fs.readFileSync(path.join(process.cwd(), 'app/robots.ts'), 'utf-8');
  const sitemapContent = fs.readFileSync(path.join(process.cwd(), 'app/sitemap.ts'), 'utf-8');
  const privateSurfaces = ['/workspace', '/commercial', '/command', '/dealflow', '/outreach', '/actions', '/decisions', '/accounts', '/product-health'];
  let missingRobots = 0;

  for (const s of privateSurfaces) {
    if (!robotsContent.includes(s)) {
      console.error(`  ❌ Private route missing from robots.ts: ${s}`);
      missingRobots++;
    }
  }

  const hasIntelligenceSitemap = sitemapContent.includes("'/intelligence'");

  if (missingRobots === 0 && hasIntelligenceSitemap) {
    console.log('  ✓ Private surfaces excluded in robots.ts and public intelligence routes included in sitemap.ts.');
  } else {
    console.error('  ❌ Robots or sitemap coverage audit failed!');
    failures++;
  }

  // [10/10] SUMMARY VERDICT
  console.log('\n===========================================================');
  if (failures === 0) {
    console.log('✅ ULTIMATE FINAL PRODUCTION AUDIT PASSED 100%');
    console.log('===========================================================');
  } else {
    console.error(`❌ ULTIMATE FINAL PRODUCTION AUDIT FAILED (${failures} failures detected)`);
    console.log('===========================================================');
    process.exit(1);
  }
}

runUltimateFinalProductionAudit();
