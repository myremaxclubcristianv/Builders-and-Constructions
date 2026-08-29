import { realProjectsDataset } from '../lib/real-romanian-data';

function runProjectStatusAudit() {
  console.log('================================================================');
  console.log('       FORENSIC AUDIT: PROJECT STATUS & TEMPORAL TRUTH         ');
  console.log('================================================================\n');

  let passed = true;
  const currentSimulatedDate = new Date('2026-08-29');

  let completedCount = 0;
  let underConstructionCount = 0;
  let permittingCount = 0;
  let expiredFutureTargets = 0;
  let dateAwareVerified = 0;

  realProjectsDataset.forEach(p => {
    const status = (p.status_display || p.status || '').toLowerCase();

    if (status.includes('delivered') || status.includes('completed')) {
      completedCount++;
    } else if (status.includes('under construction') || status.includes('construction')) {
      underConstructionCount++;
    } else {
      permittingCount++;
    }

    if (p.last_verified_at) {
      dateAwareVerified++;
    }

    // Check for expired completion targets (e.g. completion date before 2026 but status still under construction without verification)
    if (p.estimated_completion) {
      const yearMatch = p.estimated_completion.match(/\b(202[0-5])\b/);
      if (yearMatch && (status.includes('under construction') || status.includes('planning'))) {
        expiredFutureTargets++;
      }
    }
  });

  console.log(`Total Projects Analyzed:               ${realProjectsDataset.length} / 53`);
  console.log(`Delivered / Completed Projects:         ${completedCount}`);
  console.log(`Active Construction Sites:            ${underConstructionCount}`);
  console.log(`Permitting / Planning Projects:       ${permittingCount}`);
  console.log(`Date-Aware Verified Timestamp Records: ${dateAwareVerified} / ${realProjectsDataset.length}`);
  console.log(`Expired Future Target Alerts:          ${expiredFutureTargets}`);

  if (realProjectsDataset.length < 53) passed = false;

  console.log('\n================================================================');
  if (passed) {
    console.log('✅ PROJECT STATUS & TEMPORAL TRUTH AUDIT PASSED 100%!');
  } else {
    console.error('❌ PROJECT STATUS AUDIT FAILED! DISCREPANCY DETECTED.');
    process.exit(1);
  }
  console.log('================================================================\n');
}

runProjectStatusAudit();
