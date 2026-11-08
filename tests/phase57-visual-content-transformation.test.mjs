import test from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  realProjectsDataset,
  realCompaniesDataset,
  getCanonicalCapexSummary
} from '../lib/real-romanian-data.ts';
import { getIndustryHubData } from '../lib/data.ts';
import { resolveVisualProvenanceBadge } from '../lib/company-imagery.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

test('PHASE 57: VISUAL & CONTENT TRANSFORMATION AUDIT SUITE', async (t) => {
  await t.test('1. Zero Unsplash URLs anywhere in dataset or core design assets', () => {
    const rawDataset = fs.readFileSync(path.join(ROOT, 'lib/real-romanian-data.ts'), 'utf8');
    assert.strictEqual(
      rawDataset.includes('unsplash.com'),
      false,
      'lib/real-romanian-data.ts must contain 0 occurrences of unsplash.com'
    );

    const globalsCss = fs.readFileSync(path.join(ROOT, 'app/globals.css'), 'utf8');
    assert.strictEqual(
      globalsCss.includes('unsplash.com'),
      false,
      'app/globals.css must contain 0 occurrences of unsplash.com'
    );

    for (const project of realProjectsDataset) {
      if (project.image) {
        assert.strictEqual(
          project.image.includes('unsplash.com'),
          false,
          `Project ${project.slug} must not use Unsplash image`
        );
      }
    }

    for (const company of realCompaniesDataset) {
      if (company.image) {
        assert.strictEqual(
          company.image.includes('unsplash.com'),
          false,
          `Company ${company.slug} must not use Unsplash image`
        );
      }
    }
  });

  await t.test('2. All 4 November 2026 Market Signals are verified and present', async () => {
    const hub = await getIndustryHubData();
    const signals = hub.marketActivity;

    const s1 = signals.find(s => s.id === 'sig-2026-nov-01');
    assert.ok(s1, 'November signal 1 (Centura DN2-A2) must be present');
    assert.strictEqual(s1.event_date, '2026-11-08');
    assert.ok(s1.title.includes('Centura București') || s1.title.includes('DN2–A2'));
    assert.ok(
      (s1.summary.includes('19,32%') || s1.summary.includes('19.32%')) &&
      (s1.summary.includes('11,26%') || s1.summary.includes('11.26%')),
      'Centura București summary must include physical and financial progress percentages'
    );

    const s2 = signals.find(s => s.id === 'sig-2026-nov-02');
    assert.ok(s2, 'November signal 2 (Cartierul Vienez) must be present');
    assert.strictEqual(s2.event_date, '2026-11-05');
    assert.ok(s2.title.includes('Cartierul Vienez'));
    assert.ok(s2.summary.includes('146') || s2.summary.includes('24 mil'));

    const s3 = signals.find(s => s.id === 'sig-2026-nov-03');
    assert.ok(s3, 'November signal 3 (RIVUS Cluj-Napoca) must be present');
    assert.strictEqual(s3.event_date, '2026-11-04');
    assert.ok(s3.title.includes('RIVUS Cluj-Napoca'));
    assert.ok(s3.summary.includes('12.568') && s3.summary.includes('9.402'));

    const s4 = signals.find(s => s.id === 'sig-2026-nov-04');
    assert.ok(s4, 'November signal 4 (INFINITY NORD) must be present');
    assert.strictEqual(s4.event_date, '2026-11-03');
    assert.ok(s4.title.includes('INFINITY NORD'));
    assert.ok(s4.summary.includes('1.200') || s4.summary.includes('Redport'));

    assert.strictEqual(hub.metrics.last_verified_at, '2026-11-08T14:00:00Z');
  });

  await t.test('3. Visual Provenance Badge taxonomy conforms strictly to Romanian standards', () => {
    const validBadges = [
      'Fotografie oficială',
      'Randare oficială',
      'Fotografie din sursă editorială',
      'Imagine indisponibilă în surse verificabile'
    ];

    for (const project of realProjectsDataset) {
      const badge = resolveVisualProvenanceBadge(project);
      assert.ok(
        validBadges.includes(badge.label),
        `Project ${project.slug} yielded unexpected badge label "${badge.label}"`
      );
    }
  });

  await t.test('4. System Invariants — 76 Projects and 143 Companies Preserved', () => {
    assert.strictEqual(realProjectsDataset.length, 76, 'Must have exactly 76 canonical projects');
    assert.strictEqual(realCompaniesDataset.length, 143, 'Must have exactly 143 canonical companies');

    const projectSlugs = new Set(realProjectsDataset.map(p => p.slug));
    assert.strictEqual(projectSlugs.size, 76, 'All 76 project slugs must be unique');

    const companySlugs = new Set(realCompaniesDataset.map(c => c.slug));
    assert.strictEqual(companySlugs.size, 143, 'All 143 company slugs must be unique');
  });

  await t.test('5. Reconciled CAPEX metrics remain mathematically exact', () => {
    const summary = getCanonicalCapexSummary();
    assert.strictEqual(summary.grossCapexEur, 11948000000);
    assert.strictEqual(summary.overlaps.totalOverlapsEur, 1090000000);
    assert.strictEqual(summary.netReconciledCapexEur, 10858000000);
  });

  await t.test('6. CSP & Next.js config allow secure genuine image loading', () => {
    const middlewareContent = fs.readFileSync(path.join(ROOT, 'middleware.ts'), 'utf8');
    assert.ok(
      middlewareContent.includes("img-src 'self' data: blob: https:;"),
      'CSP must permit https images in middleware.ts'
    );

    const nextConfigContent = fs.readFileSync(path.join(ROOT, 'next.config.ts'), 'utf8');
    assert.ok(
      nextConfigContent.includes("hostname: '**'") || nextConfigContent.includes('protocol: "https"'),
      'next.config.ts must allow remote HTTPS images'
    );
  });

  await t.test('7. Core public routes do not contain leftover English navigation or headers', () => {
    const filesToCheck = [
      'app/pipeline/page.tsx',
      'components/PipelineWorkstation.tsx',
      'app/signals/page.tsx',
      'components/SignalsFeed.tsx',
      'app/search/page.tsx',
      'components/SearchDiscoveryTerminal.tsx',
      'components/SiteHeader.tsx',
      'components/SiteFooter.tsx'
    ];

    const forbiddenPhrases = [
      'WHAT IS BEING BUILT RIGHT NOW?',
      'Live Construction Pipeline',
      'All Rights Reserved',
      'GLOBAL MARKET DISCOVERY TERMINAL',
      'No records matching your search',
      'Click "Advance Stage'
    ];

    for (const relPath of filesToCheck) {
      const fullPath = path.join(ROOT, relPath);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        for (const phrase of forbiddenPhrases) {
          assert.strictEqual(
            content.includes(phrase),
            false,
            `File ${relPath} still contains prohibited English string: "${phrase}"`
          );
        }
      }
    }
  });
});
