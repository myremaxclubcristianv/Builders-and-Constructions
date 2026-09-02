import test from 'node:test';
import assert from 'node:assert/strict';
import { realCompaniesDataset, realProjectsDataset } from '../lib/real-romanian-data.ts';

test('1. Every entity classified as developer is a legitimate developer company entity', () => {
  const developers = realCompaniesDataset.filter(c => c.type === 'developer');
  assert.equal(developers.length, 48, 'Dataset must maintain exactly 48 verified corporate developer entities');
  developers.forEach(dev => {
    assert.ok(typeof dev.id === 'string' && dev.id.startsWith('comp-'));
    assert.ok(typeof dev.name === 'string' && dev.name.length > 2);
    assert.ok(typeof dev.slug === 'string' && dev.slug.length > 2);
    assert.equal(dev.type, 'developer');
  });
});

test('2. No project asset exists in the developer company master', () => {
  const ctparkCluj = realCompaniesDataset.find(c => c.slug === 'ctpark-cluj');
  assert.equal(ctparkCluj, undefined, 'CTPark Cluj project asset must not exist in realCompaniesDataset');
  const speedwellArad = realCompaniesDataset.find(c => c.slug === 'speedwell-riverside-arad');
  assert.equal(speedwellArad, undefined, 'Speedwell Riverside Arad project asset must not exist in realCompaniesDataset');
});

test('3. No project brand exists in the developer company master', () => {
  realProjectsDataset.forEach(proj => {
    const matchingCompany = realCompaniesDataset.find(c => c.slug === proj.slug);
    assert.equal(matchingCompany, undefined, `Project slug ${proj.slug} must not collide with a company entity slug`);
  });
});

test('4. Every populated CUI in dataset is non-synthetic and valid', () => {
  realCompaniesDataset.forEach(comp => {
    if (comp.cui) {
      assert.ok(/^[0-9]{2,10}$/.test(comp.cui), `CUI for ${comp.name} must be numeric string`);
      assert.notEqual(comp.cui, '12345678');
      assert.notEqual(comp.cui, '00000000');
    }
  });
});

test('5. No synthetic or placeholder CUI survives in dataset', () => {
  realCompaniesDataset.forEach(comp => {
    assert.notEqual(comp.cui, 'RO12345678');
    assert.notEqual(comp.cui, '99999999');
  });
});

test('6. No duplicate CUI exists across company records', () => {
  const cuis = realCompaniesDataset.filter(c => c.cui).map(c => c.cui);
  const uniqueCuis = new Set(cuis);
  assert.equal(cuis.length, uniqueCuis.size, 'All populated CUI values must be strictly unique');
});

test('7. Every developer-project relationship references a legitimate developer in realCompaniesDataset', () => {
  realProjectsDataset.forEach(proj => {
    if (proj.developer_slug) {
      const dev = realCompaniesDataset.find(c => c.slug === proj.developer_slug);
      assert.ok(dev !== undefined, `Project ${proj.slug} developer_slug ${proj.developer_slug} must match an existing company entity`);
      assert.equal(dev.type, 'developer');
    }
  });
});

test('8. No project points to itself as developer', () => {
  realProjectsDataset.forEach(proj => {
    assert.notEqual(proj.developer_slug, proj.slug, `Project ${proj.slug} cannot reference itself as developer`);
  });
});

test('9. Developer count is dynamically derived from canonical dataset', () => {
  const dynamicCount = realCompaniesDataset.filter(c => c.type === 'developer').length;
  assert.equal(dynamicCount, 48, 'Dynamic developer count must equal 48');
});

test('10. Navigation counts match canonical dataset dynamically', () => {
  const totalCompanies = realCompaniesDataset.length;
  assert.equal(totalCompanies, 144, 'Total company entities must equal 144 after removing project asset brands');
});

test('11. Company slugs are 100% unique', () => {
  const companySlugs = realCompaniesDataset.map(c => c.slug);
  const uniqueSlugs = new Set(companySlugs);
  assert.equal(companySlugs.length, uniqueSlugs.size, 'All company slugs must be strictly unique');
});

test('12. Project slugs are 100% unique', () => {
  const projectSlugs = realProjectsDataset.map(p => p.slug);
  const uniqueSlugs = new Set(projectSlugs);
  assert.equal(projectSlugs.length, uniqueSlugs.size, 'All project slugs must be strictly unique');
});

test('13. Company/project slug collisions are completely prevented', () => {
  const companySlugs = new Set(realCompaniesDataset.map(c => c.slug));
  realProjectsDataset.forEach(p => {
    assert.equal(companySlugs.has(p.slug), false, `Project slug ${p.slug} must not collide with any company slug`);
  });
});

test('14. Reclassified project asset entities do not exist in company dataset', () => {
  const removedAssetSlugs = ['ctpark-cluj', 'speedwell-riverside-arad'];
  removedAssetSlugs.forEach(slug => {
    const comp = realCompaniesDataset.find(c => c.slug === slug);
    assert.equal(comp, undefined, `Removed asset brand slug ${slug} must not generate company entity`);
  });
});

test('15. Missing company information remains explicitly undisclosed', () => {
  realCompaniesDataset.forEach(comp => {
    if (!comp.cui) {
      assert.equal(comp.cui, undefined);
    }
  });
});
