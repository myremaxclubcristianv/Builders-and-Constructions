import test from "node:test";
import assert from "node:assert/strict";
import {
  getAllKnowledgeCategories,
  getAllMaterials,
  getMaterialBySlug,
  getConcreteClasses,
  getAllConstructionSystems,
  getAllConstructionProcesses,
  getAllGlossaryTerms,
  getAllStandards,
  getAllMaterialComparisons,
  getAllInfrastructure,
  getAllEngineeringDomains,
  getAllEurocodes,
  getAllKnowledgeSources,
  getAllConstructionEquipment,
  getAllProjectLifecycleStages,
  searchKnowledge
} from "../lib/knowledge-data";

test("Knowledge Base — Category Master Registry (A to X Taxonomy)", () => {
  const categories = getAllKnowledgeCategories();
  assert.ok(categories.length >= 10, "Must have master material families");

  const requiredSlugs = [
    "structural-materials",
    "masonry",
    "insulation",
    "waterproofing",
    "finishes",
    "facade-systems",
    "roofing",
    "windows-glass",
    "infrastructure-materials",
    "installations-mep"
  ];

  for (const slug of requiredSlugs) {
    const found = categories.find(c => c.slug === slug);
    assert.ok(found, `Category ${slug} must exist in knowledgeCategories`);
    assert.ok(found.keyGoverningStandards.length > 0, `Category ${slug} must cite governing standards`);
  }
});

test("Knowledge Base — Materials Dataset & Dual View Properties", () => {
  const materials = getAllMaterials();
  assert.ok(materials.length >= 12, "Must have comprehensive list of materials");

  for (const m of materials) {
    assert.ok(m.id && m.slug && m.name && m.romanianName, `Material ${m.id} missing basic identification`);
    assert.ok(m.summary.length > 20, `Material ${m.slug} missing substantive summary`);
    assert.ok(m.governingStandards.length > 0, `Material ${m.slug} must cite official standard`);
    assert.ok(m.keyProperties.length >= 3, `Material ${m.slug} must have >= 3 physical properties`);
    assert.ok(["VERIFIED", "DOCUMENTED", "OBSERVED", "NOT DISCLOSED", "NOT YET VERIFIED"].includes(m.sourceStatus));
  }
});

test("Knowledge Base — Concrete Strength Classes (SR EN 206 / NE 012-1:2022)", () => {
  const concreteClasses = getConcreteClasses();
  assert.ok(concreteClasses.length >= 8, "Must cover standard concrete classes C8/10 to C50/60");

  const c25 = concreteClasses.find(c => c.designation === "C25/30");
  assert.ok(c25, "C25/30 must exist");
  assert.equal(c25.cylinderStrengthMpa, 25, "C25/30 cylinder strength must equal 25 MPa");
  assert.equal(c25.cubeStrengthMpa, 30, "C25/30 cube strength must equal 30 MPa");
  assert.ok(c25.exposureClasses.includes("XC1") || c25.exposureClasses.includes("XC4"));

  const c30 = concreteClasses.find(c => c.designation === "C30/37");
  assert.ok(c30, "C30/37 must exist");
  assert.equal(c30.cylinderStrengthMpa, 30);
  assert.equal(c30.cubeStrengthMpa, 37);
});

test("Knowledge Base — The 10 Eurocode Families (EN 1990 - EN 1999) & 2nd Gen Transition", () => {
  const eurocodes = getAllEurocodes();
  assert.equal(eurocodes.length, 10, "Must cover exactly all 10 Eurocode suites");

  const codes = ["EN 1990", "EN 1991", "EN 1992", "EN 1993", "EN 1994", "EN 1995", "EN 1996", "EN 1997", "EN 1998", "EN 1999"];
  for (const code of codes) {
    const found = eurocodes.find(e => e.code === code);
    assert.ok(found, `Eurocode ${code} must exist in registry`);
    assert.ok(found.romanianAdoption.length > 5, `Eurocode ${code} must have Romanian adoption note`);
    assert.ok(found.keyParts.length > 0, `Eurocode ${code} must list key parts`);
  }
});

test("Knowledge Base — Civil Infrastructure & Heavy Engineering", () => {
  const infra = getAllInfrastructure();
  assert.ok(infra.length >= 5, "Must cover roads, bridges, tunnels, rail, and utilities");

  const domains = ["ROADS & PAVEMENTS", "BRIDGES & VIADUCTS", "TUNNELS & UNDERGROUND", "RAIL INFRASTRUCTURE", "MUNICIPAL UTILITIES"];
  for (const d of domains) {
    const found = infra.find(i => i.domain === d);
    assert.ok(found, `Domain ${d} must exist in infrastructure dataset`);
    assert.ok(found.criticalQualityControls.length > 0, `Domain ${d} must have quality controls`);
  }
});

test("Knowledge Base — Engineering Domains & Building Physics", () => {
  const domains = getAllEngineeringDomains();
  assert.ok(domains.length >= 4, "Must cover geotechnical, physics, fire safety, and acoustics");

  const geotechnical = domains.find(d => d.domainType === "GEOTECHNICAL");
  assert.ok(geotechnical, "Geotechnical engineering must exist");

  const physics = domains.find(d => d.domainType === "BUILDING_PHYSICS");
  assert.ok(physics, "Building physics must exist");

  const fire = domains.find(d => d.domainType === "FIRE_SAFETY");
  assert.ok(fire, "Fire safety must exist");
});

test("Knowledge Base — Official Sources Registry & Tier Hierarchy", () => {
  const sources = getAllKnowledgeSources();
  assert.ok(sources.length >= 5, "Must have traceable sources");

  const cpr = sources.find(s => s.id === "src-cpr-2024");
  assert.ok(cpr, "CPR 2024 source must exist in registry");
  assert.equal(cpr.jurisdiction, "European Union");
});

test("Knowledge Base — Construction Glossary & Terminology", () => {
  const terms = getAllGlossaryTerms();
  assert.ok(terms.length >= 25, "Must have >= 25 glossary terms");

  const requiredAcronyms = ["POT", "CUT", "P+1", "RH", "AC", "U-value", "Thermal Bridge", "Raft Foundation"];
  for (const acr of requiredAcronyms) {
    const found = terms.find(t => t.term.toLowerCase().includes(acr.toLowerCase()) || t.slug.toLowerCase().includes(acr.toLowerCase().replace(/[^a-z0-9]/g, "-")));
    assert.ok(found, `Acronym ${acr} must exist in glossary`);
    assert.ok(found.definition.length > 10, `Acronym ${acr} must have factual definition`);
  }
});

test("Knowledge Base — Search Integration & Discovery", () => {
  // Test 1: Searching "concrete"
  const concreteRes = searchKnowledge("concrete");
  assert.ok(concreteRes.length > 0, "Must return results for concrete");

  // Test 2: Searching "C25/30"
  const c25Res = searchKnowledge("C25/30");
  assert.ok(c25Res.some(r => r.title.includes("C25/30")), "Must find C25/30 class");

  // Test 3: Searching "POT"
  const potRes = searchKnowledge("POT");
  assert.ok(potRes.some(r => r.type === "GLOSSARY"), "Must find POT glossary term");

  // Test 4: Searching "EPS"
  const epsRes = searchKnowledge("EPS");
  assert.ok(epsRes.some(r => r.title.includes("EPS")), "Must find EPS material");

  // Test 5: Searching "NE 012"
  const neRes = searchKnowledge("NE 012");
  assert.ok(neRes.length > 0, "Must find NE 012 references");
});
