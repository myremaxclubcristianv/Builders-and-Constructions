import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getServiceClient } from '@/lib/supabase';
import { adminLogDataExport } from '@/lib/admin-data';

function toCsvString(headers: string[], rows: any[][]): string {
  const escapeVal = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const headerLine = headers.map(escapeVal).join(',');
  const dataLines = rows.map(r => r.map(escapeVal).join(','));
  return [headerLine, ...dataLines].join('\n');
}

export async function GET(request: Request) {
  try {
    const admin = await requireAdmin('admin', 'editor', 'sales');
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'companies';

    const client = getServiceClient();
    let csvContent = '';
    const filename = `${type}-export-${new Date().toISOString().slice(0, 10)}.csv`;
    let recordCount = 0;

    if (!client) {
      csvContent = toCsvString(['id', 'name', 'type', 'location'], [['demo-1', 'Erbașu Construcții', 'Construction Company', 'Bucharest']]);
      recordCount = 1;
    } else if (type === 'companies' || type === 'golden-dataset') {
      const { data } = await client.from('companies').select('id, name, slug, legal_name, cui_cif, type, location, city, county, website, website_verification, content_state, research_state, created_at');
      const rows = (data || []).map(c => [c.id, c.name, c.legal_name || c.name, c.cui_cif || 'N/A', c.slug, c.type, c.location, c.city, c.county, c.website, c.website_verification, c.content_state, c.research_state, c.created_at]);
      csvContent = toCsvString(['ID', 'Name', 'Legal Name', 'CUI/CIF', 'Slug', 'Type', 'Location', 'City', 'County', 'Website', 'Verification', 'Content State', 'Research State', 'Created At'], rows);
      recordCount = rows.length;
    } else if (type === 'projects') {
      const { data } = await client.from('projects').select('id, name, slug, type, status, location, city, country, building_permit_number, content_state, research_state, created_at');
      const rows = (data || []).map(p => [p.id, p.name, p.slug, p.type, p.status, p.location, p.city, p.country, p.building_permit_number || 'N/A', p.content_state, p.research_state, p.created_at]);
      csvContent = toCsvString(['ID', 'Name', 'Slug', 'Type', 'Status', 'Location', 'City', 'Country', 'Building Permit', 'Content State', 'Research State', 'Created At'], rows);
      recordCount = rows.length;
    } else if (type === 'decision-makers') {
      const { data } = await client.from('decision_makers').select('id, company_id, name, role, email, phone, linkedin_url, verification_state, verified_at, source');
      const rows = (data || []).map(d => [d.id, d.company_id, d.name, d.role, d.email, d.phone, d.linkedin_url, d.verification_state, d.verified_at, d.source]);
      csvContent = toCsvString(['ID', 'Company ID', 'Name', 'Role', 'Email', 'Phone', 'LinkedIn', 'Verification State', 'Verified Date', 'Source Provenance'], rows);
      recordCount = rows.length;
    } else if (type === 'opportunities' || type === 'acquisition-priorities') {
      const { data } = await client.from('private_opportunity_scores').select('company_id, opportunity, opportunity_score, pipeline_status, next_action, next_action_date, last_contacted_at, updated_at');
      const rows = (data || []).map(o => [o.company_id, o.opportunity, o.opportunity_score, o.pipeline_status, o.next_action, o.next_action_date, o.last_contacted_at, o.updated_at]);
      csvContent = toCsvString(['Company ID', 'Opportunity Level', 'Priority Score', 'Pipeline Status', 'Next Action', 'Next Action Date', 'Last Contacted', 'Updated At'], rows);
      recordCount = rows.length;
    } else if (type === 'revenue-attributions') {
      const { data } = await client.from('revenue_attributions').select('*');
      const rows = (data || []).map(r => [r.id, r.company_id, r.proposal_id, r.deal_amount, r.service_key, r.city, r.county, r.won_at]);
      csvContent = toCsvString(['ID', 'Company ID', 'Proposal ID', 'Deal Amount (€)', 'Service Package', 'City', 'County', 'Won Date'], rows);
      recordCount = rows.length;
    } else if (type === 'sales-activities') {
      const { data } = await client.from('sales_activities').select('*');
      const rows = (data || []).map(s => [s.id, s.company_id, s.activity_type, s.summary, s.author_name, s.activity_date]);
      csvContent = toCsvString(['ID', 'Company ID', 'Activity Type', 'Summary', 'Author', 'Activity Date'], rows);
      recordCount = rows.length;
    } else {
      const { data } = await client.from('companies').select('id, name');
      const rows = (data || []).map(c => [c.id, c.name]);
      csvContent = toCsvString(['ID', 'Name'], rows);
      recordCount = rows.length;
    }

    // Log the data export event for audit compliance
    await adminLogDataExport({
      actor: admin.email,
      datasetName: type,
      recordCount,
      filters: { type }
    });

    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unauthorized' }, { status: 401 });
  }
}
