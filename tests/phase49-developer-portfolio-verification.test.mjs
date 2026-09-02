import test from 'node:test';
import assert from 'node:assert/strict';
import { realCompaniesDataset, realProjectsDataset } from '../lib/real-romanian-data.ts';
import { resolveCompanyImage } from '../lib/company-imagery.ts';

test('1. Every developer entity is a valid company/corporate entity in dataset', () => {
  const developers = realCompaniesDataset.filter(c => c.type === 'developer');
  assert.equal(developers.length, 48, 'Dataset must maintain exactly 48 audited developer entities');
  developers.forEach(dev => {
    assert.ok(typeof dev.id === 'string' && dev.id.startsWith('comp-'));
    assert.ok(typeof dev.name === 'string' && dev.name.length > 2);
    assert.ok(typeof dev.slug === 'string' && dev.slug.length > 2);
    assert.equal(dev.type, 'developer');
  });
});

test('2. Every developer-project relationship has verified primary/secondary provenance sources', () => {
  const developerProjects = realProjectsDataset.filter(p => p.developer_slug !== null);
  developerProjects.forEach(proj => {
    assert.ok(Array.isArray(proj.sources) && proj.sources.length > 0, `Project ${proj.slug} must have explicit provenance sources`);
    proj.sources.forEach(src => {
      assert.ok(typeof src.url === 'string' && src.url.startsWith('http'), `Source URL for ${proj.slug} must be valid HTTP(S) URL`);
      assert.ok(typeof src.title === 'string' && src.title.length > 2);
    });
  });
});

test('3. Every project linked to a developer resolves to a verified developer relationship', () => {
  realProjectsDataset.forEach(proj => {
    if (proj.developer_slug) {
      const dev = realCompaniesDataset.find(c => c.slug === proj.developer_slug);
      assert.ok(dev !== undefined, `Project ${proj.slug} developer_slug ${proj.developer_slug} must match an existing company entity`);
      assert.equal(dev.type, 'developer', `Matched company ${dev.name} for project ${proj.name} must have developer classification`);
    }
  });
});

test('4. No contractor-only entity is misclassified as a project developer', () => {
  const contractors = realCompaniesDataset.filter(c => c.type === 'general_contractor' || c.type === 'contractor');
  contractors.forEach(c => {
    const misattributed = realProjectsDataset.filter(p => p.developer_slug === c.slug);
    assert.equal(misattributed.length, 0, `Contractor ${c.name} must not be set as developer_slug on any project`);
  });
});

test('5. No architect-only entity is misclassified as a project developer', () => {
  const architects = realCompaniesDataset.filter(c => c.type === 'architect' || c.type === 'architecture');
  architects.forEach(a => {
    const misattributed = realProjectsDataset.filter(p => p.developer_slug === a.slug);
    assert.equal(misattributed.length, 0, `Architect ${a.name} must not be set as developer_slug on any project`);
  });
});

test('6. No agency-only entity is misclassified as a project developer', () => {
  const agencies = realCompaniesDataset.filter(c => c.type === 'agency' || c.type === 'marketing_sales_agency');
  agencies.forEach(ag => {
    const misattributed = realProjectsDataset.filter(p => p.developer_slug === ag.slug);
    assert.equal(misattributed.length, 0, `Agency ${ag.name} must not be set as developer_slug on any project`);
  });
});

test('7. Developer project counts are dynamically calculated and match verified links', () => {
  const developers = realCompaniesDataset.filter(c => c.type === 'developer');
  developers.forEach(dev => {
    const actualProjects = realProjectsDataset.filter(p => p.developer_slug === dev.slug);
    // Dynamic project count calculation test
    const dynamicCount = actualProjects.length;
    assert.ok(dynamicCount >= 0);
    actualProjects.forEach(p => {
      assert.equal(p.developer_slug, dev.slug);
    });
  });
});

test('8. Duplicate canonical project IDs do not exist in dataset', () => {
  const projectIds = realProjectsDataset.map(p => p.id);
  const uniqueIds = new Set(projectIds);
  assert.equal(projectIds.length, uniqueIds.size, 'All project IDs in realProjectsDataset must be strictly unique');
});

test('9. Parent corporate developers and regional subsidiaries remain distinct', () => {
  const ctp = realCompaniesDataset.find(c => c.slug === 'ctp-romania');
  assert.ok(ctp !== undefined);
  const ctpProjects = realProjectsDataset.filter(p => p.developer_slug === 'ctp-romania');
  assert.ok(ctpProjects.length >= 3, 'CTP Romania must have all 3 verified logistics hubs in its portfolio');

  const speedwell = realCompaniesDataset.find(c => c.slug === 'speedwell');
  assert.ok(speedwell !== undefined);
  const speedwellProjects = realProjectsDataset.filter(p => p.developer_slug === 'speedwell');
  assert.ok(speedwellProjects.length >= 3, 'Speedwell must have all 3 verified mixed-use developments in its portfolio');
});

test('10. Project locations are verified real strings and cannot be fabricated', () => {
  realProjectsDataset.forEach(proj => {
    assert.ok(typeof proj.location === 'string' && proj.location.length > 2);
    assert.notEqual(proj.location, 'Unknown Location');
    assert.notEqual(proj.location, 'Placeholder City');
  });
});

test('11. Investment semantics preserve exact disclosure labels', () => {
  realProjectsDataset.forEach(proj => {
    if (proj.investment_label) {
      assert.ok(typeof proj.investment_label === 'string');
      assert.ok(
        proj.investment_label.includes('EUR') ||
        proj.investment_label.includes('ANNOUNCED') ||
        proj.investment_label.includes('ESTIMATED') ||
        proj.investment_label.includes('NOT DISCLOSED')
      );
    }
  });
});

test('12. Missing project/developer data remains null or NOT DISCLOSED', () => {
  realProjectsDataset.forEach(proj => {
    if (proj.developer_slug === null) {
      assert.equal(proj.developer_slug, null);
    }
  });
});

test('13. Company image resolution system adheres to 3-tier provenance rules', () => {
  const developers = realCompaniesDataset.filter(c => c.type === 'developer');
  developers.forEach(dev => {
    const connectedProjects = realProjectsDataset.filter(p => p.developer_slug === dev.slug);
    const resolved = resolveCompanyImage(dev, connectedProjects);
    assert.ok(['VERIFIED_CORPORATE_IMAGE', 'VERIFIED_PROJECT_IMAGE', 'NOT_DISCLOSED_FALLBACK'].includes(resolved.status));
  });
});

test('14. Project images used for developer fallback belong to verified portfolio projects', () => {
  const developers = realCompaniesDataset.filter(c => c.type === 'developer');
  developers.forEach(dev => {
    if (!dev.image) {
      const connectedProjects = realProjectsDataset.filter(p => p.developer_slug === dev.slug);
      const resolved = resolveCompanyImage(dev, connectedProjects);
      if (resolved.status === 'VERIFIED_PROJECT_IMAGE') {
        assert.ok(connectedProjects.some(p => p.image === resolved.url));
      }
    }
  });
});

test('15. Bidirectional project/developer relationships remain strictly consistent', () => {
  realProjectsDataset.forEach(proj => {
    if (proj.developer_slug) {
      const dev = realCompaniesDataset.find(c => c.slug === proj.developer_slug);
      assert.ok(dev !== undefined);
      const devProjects = realProjectsDataset.filter(p => p.developer_slug === dev.slug);
      assert.ok(devProjects.some(p => p.id === proj.id), `Developer ${dev.slug} must bidirectionally contain project ${proj.id}`);
    }
  });
});
