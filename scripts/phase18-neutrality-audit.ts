import fs from 'fs';
import path from 'path';

console.log('===========================================================');
console.log(' CONSTRUCTIONS PHASE 18 — INDEPENDENT NEUTRALITY AUDIT ');
console.log('===========================================================');

let passed = true;

// 1. FORBIDDEN LEAD & PROXY PHRASES CHECK
const forbiddenPhrases = [
  'interested in working with this company',
  'contact this company',
  'contact the developer',
  'get in touch with the company',
  'send inquiry to the company',
  'request a quote',
  'connect with this company',
  'work with this developer',
  'become a client of this company',
  'send your details to',
  'we\'ll connect you with',
  'request a callback from',
  'lead storage is not configured',
  'lead for '
];

function scanDir(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (file === 'node_modules' || file === '.next' || file === '.git' || file === '.vercel') continue;
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      scanDir(filePath, fileList);
    } else if (/\.(tsx?|jsx?|json|md)$/.test(file)) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const rootDir = path.resolve(__dirname, '..');
const codeFiles = scanDir(rootDir);
let phraseViolations = 0;

for (const file of codeFiles) {
  // Skip this audit script itself
  if (file.includes('phase18-neutrality-audit')) continue;
  const content = fs.readFileSync(file, 'utf-8');
  for (const phrase of forbiddenPhrases) {
    if (content.toLowerCase().includes(phrase.toLowerCase())) {
      console.error(`[AUDIT FAIL] Forbidden phrase "${phrase}" found in ${path.relative(rootDir, file)}`);
      phraseViolations++;
      passed = false;
    }
  }
}

if (phraseViolations === 0) {
  console.log('[PASS] 1. Zero forbidden lead or proxy representation phrases found across codebase.');
}

// 2. ROBOTS DISALLOW AUDIT
const robotsPath = path.join(rootDir, 'app/robots.ts');
if (fs.existsSync(robotsPath)) {
  const robotsContent = fs.readFileSync(robotsPath, 'utf-8');
  const requiredPrivateRoutes = [
    '/commercial',
    '/product-health',
    '/workspace',
    '/command',
    '/dealflow',
    '/outreach',
    '/actions',
    '/decisions',
    '/accounts'
  ];
  let missingDisallow = 0;
  for (const route of requiredPrivateRoutes) {
    if (!robotsContent.includes(route)) {
      console.error(`[AUDIT FAIL] Private route "${route}" missing from robots.ts disallow list`);
      missingDisallow++;
      passed = false;
    }
  }
  if (missingDisallow === 0) {
    console.log('[PASS] 2. All 9 private surfaces explicitly blocked in robots.ts NOINDEX list.');
  }
}

// 3. TELEGRAM NOTIFICATION NEUTRALITY AUDIT
const inquiryRoutePath = path.join(rootDir, 'app/api/inquiries/route.ts');
if (fs.existsSync(inquiryRoutePath)) {
  const inquiryContent = fs.readFileSync(inquiryRoutePath, 'utf-8');
  if (inquiryContent.includes('NEW CONSTRUCTIONS RESEARCH REQUEST') && !inquiryContent.includes('Lead storage is not configured')) {
    console.log('[PASS] 3. Telegram notification header & inquiry API responses verified neutral.');
  } else {
    console.error('[AUDIT FAIL] Telegram notification header or inquiry API response is not neutral.');
    passed = false;
  }
}

// 4. SITE FOOTER LEGAL NAVIGATION AUDIT
const footerPath = path.join(rootDir, 'components/SiteFooter.tsx');
if (fs.existsSync(footerPath)) {
  const footerContent = fs.readFileSync(footerPath, 'utf-8');
  const requiredFooterLinks = ['/terms', '/privacy', '/gdpr', '/methodology', '/report-error', '/research-request', '/work-with-us', '/video'];
  let missingLinks = 0;
  for (const link of requiredFooterLinks) {
    if (!footerContent.includes(link)) {
      console.error(`[AUDIT FAIL] SiteFooter missing link to "${link}"`);
      missingLinks++;
      passed = false;
    }
  }
  if (missingLinks === 0) {
    console.log('[PASS] 4. SiteFooter contains all required legal, media, and research navigation links.');
  }
}

// 5. INDEPENDENT PLATFORM DISCLOSURE AUDIT IN DOSSIERS
const companyDossierPath = path.join(rootDir, 'app/companies/[slug]/page.tsx');
const projectDossierPath = path.join(rootDir, 'app/projects/[slug]/page.tsx');

if (fs.existsSync(companyDossierPath) && fs.existsSync(projectDossierPath)) {
  const compContent = fs.readFileSync(companyDossierPath, 'utf-8');
  const projContent = fs.readFileSync(projectDossierPath, 'utf-8');

  const disclosureText = 'CONSTRUCTIONS is an independent information and research platform';

  if (compContent.includes(disclosureText) && projContent.includes(disclosureText)) {
    console.log('[PASS] 5. Independent platform disclosure present in both Company and Project dossiers.');
  } else {
    console.error('[AUDIT FAIL] Missing independent platform disclosure in company or project dossier.');
    passed = false;
  }
}

console.log('===========================================================');
if (passed) {
  console.log('✅ PHASE 18 INDEPENDENT NEUTRALITY AUDIT PASSED 100%');
} else {
  console.error('❌ PHASE 18 INDEPENDENT NEUTRALITY AUDIT FAILED');
  process.exit(1);
}
console.log('===========================================================');
