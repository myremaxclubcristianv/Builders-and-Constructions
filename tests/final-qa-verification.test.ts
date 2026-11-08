import test from 'node:test';
import assert from 'node:assert/strict';
import nextConfig from '../next.config';
import { searchIntelligenceGlobal } from '../lib/data';
import { OFFICIAL_SERVICES } from '../lib/services-config';
import sitemap from '../app/sitemap';
import robots from '../app/robots';

test('FINAL QA: Canonical Redirects Configuration', async (t) => {
  const redirectsFn = nextConfig.redirects;
  assert.ok(typeof redirectsFn === 'function', 'redirects function must exist on nextConfig');
  const redirects = await redirectsFn();

  const redirectMap = new Map(redirects.map((r: any) => [r.source, r]));

  await t.test('1. /greenfield-baneasa redirects permanently to /projects/greenfield-baneasa', () => {
    const r = redirectMap.get('/greenfield-baneasa');
    assert.ok(r, 'Missing redirect for /greenfield-baneasa');
    assert.equal(r.destination, '/projects/greenfield-baneasa');
    assert.equal(r.permanent, true);
  });

  await t.test('2. /greenfield-baneasa-residence redirects permanently to /projects/greenfield-baneasa-residence', () => {
    const r = redirectMap.get('/greenfield-baneasa-residence');
    assert.ok(r, 'Missing redirect for /greenfield-baneasa-residence');
    assert.equal(r.destination, '/projects/greenfield-baneasa-residence');
    assert.equal(r.permanent, true);
  });

  await t.test('3. /ctpark-cluj redirects permanently to /projects/ctpark-cluj-logistics', () => {
    const r = redirectMap.get('/ctpark-cluj');
    assert.ok(r, 'Missing redirect for /ctpark-cluj');
    assert.equal(r.destination, '/projects/ctpark-cluj-logistics');
    assert.equal(r.permanent, true);
  });

  await t.test('4. /cookie-policy redirects permanently to /cookies', () => {
    const r = redirectMap.get('/cookie-policy');
    assert.ok(r, 'Missing redirect for /cookie-policy');
    assert.equal(r.destination, '/cookies');
    assert.equal(r.permanent, true);
  });
});

test('FINAL QA: Global Search Precision & Scope', async (t) => {
  await t.test('1. Search for "One United" resolves company and projects', async () => {
    const results = await searchIntelligenceGlobal('One United');
    const total = results.matchingCompanies.length + results.matchingProjects.length;
    assert.ok(total > 0, 'Should find matches for One United');
    const hasCompany = results.matchingCompanies.some(c => c.slug === 'one-united-properties');
    assert.ok(hasCompany, 'Should match company One United Properties');
  });

  await t.test('2. Search for "Speedwell" resolves developer and portfolio', async () => {
    const results = await searchIntelligenceGlobal('Speedwell');
    const total = results.matchingCompanies.length + results.matchingProjects.length;
    assert.ok(total > 0, 'Should find matches for Speedwell');
    const hasCompany = results.matchingCompanies.some(c => c.slug === 'speedwell');
    assert.ok(hasCompany, 'Should match Speedwell');
  });

  await t.test('3. Search for "A7 Highway" resolves infrastructure project', async () => {
    const results = await searchIntelligenceGlobal('A7 Highway');
    const total = results.matchingProjects.length + results.matchingSignals.length;
    assert.ok(total > 0, 'Should find matches for A7 Highway');
    const hasProject = results.matchingProjects.some(p => p.slug.includes('a7') || p.name.includes('A7'));
    assert.ok(hasProject, 'Should match A7 Motorway project');
  });

  await t.test('4. Search for "Permitting" resolves official service and knowledge', async () => {
    const results = await searchIntelligenceGlobal('Permitting');
    assert.ok(results.matchingServices && results.matchingServices.length > 0, 'Should find matching service for Permitting');
    const hasService = results.matchingServices.some(s => s.slug === 'proiecte');
    assert.ok(hasService, 'Should match proiecte service for Permitting');
    assert.ok(results.matchingKnowledge && results.matchingKnowledge.length > 0, 'Should find matching knowledge for Permitting');
  });

  await t.test('5. Search for "Dispute" resolves official quality/insurance services', async () => {
    const results = await searchIntelligenceGlobal('Dispute');
    assert.ok(results.matchingServices && results.matchingServices.length > 0, 'Should find matching service for Dispute');
    const hasService = results.matchingServices.some(s => s.slug === 'calitate-constructii' || s.slug === 'asigurari');
    assert.ok(hasService, 'Should match calitate-constructii or asigurari');
  });

  await t.test('6. Diacritics and case-insensitivity consistency (Băneasa vs baneasa)', async () => {
    const resWithDiacritics = await searchIntelligenceGlobal('Băneasa');
    const resWithoutDiacritics = await searchIntelligenceGlobal('baneasa');
    assert.ok(resWithDiacritics.matchingProjects.length > 0);
    assert.ok(resWithoutDiacritics.matchingProjects.length > 0);
    assert.equal(
      resWithDiacritics.matchingProjects.length,
      resWithoutDiacritics.matchingProjects.length,
      'Search results count should match regardless of diacritics'
    );
  });

  await t.test('7. Empty and whitespace queries handle gracefully without error', async () => {
    const resEmpty = await searchIntelligenceGlobal('');
    assert.equal(resEmpty.matchingCompanies.length, 0);
    assert.equal(resEmpty.matchingProjects.length, 0);
    assert.equal(resEmpty.matchingServices.length, 0);

    const resSpace = await searchIntelligenceGlobal('    ');
    assert.equal(resSpace.matchingCompanies.length, 0);
    assert.equal(resSpace.matchingProjects.length, 0);
    assert.equal(resSpace.matchingServices.length, 0);
  });
});

test('FINAL QA: Sitemap & Robots Compliance', async (t) => {
  const sm = sitemap();
  const urls = sm.map(entry => entry.url);

  await t.test('1. Sitemap contains /cookies and /accessibility', () => {
    assert.ok(urls.includes('https://constructions.cristianvaduva.com/cookies'), 'Missing /cookies in sitemap');
    assert.ok(urls.includes('https://constructions.cristianvaduva.com/accessibility'), 'Missing /accessibility in sitemap');
  });

  await t.test('2. Robots disallows /api/ and specifies canonical sitemap', () => {
    const r = robots();
    const rules = Array.isArray(r.rules) ? r.rules[0] : r.rules;
    const disallow = Array.isArray(rules?.disallow) ? rules.disallow : [rules?.disallow];
    assert.ok(disallow.includes('/api/'), 'Robots must disallow /api/');
    assert.equal(r.sitemap, 'https://constructions.cristianvaduva.com/sitemap.xml');
  });
});

test('FINAL QA: Services Taxonomy Completeness', async (t) => {
  await t.test('All 13 official services are defined with valid slugs and titles', () => {
    assert.equal(OFFICIAL_SERVICES.length, 13, 'Must have exactly 13 official services');
    for (const service of OFFICIAL_SERVICES) {
      assert.ok(service.slug && service.slug.length > 0, `Service missing slug: ${service.id}`);
      assert.ok(service.title && service.title.length > 0, `Service missing title: ${service.id}`);
    }
  });
});
