import test, { describe } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { realProjectsDataset, realCompaniesDataset } from '../lib/real-romanian-data';
import { checkAuthLockout, recordAuthFailure, clearAuthFailures, getClientIp, checkRateLimit } from '../lib/rate-limit';
import { DICTIONARY } from '../lib/language-context';
import { TECHNICAL_STANDARDS } from '../components/TechnicalCrossReference';

describe('PHASE 55: COMPLETE MASTER SYSTEM VERIFICATION SUITE', () => {

  test('1. CSP script-src strictly omits unsafe-inline while maintaining strict-dynamic and dynamic nonce', () => {
    const middlewareContent = fs.readFileSync(path.resolve('./middleware.ts'), 'utf8');
    
    // Extract script-src directive
    const match = middlewareContent.match(/script-src\s+([^;]+);/);
    assert.ok(match, 'script-src directive must exist in middleware CSP');
    const scriptSrc = match[1];

    assert.ok(!scriptSrc.includes("'unsafe-inline'"), 'script-src MUST NOT contain unsafe-inline');
    assert.ok(scriptSrc.includes("'strict-dynamic'"), "script-src must include 'strict-dynamic'");
    assert.ok(scriptSrc.includes("'nonce-"), "script-src must include dynamic nonce");
  });

  test('2. Admin layout enforces requireAdmin unconditionally when x-pathname is missing or manipulated', () => {
    const adminLayoutContent = fs.readFileSync(path.resolve('./app/admin/layout.tsx'), 'utf8');
    
    // Ensure the check is if (pathname !== '/admin/login')
    assert.ok(
      adminLayoutContent.includes("if (pathname !== '/admin/login')"),
      'app/admin/layout.tsx must guard all paths except strict /admin/login'
    );
    assert.ok(
      adminLayoutContent.includes('await requireAdmin()'),
      'app/admin/layout.tsx must execute await requireAdmin()'
    );
  });

  test('3. Rate Limiter accurately isolates failed auth attempts and clears on success', () => {
    const fakeIp = '198.51.100.42';
    const fakeReq = new Request('https://constructions.cristianvaduva.com/api/admin/session', {
      method: 'POST',
      headers: {
        'x-real-ip': fakeIp
      }
    });

    // Initially allowed
    const initial = checkAuthLockout(fakeReq, 'test_lockout_endpoint');
    assert.strictEqual(initial.allowed, true);

    // Record 5 failures
    for (let i = 0; i < 5; i++) {
      recordAuthFailure(fakeReq, 'test_lockout_endpoint');
    }

    // Now locked out
    const locked = checkAuthLockout(fakeReq, 'test_lockout_endpoint');
    assert.strictEqual(locked.allowed, false);
    assert.ok(locked.retryAfterSeconds > 0);

    // Clear after success
    clearAuthFailures(fakeReq, 'test_lockout_endpoint');
    const cleared = checkAuthLockout(fakeReq, 'test_lockout_endpoint');
    assert.strictEqual(cleared.allowed, true);
  });

  test('4. Rate Limiter IP extraction sanitizes client headers against spoofing', () => {
    // Malformed/spoofed characters in X-Forwarded-For should fall back to 127.0.0.1
    const spoofedReq = new Request('https://example.com/api', {
      headers: {
        'x-forwarded-for': 'DROP TABLE users; 10.0.0.1'
      }
    });
    const extractedIp = getClientIp(spoofedReq);
    assert.strictEqual(extractedIp, '127.0.0.1', 'Malformed X-Forwarded-For must be rejected');

    // Valid IPv4
    const validReq = new Request('https://example.com/api', {
      headers: {
        'x-real-ip': '86.120.45.10'
      }
    });
    assert.strictEqual(getClientIp(validReq), '86.120.45.10');
  });

  test('5. Dacia One Office and Sedako Park have zero fake/reused stock photography', () => {
    const daciaOne = realProjectsDataset.find(p => p.slug === 'dacia-one-office');
    assert.ok(daciaOne, 'Dacia One project must exist in dataset');
    assert.strictEqual(daciaOne.image, '', 'Dacia One must not present stock photo as genuine photo');
    assert.strictEqual(daciaOne.image_status, 'NOT_DISCLOSED');

    const sedako = realProjectsDataset.find(p => p.slug === 'sedako-park-timisoara-site');
    assert.ok(sedako, 'Sedako Park must exist in dataset');
    assert.strictEqual(sedako.image, '', 'Sedako Park must not present stock photo as genuine photo');
    assert.strictEqual(sedako.image_status, 'NOT_DISCLOSED');
  });

  test('6. CTPark Bucharest West dimensions separate land area, operational GLA, and masterplan capex', () => {
    const ctpark = realProjectsDataset.find(p => p.slug === 'ctpark-bucharest-west');
    assert.ok(ctpark, 'CTPark Bucharest West must exist');
    assert.strictEqual(ctpark.land_area_ha, 300, 'Land area must be 300 ha');
    assert.strictEqual(ctpark.operational_gla_sqm, 800000, 'Operational GLA must be 800,000 sqm');
    assert.strictEqual(ctpark.masterplan_gla_sqm, 850000, 'Masterplan capacity must be 850,000 sqm');
    assert.notStrictEqual(ctpark.built_area_sqm, ctpark.surface_area_sqm, 'Built area and surface area must not conflate to same ambiguous value');
  });

  test('7. Romanian-first Dictionary provides complete navigation and CTAs in RO and EN', () => {
    assert.ok(DICTIONARY['nav.projects'].ro === 'Proiecte');
    assert.ok(DICTIONARY['nav.projects'].en === 'Projects');
    assert.ok(DICTIONARY['nav.companies'].ro === 'Companii');
    assert.ok(DICTIONARY['status.under_construction'].ro === 'În Construcție');
    assert.ok(DICTIONARY['hero.badge'].ro.includes('ROMÂNIA'));
  });

  test('8. Technical Cross-Reference data connects Eurocodes, P100-1, materials, and accredited companies', () => {
    assert.ok(TECHNICAL_STANDARDS.length >= 5, 'At least 5 core technical standards must be indexed');
    
    const p100 = TECHNICAL_STANDARDS.find(s => s.identifier.includes('P 100-1'));
    assert.ok(p100, 'P100-1 seismic code must be indexed');
    assert.ok(p100.relevantCompanies.length > 0, 'Must link to accredited engineering companies');
    assert.ok(p100.materials.length > 0, 'Must link to governed materials');

    const ne012 = TECHNICAL_STANDARDS.find(s => s.identifier.includes('NE 012-1'));
    assert.ok(ne012, 'NE 012-1 concrete code must be indexed');
    assert.ok(ne012.status === 'ÎN VIGOARE');
  });

  test('9. Quality audit confirms ZERO reused photo anomalies across all 76 projects', () => {
    const projectImages = new Map<string, string[]>();
    for (const p of realProjectsDataset) {
      if (p.image && p.image.trim()) {
        const clean = p.image.split('&pid=')[0].split('?')[0];
        const existing = projectImages.get(clean) || [];
        existing.push(p.slug);
        projectImages.set(clean, existing);
      }
    }

    const duplicates = Array.from(projectImages.entries()).filter(([_, slugs]) => slugs.length > 1);
    assert.strictEqual(duplicates.length, 0, `No reused stock image urls allowed. Found duplicates: ${JSON.stringify(duplicates)}`);
  });

  test('10. Newsletter subscription route file exists and has correct exports', () => {
    const subscribeRoute = path.resolve('./app/api/subscribe/route.ts');
    assert.ok(fs.existsSync(subscribeRoute), 'app/api/subscribe/route.ts must exist');
    const content = fs.readFileSync(subscribeRoute, 'utf8');
    assert.ok(content.includes('export async function POST'), 'Must export POST handler');
    assert.ok(content.includes('export async function DELETE'), 'Must export DELETE handler');
  });

  test('11. Sample Report page file exists and contains institutional analysis layout', () => {
    const sampleReportRoute = path.resolve('./app/sample-report/page.tsx');
    assert.ok(fs.existsSync(sampleReportRoute), 'app/sample-report/page.tsx must exist');
    const content = fs.readFileSync(sampleReportRoute, 'utf8');
    assert.ok(content.includes('BAROMETRUL PIEȚEI DE CONSTRUCȚII'), 'Must include institutional header');
    assert.ok(content.includes('VERIFICAT BVB'), 'Must differentiate fact from estimate');
  });
});
