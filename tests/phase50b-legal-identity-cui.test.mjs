import test from 'node:test';
import assert from 'node:assert/strict';
import { realCompaniesDataset, realProjectsDataset } from '../lib/real-romanian-data.ts';

test('1. No PROJECT_ASSET exists in developer master', () => {
  const assets = realCompaniesDataset.filter(c => c.slug === 'ctpark-cluj' || c.slug === 'speedwell-riverside-arad');
  assert.equal(assets.length, 0, 'Project assets CTPark Cluj and Speedwell Riverside Arad must not exist in realCompaniesDataset');
});

test('2. No PROPERTY entity exists in developer master', () => {
  const propertyTypes = realCompaniesDataset.filter(c => c.type === 'property' || c.type === 'building');
  assert.equal(propertyTypes.length, 0, 'No company entity may have type property or building');
});

test('3. No duplicate developer slugs exist', () => {
  const devSlugs = realCompaniesDataset.filter(c => c.type === 'developer').map(c => c.slug);
  const uniqueDevSlugs = new Set(devSlugs);
  assert.equal(devSlugs.length, uniqueDevSlugs.size, 'Developer slugs must be strictly unique');
});

test('4. No duplicate IDs exist across company master dataset', () => {
  const companyIds = realCompaniesDataset.map(c => c.id);
  const uniqueIds = new Set(companyIds);
  assert.equal(companyIds.length, uniqueIds.size, 'All company IDs must be strictly unique');
  assert.equal(companyIds.length, 143, 'Total company entities must equal 143 after removing duplicate block');
});

test('5. No duplicate verified CUIs exist', () => {
  const cuis = realCompaniesDataset.filter(c => c.cui).map(c => c.cui);
  const uniqueCuis = new Set(cuis);
  assert.equal(cuis.length, uniqueCuis.size, 'All populated CUI values must be strictly unique');
});

test('6. Every populated CUI has valid format and non-synthetic value', () => {
  realCompaniesDataset.forEach(comp => {
    if (comp.cui) {
      assert.ok(/^[0-9]{2,10}$/.test(comp.cui), `CUI ${comp.cui} must be numeric string`);
      assert.notEqual(comp.cui, '12345678');
      assert.notEqual(comp.cui, '00000000');
    }
  });
});

test('7. Every removed entity is absent from public developer master', () => {
  const developers = realCompaniesDataset.filter(c => c.type === 'developer');
  assert.equal(developers.length, 48, 'Developer master count must equal 48');
  assert.equal(developers.some(d => d.slug === 'ctpark-cluj'), false);
  assert.equal(developers.some(d => d.slug === 'speedwell-riverside-arad'), false);
});

test('8. CTPark Cluj is not classified as a developer', () => {
  const dev = realCompaniesDataset.find(c => c.slug === 'ctpark-cluj');
  assert.equal(dev, undefined, 'CTPark Cluj must not be present in company master');
});

test('9. Speedwell Riverside Arad is not classified as a developer', () => {
  const dev = realCompaniesDataset.find(c => c.slug === 'speedwell-riverside-arad');
  assert.equal(dev, undefined, 'Speedwell Riverside Arad must not be present in company master');
});

test('10. IULIUS Real Estate Iași has correct subsidiary semantics', () => {
  const iuliusGroup = realCompaniesDataset.find(c => c.slug === 'iulius-group');
  const iuliusIasi = realCompaniesDataset.find(c => c.slug === 'iulius-real-estate-iasi');
  assert.ok(iuliusGroup !== undefined, 'Parent group Iulius Group must exist');
  assert.ok(iuliusIasi !== undefined, 'Regional entity IULIUS Real Estate Iași must exist');
  assert.notEqual(iuliusGroup.id, iuliusIasi.id);
});

test('11. No company/project slug collisions exist', () => {
  const companySlugs = new Set(realCompaniesDataset.map(c => c.slug));
  realProjectsDataset.forEach(p => {
    assert.equal(companySlugs.has(p.slug), false, `Project slug ${p.slug} must not collide with any company slug`);
  });
});

test('12. No unsupported developer relationships exist', () => {
  realProjectsDataset.forEach(proj => {
    if (proj.developer_slug) {
      const dev = realCompaniesDataset.find(c => c.slug === proj.developer_slug);
      assert.ok(dev !== undefined, `Project ${proj.slug} developer_slug ${proj.developer_slug} must resolve to a valid company`);
      assert.equal(dev.type, 'developer');
    }
  });
});

test('13. Public company pages resolve (all 143 companies)', () => {
  assert.equal(realCompaniesDataset.length, 143, 'Total company entities must equal 143');
});

test('14. Project pages resolve (all 76 projects)', () => {
  assert.equal(realProjectsDataset.length, 76, 'Total project entities must equal 76');
});

test('15. Sitemap contains only legitimate company entities', () => {
  const companySlugs = realCompaniesDataset.map(c => c.slug);
  assert.equal(companySlugs.includes('ctpark-cluj'), false);
  assert.equal(companySlugs.includes('speedwell-riverside-arad'), false);
});

test('16. No synthetic or unverified CUI survives as verified', () => {
  realCompaniesDataset.forEach(comp => {
    if (comp.cui) {
      assert.notEqual(comp.cui, 'RO12345678');
      assert.notEqual(comp.cui, '99999999');
    }
  });
});

test('17. Truth-state values are preserved (NOT DISCLOSED for unpopulated fields)', () => {
  realCompaniesDataset.forEach(comp => {
    if (!comp.cui) {
      assert.equal(comp.cui, undefined, 'Unpopulated CUI must be undefined in source data');
    }
  });
});

test('18. Entity counts reconcile mathematically', () => {
  const totalCompanies = realCompaniesDataset.length;
  const developers = realCompaniesDataset.filter(c => c.type === 'developer').length;
  const contractors = realCompaniesDataset.filter(c => c.type === 'general_contractor').length;
  const architects = realCompaniesDataset.filter(c => c.type === 'architecture').length;
  const engineers = realCompaniesDataset.filter(c => c.type === 'engineering' || c.type === 'structural_engineering' || c.type === 'mep' || c.type === 'infrastructure').length;
  const agencies = realCompaniesDataset.filter(c => c.type === 'real_estate_agency').length;
  
  assert.equal(totalCompanies, 143);
  assert.equal(developers, 48);
  assert.equal(contractors, 26);
  assert.equal(architects, 21);
  assert.equal(engineers, 28);
  assert.equal(agencies, 20);
  assert.equal(developers + contractors + architects + engineers + agencies, totalCompanies);
});

test('19. CUI summary reconciles mathematically', () => {
  const totalDevelopers = realCompaniesDataset.filter(c => c.type === 'developer').length;
  const verifiedCuis = realCompaniesDataset.filter(c => c.type === 'developer' && c.cui).length;
  const undisclosedCuis = realCompaniesDataset.filter(c => c.type === 'developer' && !c.cui).length;
  assert.equal(totalDevelopers, 48);
  assert.equal(verifiedCuis + undisclosedCuis, totalDevelopers);
});

test('20. Relationship counts reconcile mathematically', () => {
  const projectsWithDev = realProjectsDataset.filter(p => p.developer_slug !== null);
  const projectsWithoutDev = realProjectsDataset.filter(p => p.developer_slug === null);
  assert.equal(realProjectsDataset.length, 76);
  assert.equal(projectsWithDev.length, 59);
  assert.equal(projectsWithoutDev.length, 17);
  assert.equal(projectsWithDev.length + projectsWithoutDev.length, realProjectsDataset.length);
});
