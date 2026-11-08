import fs from 'node:fs';
import path from 'node:path';
import { realCompaniesDataset, realProjectsDataset } from '../lib/real-romanian-data';

interface QualityAnomaly {
  recordId: string;
  recordType: 'company' | 'project';
  entityName: string;
  affectedField: string;
  currentValue: any;
  problemDetected: string;
  sourceRequiredForConfirmation: string;
  recommendation: string;
}

export function runDataQualityForensicAudit() {
  const anomalies: QualityAnomaly[] = [];

  // 1. Audit Projects
  const projectSlugs = new Set<string>();
  const projectImages = new Map<string, string[]>();

  for (const p of realProjectsDataset) {
    // Check duplicate slug
    if (projectSlugs.has(p.slug)) {
      anomalies.push({
        recordId: p.id,
        recordType: 'project',
        entityName: p.name,
        affectedField: 'slug',
        currentValue: p.slug,
        problemDetected: 'Duplicate project slug found across canonical dataset.',
        sourceRequiredForConfirmation: 'Canonical registry check',
        recommendation: 'Ensure slug uniqueness by suffixing location or phase.'
      });
    }
    projectSlugs.add(p.slug);

    // Check project sources
    if (!p.sources || p.sources.length === 0) {
      anomalies.push({
        recordId: p.id,
        recordType: 'project',
        entityName: p.name,
        affectedField: 'sources',
        currentValue: null,
        problemDetected: 'Project has no documented primary or secondary sources.',
        sourceRequiredForConfirmation: 'Building permit or official investor disclosure',
        recommendation: 'Add primary source citation.'
      });
    }

    // Check image reuse
    if (p.image) {
      const cleanImg = p.image.split('&pid=')[0].split('?')[0];
      const existing = projectImages.get(cleanImg) || [];
      existing.push(p.slug);
      projectImages.set(cleanImg, existing);
    }

    // Check status contradiction
    if (p.name.toLowerCase().includes('delivered') && p.status === 'under_construction') {
      anomalies.push({
        recordId: p.id,
        recordType: 'project',
        entityName: p.name,
        affectedField: 'status',
        currentValue: p.status,
        problemDetected: 'Project name states Delivered but status is under_construction.',
        sourceRequiredForConfirmation: 'Reception protocol (PVRTL) or official developer statement',
        recommendation: 'Update status to completed/delivered or clarify phase name.'
      });
    }

    // Check surface area type
    if (!p.surface_area_sqm && !p.infrastructure_length_km && !p.capacity_seats) {
      anomalies.push({
        recordId: p.id,
        recordType: 'project',
        entityName: p.name,
        affectedField: 'surface_area_sqm',
        currentValue: null,
        problemDetected: 'No physical surface area, infrastructure length, or seating capacity disclosed.',
        sourceRequiredForConfirmation: 'Building permit / Technical Project documentation',
        recommendation: 'Verify built area from cadastre or official release.'
      });
    }
  }

  // Check image collision
  for (const [img, slugs] of projectImages.entries()) {
    if (slugs.length > 2) {
      anomalies.push({
        recordId: slugs.join(','),
        recordType: 'project',
        entityName: slugs.join(', '),
        affectedField: 'image',
        currentValue: img,
        problemDetected: `Stock photo reused across ${slugs.length} projects (${slugs.slice(0, 3).join(', ')}...).`,
        sourceRequiredForConfirmation: 'Official verified on-site project photograph',
        recommendation: 'Replace with verified project-specific photograph or display IMAGE STATUS: NOT DISCLOSED.'
      });
    }
  }

  // 2. Audit Companies
  const companySlugs = new Set<string>();
  const companyCuis = new Set<string>();

  for (const c of realCompaniesDataset) {
    if (companySlugs.has(c.slug)) {
      anomalies.push({
        recordId: c.id,
        recordType: 'company',
        entityName: c.name,
        affectedField: 'slug',
        currentValue: c.slug,
        problemDetected: 'Duplicate company slug found.',
        sourceRequiredForConfirmation: 'ONRC trade register query',
        recommendation: 'Ensure company slug is unique.'
      });
    }
    companySlugs.add(c.slug);

    if (c.cui) {
      const cleanCui = c.cui.replace(/^RO\s*/i, '').trim();
      if (companyCuis.has(cleanCui)) {
        anomalies.push({
          recordId: c.id,
          recordType: 'company',
          entityName: c.name,
          affectedField: 'cui',
          currentValue: c.cui,
          problemDetected: 'Duplicate fiscal code (CUI) detected across company records.',
          sourceRequiredForConfirmation: 'Ministerul Finanțelor / ANAF public query',
          recommendation: 'Reconcile company legal identity and subsidiary structure.'
        });
      }
      companyCuis.add(cleanCui);
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    totalProjectsAudited: realProjectsDataset.length,
    totalCompaniesAudited: realCompaniesDataset.length,
    totalAnomaliesFound: anomalies.length,
    anomalies
  };

  const reportsDir = path.join(process.cwd(), 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  fs.writeFileSync(path.join(reportsDir, 'market-data-quality-audit.json'), JSON.stringify(report, null, 2), 'utf-8');

  let markdown = `# MARKET DATA QUALITY FORENSIC AUDIT REPORT\n\n`;
  markdown += `**Generated**: ${report.generatedAt}\n`;
  markdown += `**Projects Audited**: ${report.totalProjectsAudited}\n`;
  markdown += `**Companies Audited**: ${report.totalCompaniesAudited}\n`;
  markdown += `**Anomalies Flagged**: ${report.totalAnomaliesFound}\n\n`;
  markdown += `| Record Type | Entity Name | Affected Field | Problem Detected | Required Source | Recommendation |\n`;
  markdown += `|---|---|---|---|---|---|\n`;

  for (const a of anomalies) {
    markdown += `| ${a.recordType} | ${a.entityName} | \`${a.affectedField}\` | ${a.problemDetected.replace(/\|/g, '-')} | ${a.sourceRequiredForConfirmation.replace(/\|/g, '-')} | ${a.recommendation.replace(/\|/g, '-')} |\n`;
  }

  fs.writeFileSync(path.join(reportsDir, 'market-data-quality-audit.md'), markdown, 'utf-8');

  console.log(`[DATA QUALITY AUDIT COMPLETE] Audited ${report.totalProjectsAudited} projects, ${report.totalCompaniesAudited} companies. Flagged ${anomalies.length} items for review.`);
  return report;
}

if (require.main === module) {
  runDataQualityForensicAudit();
}
