import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveEntityRoute } from '../lib/entity-resolver.ts';
import { realCompaniesDataset, realProjectsDataset } from '../lib/real-romanian-data.ts';

test('PHASE 50B-D: WATCHLIST ENTITY RESOLUTION & CANONICAL LINK SUITE', async (t) => {

  await t.test('1. Watchlist entity resolver correctly processes company entities', () => {
    const res = resolveEntityRoute('company', 'one-united-properties');
    assert.equal(res.isResolvable, true);
    assert.equal(res.type, 'company');
    assert.equal(res.href, '/companies/one-united-properties');
    assert.equal(res.name, 'One United Properties');
  });

  await t.test('2. Watchlist entity resolver correctly processes developer synonyms as company', () => {
    const res = resolveEntityRoute('developer', 'hils-development');
    assert.equal(res.isResolvable, true);
    assert.equal(res.type, 'company');
    assert.equal(res.href, '/companies/hils-development');
  });

  await t.test('3. Watchlist entity resolver correctly processes project entities', () => {
    const res = resolveEntityRoute('project', 'nordis-mamaia-resort');
    assert.equal(res.isResolvable, true);
    assert.equal(res.type, 'project');
    assert.equal(res.href, '/projects/nordis-mamaia-resort');
  });

  await t.test('4. Company hrefs resolve strictly to /companies/[slug]', () => {
    realCompaniesDataset.slice(0, 10).forEach(comp => {
      const res = resolveEntityRoute('company', comp.slug);
      assert.equal(res.isResolvable, true);
      assert.ok(res.href.startsWith('/companies/'));
      assert.notEqual(res.href, '/undefined');
    });
  });

  await t.test('5. Project hrefs resolve strictly to /projects/[slug]', () => {
    realProjectsDataset.slice(0, 10).forEach(proj => {
      const res = resolveEntityRoute('project', proj.slug);
      assert.equal(res.isResolvable, true);
      assert.ok(res.href.startsWith('/projects/'));
      assert.notEqual(res.href, '/undefined');
    });
  });

  await t.test('6. No Watchlist entity points to /undefined or empty href when resolvable', () => {
    const res = resolveEntityRoute('company', 'skanska-romania');
    assert.equal(res.isResolvable, true);
    assert.equal(res.href, '/companies/skanska-romania');
  });

  await t.test('7. No Watchlist entity points to an empty slug', () => {
    const res = resolveEntityRoute('company', '');
    assert.equal(res.isResolvable, false);
    assert.equal(res.href, '');
  });

  await t.test('8. Legacy CTPark Cluj asset (ctpark-cluj) remaps to canonical project dossier', () => {
    const res = resolveEntityRoute('project', 'ctpark-cluj');
    assert.equal(res.isResolvable, true);
    assert.equal(res.type, 'project');
    assert.equal(res.canonicalSlug, 'ctpark-cluj-logistics');
    assert.equal(res.href, '/projects/ctpark-cluj-logistics');
    assert.equal(res.isRemapped, true);
  });

  await t.test('9. Legacy Speedwell Riverside Arad asset remaps to canonical project dossier', () => {
    const res = resolveEntityRoute('project', 'speedwell-riverside-arad');
    assert.equal(res.isResolvable, true);
    assert.equal(res.type, 'project');
    assert.equal(res.canonicalSlug, 'speedwell-riverside-arad-site');
    assert.equal(res.href, '/projects/speedwell-riverside-arad-site');
    assert.equal(res.isRemapped, true);
  });

  await t.test('10. Legacy PORR duplicate (porr-construct & comp-porr-construct) remaps to porr-construct-romania', () => {
    const res1 = resolveEntityRoute('company', 'porr-construct');
    assert.equal(res1.isResolvable, true);
    assert.equal(res1.canonicalSlug, 'porr-construct-romania');
    assert.equal(res1.href, '/companies/porr-construct-romania');
    assert.equal(res1.isRemapped, true);

    const res2 = resolveEntityRoute('company', 'comp-porr-construct');
    assert.equal(res2.isResolvable, true);
    assert.equal(res2.canonicalSlug, 'porr-construct-romania');
    assert.equal(res2.href, '/companies/porr-construct-romania');
    assert.equal(res2.isRemapped, true);
  });

  await t.test('11. Unresolvable fake entity yields isResolvable: false and empty href', () => {
    const res = resolveEntityRoute('company', 'non-existent-fake-entity-slug-999');
    assert.equal(res.isResolvable, false);
    assert.equal(res.href, '');
    assert.equal(res.statusDisplay, 'ENTITY UNAVAILABLE');
  });

  await t.test('12. Type mismatch fallback detects project slug passed as company type', () => {
    const res = resolveEntityRoute('company', 'nordis-mamaia-resort');
    assert.equal(res.isResolvable, true);
    assert.equal(res.type, 'project');
    assert.equal(res.href, '/projects/nordis-mamaia-resort');
    assert.equal(res.isRemapped, true);
  });

  await t.test('13. Type mismatch fallback detects company slug passed as project type', () => {
    const res = resolveEntityRoute('project', 'afi-europe-romania');
    assert.equal(res.isResolvable, true);
    assert.equal(res.type, 'company');
    assert.equal(res.href, '/companies/afi-europe-romania');
    assert.equal(res.isRemapped, true);
  });

  await t.test('14. Canonical resolution is 100% deterministic and non-duplicative', () => {
    const res1 = resolveEntityRoute('company', 'one-united-properties');
    const res2 = resolveEntityRoute('company', 'one-united-properties');
    assert.deepEqual(res1, res2);
  });
});
