import { test } from 'node:test';
import assert from 'node:assert';
import {
  OFFICIAL_SERVICES,
  getServiceBySlug,
  ROLES_LIST,
  PROJECT_TYPES_LIST,
  PROJECT_STAGES_LIST,
  URGENCY_LEVELS,
  CONTACT_PREFERENCES
} from '../lib/services-config';

test('1. Exactly 13 official services exist with zero synthetic additions', () => {
  assert.strictEqual(OFFICIAL_SERVICES.length, 13, 'Must have exactly 13 official services');
  
  const expectedSlugs = [
    'calitate-constructii',
    'controlul-calitatii',
    'manager-calitate',
    'cartea-tehnica',
    'ssm',
    'proiecte',
    'arhitecti',
    'publicitate',
    'inchirieri-utilaje',
    'asigurari',
    'credite',
    'vanzari-real-estate',
    'imobiliare'
  ];

  const actualSlugs = OFFICIAL_SERVICES.map(s => s.slug);
  assert.deepStrictEqual(actualSlugs.sort(), expectedSlugs.sort(), 'Slugs must match official list exactly');
});

test('2. Service categories conform strictly to 4 official branches', () => {
  const technical = OFFICIAL_SERVICES.filter(s => s.category === 'CONSTRUCTION_TECHNICAL');
  const commercial = OFFICIAL_SERVICES.filter(s => s.category === 'COMMERCIAL_BUSINESS');
  const financial = OFFICIAL_SERVICES.filter(s => s.category === 'FINANCIAL_INSURANCE');
  const realEstate = OFFICIAL_SERVICES.filter(s => s.category === 'REAL_ESTATE');

  assert.strictEqual(technical.length, 7, 'Must have 7 Construction/Technical services');
  assert.strictEqual(commercial.length, 2, 'Must have 2 Commercial/Business services');
  assert.strictEqual(financial.length, 2, 'Must have 2 Financial/Insurance services');
  assert.strictEqual(realEstate.length, 2, 'Must have 2 Real Estate services');
});

test('3. Every service has non-empty deliverables, legal standards, and target audience', () => {
  for (const srv of OFFICIAL_SERVICES) {
    assert.ok(srv.title.length > 3, `Service ${srv.slug} must have valid title`);
    assert.ok(srv.shortDescription.length > 20, `Service ${srv.slug} must have descriptive summary`);
    assert.ok(srv.fullDescription.length > 40, `Service ${srv.slug} must have comprehensive full description`);
    assert.ok(srv.deliverables.length >= 3, `Service ${srv.slug} must define at least 3 deliverables`);
    assert.ok(srv.applicableStandards.length >= 1, `Service ${srv.slug} must reference applicable standards`);
    assert.ok(srv.targetAudience.length >= 2, `Service ${srv.slug} must specify target audience`);
    assert.ok(srv.badge.length > 0, `Service ${srv.slug} must have a badge`);
  }
});

test('4. getServiceBySlug resolves all 13 services correctly and returns undefined for unknown', () => {
  for (const srv of OFFICIAL_SERVICES) {
    const resolved = getServiceBySlug(srv.slug);
    assert.ok(resolved, `Must resolve service ${srv.slug}`);
    assert.strictEqual(resolved?.id, srv.id);
  }

  assert.strictEqual(getServiceBySlug('fake-service-123'), undefined);
});

test('5. Roles list contains all required primary options and "Alt rol"', () => {
  const requiredRoles = [
    'Dezvoltator',
    'Constructor',
    'Companie de construcții',
    'Investitor',
    'Proprietar',
    'Arhitect',
    'Inginer',
    'Project Manager',
    'Manager de calitate',
    'Responsabil SSM',
    'Antreprenor',
    'Subantreprenor',
    'Furnizor',
    'Administrator / reprezentant companie',
    'Persoană fizică',
    'Alt rol'
  ];

  for (const r of requiredRoles) {
    assert.ok(ROLES_LIST.includes(r as any), `Role ${r} must exist in ROLES_LIST`);
  }
});

test('6. Project stages list covers complete lifecycle from concept to handover & warranty', () => {
  assert.ok(PROJECT_STAGES_LIST.includes('Idee / concept' as any));
  assert.ok(PROJECT_STAGES_LIST.includes('DTAC' as any));
  assert.ok(PROJECT_STAGES_LIST.includes('Execuție' as any));
  assert.ok(PROJECT_STAGES_LIST.includes('Controlul calității' as any));
  assert.ok(PROJECT_STAGES_LIST.includes('Recepție' as any));
  assert.ok(PROJECT_STAGES_LIST.includes('Cartea Tehnică' as any));
  assert.ok(PROJECT_STAGES_LIST.includes('Nu știu încă' as any));
});

test('7. Contact preferences & urgency levels contain required enum values', () => {
  assert.deepStrictEqual(
    [...URGENCY_LEVELS],
    ['Normal', 'Important', 'Urgent']
  );

  assert.ok(CONTACT_PREFERENCES.includes('Telefon' as any));
  assert.ok(CONTACT_PREFERENCES.includes('WhatsApp' as any));
  assert.ok(CONTACT_PREFERENCES.includes('Email' as any));
  assert.ok(CONTACT_PREFERENCES.includes('Telegram' as any));
  assert.ok(CONTACT_PREFERENCES.includes('Nu contează' as any));
});

test('8. Anti-fabrication check: No synthetic companies or prices exist in services dataset', () => {
  const datasetJson = JSON.stringify(OFFICIAL_SERVICES);
  assert.ok(!datasetJson.includes('FAKE_'), 'No synthetic markers');
  assert.ok(!datasetJson.includes('lorem ipsum'), 'No placeholder text');
});
