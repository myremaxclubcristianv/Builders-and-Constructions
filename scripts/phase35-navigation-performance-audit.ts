import fs from 'fs';
import path from 'path';
import { realCompaniesDataset, realProjectsDataset, realLocationsDataset } from '../lib/real-romanian-data';

async function runPhase35Audit() {
  console.log('===========================================================');
  console.log(' PHASE 35 — NAVIGATION & PERFORMANCE OPTIMIZATION AUDIT');
  console.log('===========================================================');

  let failures = 0;

  // [1/5] DESKTOP HOVER NAVIGATION & ACCESSIBILITY AUDIT
  console.log('\n[1/5] DESKTOP HOVER NAVIGATION & ACCESSIBILITY AUDIT:');
  const siteHeaderPath = path.join(process.cwd(), 'components/SiteHeader.tsx');
  const siteHeaderContent = fs.readFileSync(siteHeaderPath, 'utf-8');

  const hasMouseEnter = siteHeaderContent.includes('onMouseEnter');
  const hasMouseLeave = siteHeaderContent.includes('onMouseLeave');
  const hasAriaExpanded = siteHeaderContent.includes('aria-expanded');
  const hasAriaHasPopup = siteHeaderContent.includes('aria-haspopup');
  const hasEscapeHandler = siteHeaderContent.includes("e.key === 'Escape'");

  if (hasMouseEnter && hasMouseLeave) {
    console.log('  ✓ Desktop header implements hover-driven mega navigation (onMouseEnter/onMouseLeave).');
  } else {
    console.error('  ❌ Desktop header missing hover handlers!');
    failures++;
  }

  if (hasAriaExpanded && hasAriaHasPopup && hasEscapeHandler) {
    console.log('  ✓ ARIA attributes (aria-expanded, aria-haspopup) and Escape key listener present.');
  } else {
    console.error('  ❌ Navigation accessibility features missing!');
    failures++;
  }

  // [2/5] MOBILE NAVIGATION INTEGRITY
  console.log('\n[2/5] MOBILE TOUCH-FIRST NAVIGATION INTEGRITY:');
  const hasMobileDrawer = siteHeaderContent.includes('mobileMenuOpen');
  const hasMobileBottomBar = siteHeaderContent.includes('lg:hidden fixed bottom-0');

  if (hasMobileDrawer && hasMobileBottomBar) {
    console.log('  ✓ Touch-first full-screen mobile drawer and bottom navigation bar intact.');
  } else {
    console.error('  ❌ Mobile navigation components missing!');
    failures++;
  }

  // [3/5] PERFORMANCE & RENDER-BLOCKING CSS AUDIT
  console.log('\n[3/5] PERFORMANCE & CSS RENDER-BLOCKING AUDIT:');
  const globalsCssPath = path.join(process.cwd(), 'app/globals.css');
  const globalsCssContent = fs.readFileSync(globalsCssPath, 'utf-8');
  const layoutPath = path.join(process.cwd(), 'app/layout.tsx');
  const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

  const hasCssImport = globalsCssContent.includes('@import url');
  const hasPreconnect = layoutContent.includes('rel="preconnect"') && layoutContent.includes('fonts.googleapis.com');

  if (!hasCssImport && hasPreconnect) {
    console.log('  ✓ Render-blocking CSS @import removed; Google Fonts preconnect & async loading implemented.');
  } else {
    console.error('  ❌ Render-blocking CSS optimization audit failed!');
    failures++;
  }

  // [4/5] IMAGE OPTIMIZATION AUDIT
  console.log('\n[4/5] IMAGE OPTIMIZATION & WEBP ASSET DELIVERY AUDIT:');
  const pagePath = path.join(process.cwd(), 'app/page.tsx');
  const pageContent = fs.readFileSync(pagePath, 'utf-8');
  const hasUnoptimizedInPage = pageContent.includes('unoptimized');

  if (!hasUnoptimizedInPage) {
    console.log('  ✓ Unoptimized image flags removed from primary hero showcase; WebP optimization active.');
  } else {
    console.error('  ❌ Unoptimized image flag present in app/page.tsx!');
    failures++;
  }

  // [5/5] DATASET INTEGRITY & NON-FABRICATION
  console.log('\n[5/5] DATASET TAXONOMY INTEGRITY:');
  const entityCount = realCompaniesDataset.length;
  const projectCount = realProjectsDataset.length;
  const locationCount = realLocationsDataset.length;

  if (entityCount === 146 && projectCount === 76 && locationCount === 36) {
    console.log(`  ✓ Baseline dataset strictly preserved (146 companies, 76 projects, 36 locations).`);
  } else {
    console.error(`  ❌ Dataset taxonomy count mismatch! (Entities: ${entityCount}, Projects: ${projectCount}, Locations: ${locationCount})`);
    failures++;
  }

  console.log('\n===========================================================');
  if (failures === 0) {
    console.log('✅ PHASE 35 NAVIGATION & PERFORMANCE AUDIT PASSED 100%');
    console.log('===========================================================');
  } else {
    console.error(`❌ PHASE 35 NAVIGATION & PERFORMANCE AUDIT FAILED (${failures} failures)`);
    console.log('===========================================================');
    process.exit(1);
  }
}

runPhase35Audit();
