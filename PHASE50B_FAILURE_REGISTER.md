# PHASE 50B — FORENSIC FAILURE REGISTER

## OVERVIEW

This document records all discrepancies, source-tier inflations, entity misclassifications, and data model collisions discovered during the Phase 50B forensic failure investigation.

---

## FAILURE LOG

| Failure ID | Entity | Field | Existing Value | Problem / Contradiction | Evidence | Correction Applied | Severity |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **FAIL-50B-01** | 13 Developer Entities | `verification_level` | `OFFICIAL_REGISTRY_VERIFIED` | **Source-Tier Inflation:** Primary sources listed in dataset point to corporate web domains (`nordis.ro`, `granvia.ro`, `atenor.eu`, `ctp.eu`, etc.), which prove Tier 2 corporate identity but not Tier 1 ONRC/ANAF registry filings. | Primary source URLs inspect corporate websites rather than ONRC/ANAF portals. | Calibrated `verification_level` from `OFFICIAL_REGISTRY_VERIFIED` to `OFFICIAL_CORPORATE_VERIFIED` across all 13 entities. | **HIGH** |
| **FAIL-50B-02** | CTPark Cluj (`ctpark-cluj`) | `type` / Entity Record | `type: "developer"` | **Project Asset Classified as Developer:** CTPark Cluj is a logistics park asset brand of parent developer CTP Romania (`ctp-romania`), not an independent legal developer company. | Official CTP NV corporate disclosures (`ctp.eu/romania`) identify CTPark Cluj as a logistics property asset. | Removed `comp-ctp-cluj-development` from `realCompaniesDataset`. Reassigned project `ctpark-cluj-logistics` to developer `ctp-romania`. | **CRITICAL** |
| **FAIL-50B-03** | Speedwell Riverside Arad (`speedwell-riverside-arad`) | `type` / Entity Record | `type: "developer"` | **Project Asset Classified as Developer:** Speedwell Riverside Arad is a mixed-use development asset of parent developer Speedwell (`speedwell`), not an independent company. | Official Speedwell NV filings (`speedwell.be`) confirm Riverside Arad is a development project name. | Removed `comp-speedwell-riverside-arad` from `realCompaniesDataset`. Reassigned project `speedwell-riverside-arad-site` to developer `speedwell`. | **CRITICAL** |
| **FAIL-50B-04** | PORR Construct Romania (`comp-porr-construct`) | `id` / Entity Record | `id: "comp-porr-construct"` (Duplicate) | **Technical Duplicate ID Collision:** Two separate object blocks in `realCompaniesDataset` shared `id: "comp-porr-construct"` (one with `slug: porr-construct-romania`, one with `slug: porr-construct`). | Duplicate ID collision detected by node test runner. | Removed technical duplicate block (`slug: porr-construct`). Retained primary entry (`slug: porr-construct-romania`) and updated all contractor references. | **HIGH** |
| **FAIL-50B-05** | Baseline Developer Dataset | `cui` | Unverified CUI Numbers in Reports | **Contradictory CUI Metric Representation:** Previous reports claimed `CUI VERIFIED: 0` while rendering CUI values in tables. | Baseline TypeScript dataset preserves `cui: undefined` for companies where primary ONRC/ANAF filings are not attached. | Standardized factual data state: unverified CUI values strictly remain `undefined` (`NOT DISCLOSED`) in TypeScript dataset and render cleanly on public UI. Zero synthetic CUIs exist. | **MEDIUM** |

---

## ENTITY COUNT RECONCILIATION LEDGER

```text
BASELINE COMPANY ENTITIES:                      146
  - Removed Project Asset (CTPark Cluj):          -1
  - Removed Project Asset (Speedwell Arad):       -1
  - Removed Technical Duplicate (PORR Construct): -1
---------------------------------------------------
RECONCILED UNIQUE COMPANY MASTER ENTITIES:      143
```

```text
COMPANY TYPES BREAKDOWN (N = 143):
  ├── Developer Companies:                       48
  ├── General Contractors:                       26
  ├── Architecture Firms:                        21
  ├── Real Estate Agencies:                      20
  ├── Engineering / Structural / MEP / Infra:    28
  └── TOTAL:                                    143 (100% Reconciled)
```
