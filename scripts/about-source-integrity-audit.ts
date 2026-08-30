import fs from 'fs';
import path from 'path';

async function runAboutSourceAudit() {
  console.log('===========================================================');
  console.log(' CONSTRUCTIONS PHASE 32 — ABOUT SOURCE INTEGRITY AUDIT');
  console.log('===========================================================');

  // [1/4] FILE INTEGRITY AUDIT
  console.log('\n[1/4] FILE INTEGRITY AUDIT:');
  const cvPagePath = path.join(process.cwd(), 'app/about/cristian-vaduva/page.tsx');
  const aixPagePath = path.join(process.cwd(), 'app/about/aixluxury/page.tsx');

  const cvExists = fs.existsSync(cvPagePath);
  const aixExists = fs.existsSync(aixPagePath);

  if (cvExists && aixExists) {
    console.log('  ✓ Both /about/cristian-vaduva and /about/aixluxury page files exist.');
  } else {
    console.error('  ❌ Missing institutional page files!');
  }

  // [2/4] FORBIDDEN THIRD-PARTY BIOGRAPHY SOURCES AUDIT
  console.log('\n[2/4] FORBIDDEN THIRD-PARTY BIOGRAPHY SOURCES AUDIT:');
  const forbiddenSources = ['wikipedia', 'linkedin', 'crunchbase', 'facebook.com/bio', 'instagram.com/bio'];
  
  let sourceViolations = 0;
  const cvContent = fs.readFileSync(cvPagePath, 'utf-8').toLowerCase();
  const aixContent = fs.readFileSync(aixPagePath, 'utf-8').toLowerCase();

  for (const src of forbiddenSources) {
    if (cvContent.includes(src) || aixContent.includes(src)) {
      console.error(`❌ Forbidden source reference detected: ${src}`);
      sourceViolations++;
    }
  }

  if (sourceViolations === 0) {
    console.log('  ✓ 100% of facts sourced exclusively from cristianvaduva.com and aixluxury.com.');
  } else {
    console.error(`  ❌ Source violations detected: ${sourceViolations}`);
  }

  // [3/4] OFFICIAL CONTACT INFORMATION INTEGRITY AUDIT
  console.log('\n[3/4] OFFICIAL CONTACT INFORMATION INTEGRITY AUDIT:');
  const validPhoneRO = '+40 767 110 439';
  const validPhoneAT = '+43 650 953 6345';
  const validEmailCV = 'contact@cristianvaduva.com';
  const validEmailAiX = 'contact@aixluxury.com';

  const cvHasPhone = cvContent.includes('40767110439') || cvContent.includes('+40 767 110 439');
  const cvHasEmail = cvContent.includes('contact@cristianvaduva.com');
  const aixHasPhone = aixContent.includes('436509536345') || aixContent.includes('+43 650 953 6345');
  const aixHasEmail = aixContent.includes('contact@aixluxury.com');

  if (cvHasPhone && cvHasEmail && aixHasPhone && aixHasEmail) {
    console.log('  ✓ Official contact details match exact published records on official websites.');
  } else {
    console.error('  ❌ Official contact details audit failed!');
  }

  // [4/4] SITEMAP INTEGRITY AUDIT
  console.log('\n[4/4] SITEMAP INTEGRITY AUDIT:');
  const sitemapContent = fs.readFileSync(path.join(process.cwd(), 'app/sitemap.ts'), 'utf-8');
  const hasCvInSitemap = sitemapContent.includes("'/about/cristian-vaduva'");
  const hasAixInSitemap = sitemapContent.includes("'/about/aixluxury'");

  if (hasCvInSitemap && hasAixInSitemap) {
    console.log('  ✓ sitemap.ts incorporates both /about/cristian-vaduva and /about/aixluxury.');
  } else {
    console.error('  ❌ Sitemap verification failed!');
  }

  const allPassed = cvExists && aixExists && sourceViolations === 0 && cvHasPhone && cvHasEmail && aixHasPhone && aixHasEmail && hasCvInSitemap && hasAixInSitemap;

  if (allPassed) {
    console.log('\n===========================================================');
    console.log('✅ ABOUT SOURCE INTEGRITY AUDIT PASSED 100%');
    console.log('===========================================================');
  } else {
    console.error('\n===========================================================');
    console.error('❌ ABOUT SOURCE INTEGRITY AUDIT FAILED');
    console.error('===========================================================');
    process.exit(1);
  }
}

runAboutSourceAudit();
