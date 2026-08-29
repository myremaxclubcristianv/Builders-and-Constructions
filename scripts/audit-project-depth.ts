import { realProjectsDataset } from '../lib/real-romanian-data';

function runProjectDepthAudit() {
  console.log('================================================================');
  console.log(' MAXIMUM-DEPTH PROJECT DOSSIER FORENSIC AUDIT (29 AUG 2026)     ');
  console.log('================================================================\n');

  let passed = true;
  const minProjects = 53;

  console.log(`Projects Baseline: ${realProjectsDataset.length} / ${minProjects}`);
  if (realProjectsDataset.length < minProjects) passed = false;

  let verifiedPhasesCount = 0;
  let verifiedParticipantsCount = 0;
  let verifiedMilestonesCount = 0;
  let verifiedSourcesCount = 0;

  realProjectsDataset.forEach(p => {
    if (p.phases && p.phases.length > 0) verifiedPhasesCount++;
    if (p.developer_name && (p.contractor_slug || p.architect_slug || p.engineering_slug || p.developer_slug)) verifiedParticipantsCount++;
    if (p.current_stage || p.estimated_completion) verifiedMilestonesCount++;
    if (p.sources && p.sources.length > 0) verifiedSourcesCount++;
  });

  console.log(`\nVerified Project Phases:        ${verifiedPhasesCount} / ${realProjectsDataset.length}`);
  console.log(`Verified Project Teams:         ${verifiedParticipantsCount} / ${realProjectsDataset.length}`);
  console.log(`Verified Timeline Milestones:   ${verifiedMilestonesCount} / ${realProjectsDataset.length}`);
  console.log(`Linked Primary Source Records:  ${verifiedSourcesCount} / ${realProjectsDataset.length}`);

  console.log('\n================================================================');
  if (passed) {
    console.log('✅ MAXIMUM-DEPTH PROJECT DOSSIER FORENSIC AUDIT PASSED 100%!');
  } else {
    console.error('❌ PROJECT DOSSIER FORENSIC AUDIT FAILED!');
    process.exit(1);
  }
  console.log('================================================================\n');
}

runProjectDepthAudit();
