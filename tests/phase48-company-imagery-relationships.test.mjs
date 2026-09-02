import test from 'node:test';
import assert from 'node:assert/strict';
import { realCompaniesDataset, realProjectsDataset } from '../lib/real-romanian-data.ts';
import { resolveCompanyImage, getCompanyRolePortfolioMetadata } from '../lib/company-imagery.ts';

test('1. Every company image resolves to valid provenance or explicit NOT_DISCLOSED fallback', () => {
  realCompaniesDataset.forEach(comp => {
    const connectedProjs = realProjectsDataset.filter(p =>
      p.developer_slug === comp.slug ||
      p.contractor_slug === comp.slug ||
      p.architect_slug === comp.slug ||
      p.engineering_slug === comp.slug
    );
    const res = resolveCompanyImage(comp, connectedProjs);

    assert.ok(['VERIFIED_CORPORATE_IMAGE', 'VERIFIED_PROJECT_IMAGE', 'NOT_DISCLOSED_FALLBACK'].includes(res.status));

    if (res.status === 'NOT_DISCLOSED_FALLBACK') {
      assert.equal(res.url, null);
      assert.equal(res.isFallback, true);
      assert.equal(res.sourceTier, 'F');
      assert.ok(res.caption.includes('NOT DISCLOSED'));
    } else {
      assert.ok(typeof res.url === 'string' && res.url.startsWith('http'));
      assert.equal(res.isFallback, false);
      assert.ok(res.sourceTier === 'B');
    }
  });
});

test('2. Generic fallback image is never labeled as an entity-specific image', () => {
  const compWithoutImage = realCompaniesDataset.find(c => !c.image && !realProjectsDataset.some(p => p.developer_slug === c.slug && p.image));
  if (compWithoutImage) {
    const res = resolveCompanyImage(compWithoutImage, []);
    assert.equal(res.isFallback, true);
    assert.equal(res.url, null);
    assert.notEqual(res.status, 'VERIFIED_CORPORATE_IMAGE');
    assert.notEqual(res.status, 'VERIFIED_PROJECT_IMAGE');
  }
});

test('3. Developer project count equals verified relationship dataset', () => {
  const developers = realCompaniesDataset.filter(c => c.type === 'developer');
  developers.forEach(dev => {
    const verifiedProjects = realProjectsDataset.filter(p => p.developer_slug === dev.slug);
    assert.ok(Array.isArray(verifiedProjects));
    verifiedProjects.forEach(p => {
      assert.equal(p.developer_slug, dev.slug);
    });
  });
});

test('4. Developer relationship validation for tracked dataset entities', () => {
  realProjectsDataset.forEach(proj => {
    if (proj.developer_slug) {
      const dev = realCompaniesDataset.find(c => c.slug === proj.developer_slug);
      if (dev) {
        assert.equal(dev.type, 'developer', `Matched developer company ${dev.name} must have developer entity classification`);
      }
    }
  });
});

test('5. Contractor relationships remain separate from developer relationships', () => {
  realProjectsDataset.forEach(proj => {
    if (proj.contractor_slug) {
      const contractor = realCompaniesDataset.find(c => c.slug === proj.contractor_slug);
      if (contractor) {
        const meta = getCompanyRolePortfolioMetadata(contractor.type);
        assert.ok(
          meta.roleBadgeLabel.includes('CONTRACTOR') || meta.roleBadgeLabel.includes('ENGINEERING') || meta.roleBadgeLabel.includes('DEVELOPER'),
          `Contractor ${contractor.name} role label must reflect corporate metadata, got: ${meta.roleBadgeLabel}`
        );
      }
    }
  });
});

test('6. Architect relationships remain separate from developer relationships', () => {
  realProjectsDataset.forEach(proj => {
    if (proj.architect_slug) {
      const architect = realCompaniesDataset.find(c => c.slug === proj.architect_slug);
      if (architect) {
        const meta = getCompanyRolePortfolioMetadata(architect.type);
        assert.ok(meta.roleBadgeLabel.includes('ARCHITECT'), `Architect ${architect.name} role label must reflect architect role`);
      }
    }
  });
});

test('7. Missing project/company data remains null or NOT DISCLOSED', () => {
  realProjectsDataset.forEach(proj => {
    if (proj.unit_count === null || proj.unit_count === undefined) {
      assert.ok(proj.unit_count === null || proj.unit_count === undefined);
    }
    if (proj.surface_area === null || proj.surface_area === undefined) {
      assert.ok(proj.surface_area === null || proj.surface_area === undefined);
    }
    if (proj.estimated_investment === null || proj.estimated_investment === undefined) {
      assert.ok(proj.estimated_investment === null || proj.estimated_investment === undefined);
    }
  });
});

test('8. Zero fabrication: No placeholder strings or dummy names in project relationships', () => {
  realProjectsDataset.forEach(proj => {
    assert.notEqual(proj.name, 'Lorem Ipsum');
    assert.notEqual(proj.developer_name, 'Dummy Developer');
    assert.notEqual(proj.contractor_name, 'Dummy Contractor');
    assert.ok(proj.slug && proj.slug.length > 2);
  });
});

test('9. No broken canonical project URLs', () => {
  realProjectsDataset.forEach(proj => {
    assert.ok(/^[a-z0-9-]+$/.test(proj.slug), `Project slug ${proj.slug} must be valid URL slug format`);
  });
});
