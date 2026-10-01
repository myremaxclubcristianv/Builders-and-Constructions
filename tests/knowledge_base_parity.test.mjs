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
  searchKnowledge
} from "../lib/knowledge-data.js";

test("Knowledge Base — Category Master Registry", () => {
  const categories = getAllKnowledgeCategories();
  assert.ok(categories.length >= 10, "Must have at least 10 master material families");

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

test("Knowledge Base — Materials Dataset & Fact Verification", () => {
  const materials = getAllMaterials();
  assert.ok(materials.length >= 14, "Must have comprehensive list of materials");

  for (const m of materials) {
    assert.ok(m.id && m.slug && m.name && m.romanianName, `Material ${m.id} missing basic identification`);
    assert.ok(m.summary.length > 20, `Material ${m.slug} missing substantive summary`);
    assert.ok(m.governingStandards.length > 0, `Material ${m.slug} must cite official standard`);
    assert.ok(m.keyProperties.length >= 3, `Material ${m.slug} must have >= 3 physical properties`);
    assert.ok(["VERIFIED", "DOCUMENTED", "OBSERVED", "NOT DISCLOSED", "NOT YET VERIFIED"].includes(m.sourceStatus));
    assert.ok(m.sourceTier.includes("TIER 1") || m.sourceTier.includes("TIER 2") || m.sourceTier.includes("TIER 3"));
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

test("Knowledge Base — Structural Systems & P100-1/2013 Romanian Seismic Code", () => {
  const systems = getAllConstructionSystems();
  assert.ok(systems.length >= 6, "Must cover at least 6 major structural typologies");

  for (const sys of systems) {
    assert.ok(sys.structuralPrinciple.length > 20, `System ${sys.slug} missing principle`);
    assert.ok(sys.seismicBehavior.length > 20, `System ${sys.slug} missing P100-1 seismic behavior`);
    assert.ok(sys.advantages.length > 0 && sys.limitations.length > 0);
  }
});

test("Knowledge Base — 15-Stage Construction Execution Lifecycle", () => {
  const processes = getAllConstructionProcesses();
  assert.equal(processes.length, 15, "Must strictly have all 15 execution steps");

  for (let i = 1; i <= 15; i++) {
    const step = processes.find(p => p.stepNumber === i);
    assert.ok(step, `Execution step ${i} must exist`);
    assert.ok(step.criticalQualityControls.length > 0, `Step ${i} must have quality controls`);
    assert.ok(step.deliverablesAndReception.length > 0, `Step ${i} must specify reception acts (PVLA / Carte)`);
  }
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

test("Knowledge Base — Standards & Normatives Registry", () => {
  const standards = getAllStandards();
  assert.ok(standards.length >= 10, "Must have >= 10 official governing standards");

  const en206 = standards.find(s => s.code.includes("EN 206"));
  assert.ok(en206, "SR EN 206 must exist in registry");

  const p100 = standards.find(s => s.code.includes("P100-1"));
  assert.ok(p100, "P100-1/2013 must exist in registry");
});

test("Knowledge Base — Search Integration & Discovery", () => {
  // Test 1: Searching "concrete"
  const concreteRes = searchKnowledge("concrete");
  assert.ok(concreteRes.length > 0, "Must return results for concrete");
  assert.ok(concreteRes.some(r => r.type === "MATERIAL" || r.type === "CONCRETE_CLASS"));

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
