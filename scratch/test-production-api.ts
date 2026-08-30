async function testProductionInquiriesAPI() {
  const prodUrl = 'https://constructions.cristianvaduva.com/api/inquiries';

  console.log('===========================================================');
  console.log(' PRODUCTION INQUIRIES API ENDPOINT TEST ');
  console.log(' Target:', prodUrl);
  console.log('===========================================================');

  // Test 1: Work With Us Form Submission
  console.log('\n[TEST 1] Submitting /work-with-us payload...');
  try {
    const res = await fetch(prodUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Verification Test Agent',
        email: 'test@constructions.cristianvaduva.com',
        company: 'CONSTRUCTIONS QA Desk',
        requestType: 'Institutional Research Mandate',
        message: 'Production API pipeline verification test',
        source: 'work_with_us',
        leadType: 'partnership_request'
      })
    });
    const status = res.status;
    const body = await res.json();
    console.log('  HTTP Status:', status);
    console.log('  API Response:', body);
  } catch (err) {
    console.error('  Fetch Error:', err);
  }

  // Test 2: Research Request Form Submission
  console.log('\n[TEST 2] Submitting /research-request payload...');
  try {
    const res = await fetch(prodUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Verification Test Agent',
        email: 'test@constructions.cristianvaduva.com',
        company: 'One United Properties',
        requestType: 'Company',
        message: 'Research Request — Subject: One United Properties',
        source: 'research_request_form',
        leadType: 'research_request'
      })
    });
    const status = res.status;
    const body = await res.json();
    console.log('  HTTP Status:', status);
    console.log('  API Response:', body);
  } catch (err) {
    console.error('  Fetch Error:', err);
  }

  // Test 3: Report Error Form Submission
  console.log('\n[TEST 3] Submitting /report-error payload...');
  try {
    const res = await fetch(prodUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Verification Test Agent',
        email: 'test@constructions.cristianvaduva.com',
        company: 'Constructii Erbasu',
        requestType: 'Profile Correction',
        message: 'CORRECTION REQUEST: Entity: Constructii Erbasu | Field: Built Area | Proposed: 92000 sqm',
        source: 'report_error',
        leadType: 'correction_request'
      })
    });
    const status = res.status;
    const body = await res.json();
    console.log('  HTTP Status:', status);
    console.log('  API Response:', body);
  } catch (err) {
    console.error('  Fetch Error:', err);
  }

  console.log('\n===========================================================');
}

testProductionInquiriesAPI();
