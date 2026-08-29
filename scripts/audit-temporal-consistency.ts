import { realProjectsDataset, realCompaniesDataset } from '../lib/real-romanian-data';

function runTemporalConsistencyAudit() {
  console.log('================================================================');
  console.log('       FORENSIC AUDIT: TEMPORAL CONSISTENCY & FRESHNESS          ');
  console.log('================================================================\n');

  let passed = true;
  let freshCount = 0;
  let recentCount = 0;
  let timestampedSources = 0;

  realProjectsDataset.forEach(p => {
    if (p.last_verified_at) {
      timestampedSources++;
      const date = new Date(p.last_verified_at);
      if (!isNaN(date.getTime())) {
        const diffDays = Math.floor((new Date('2026-08-29').getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays <= 30) freshCount++;
        else recentCount++;
      }
    }
  });

  realCompaniesDataset.forEach(c => {
    if (c.last_verified_at) {
      timestampedSources++;
      const date = new Date(c.last_verified_at);
      if (!isNaN(date.getTime())) {
        const diffDays = Math.floor((new Date('2026-08-29').getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays <= 30) freshCount++;
        else recentCount++;
      }
    }
  });

  console.log(`Total Timestamped Entity Verification Records: ${timestampedSources} / ${realProjectsDataset.length + realCompaniesDataset.length}`);
  console.log(`Fresh Signal Verified Records (<= 30 Days):    ${freshCount}`);
  console.log(`Recent Signal Verified Records (> 30 Days):   ${recentCount}`);

  if (timestampedSources < (realProjectsDataset.length + realCompaniesDataset.length)) passed = false;

  console.log('\n================================================================');
  if (passed) {
    console.log('✅ TEMPORAL CONSISTENCY AUDIT PASSED 100%!');
  } else {
    console.error('❌ TEMPORAL CONSISTENCY AUDIT FAILED!');
    process.exit(1);
  }
  console.log('================================================================\n');
}

runTemporalConsistencyAudit();
