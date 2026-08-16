import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getServiceClient } from '@/lib/supabase';

function toCsvString(headers: string[], rows: any[][]): string {
  const escapeVal = (v: any) => `"${String(v || '').replace(/"/g, '""')}"`;
  const headerLine = headers.map(escapeVal).join(',');
  const dataLines = rows.map(r => r.map(escapeVal).join(','));
  return [headerLine, ...dataLines].join('\n');
}

export async function GET(request: Request) {
  try {
    await requireAdmin('admin', 'editor', 'sales');
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'companies';

    const client = getServiceClient();
    let csvContent = '';
    let filename = `${type}-export-${new Date().toISOString().slice(0, 10)}.csv`;

    if (!client) {
      csvContent = toCsvString(['id', 'name', 'type', 'location'], [['demo-1', 'Erbașu Construcții', 'Construction Company', 'Bucharest']]);
    } else if (type === 'companies') {
      const { data } = await client.from('companies').select('id, name, slug, type, location, city, county, website, website_verification, content_state, research_state, created_at');
      const rows = (data || []).map(c => [c.id, c.name, c.slug, c.type, c.location, c.city, c.county, c.website, c.website_verification, c.content_state, c.research_state, c.created_at]);
      csvContent = toCsvString(['ID', 'Name', 'Slug', 'Type', 'Location', 'City', 'County', 'Website', 'Verification', 'Content State', 'Research State', 'Created At'], rows);
    } else if (type === 'projects') {
      const { data } = await client.from('projects').select('id, name, slug, type, status, location, city, country, content_state, research_state, created_at');
      const rows = (data || []).map(p => [p.id, p.name, p.slug, p.type, p.status, p.location, p.city, p.country, p.content_state, p.research_state, p.created_at]);
      csvContent = toCsvString(['ID', 'Name', 'Slug', 'Type', 'Status', 'Location', 'City', 'Country', 'Content State', 'Research State', 'Created At'], rows);
    } else if (type === 'opportunities' || type === 'prospects') {
      const { data } = await client.from('private_opportunity_scores').select('company_id, opportunity, opportunity_score, pipeline_status, next_action, next_action_date, last_contacted_at, updated_at');
      const rows = (data || []).map(o => [o.company_id, o.opportunity, o.opportunity_score, o.pipeline_status, o.next_action, o.next_action_date, o.last_contacted_at, o.updated_at]);
      csvContent = toCsvString(['Company ID', 'Opportunity Level', 'Score', 'Pipeline Status', 'Next Action', 'Next Action Date', 'Last Contacted', 'Updated At'], rows);
    } else if (type === 'campaigns') {
      const { data } = await client.from('target_campaigns').select('id, name, description, target_type, target_city, created_at');
      const rows = (data || []).map(c => [c.id, c.name, c.description, c.target_type, c.target_city, c.created_at]);
      csvContent = toCsvString(['ID', 'Name', 'Description', 'Target Type', 'Target City', 'Created At'], rows);
    }

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
