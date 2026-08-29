import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { realCompaniesDataset, realProjectsDataset } from '@/lib/real-romanian-data';

export const metadata = {
  title: 'Side-by-Side Market Comparison · CONSTRUCTIONS by AiXLuxury',
  description: 'Compare financial turnover, net profit, employee headcounts, active construction sites, and delivered portfolios across top Romanian developers and general contractors.'
};

export default async function ComparePage({
  searchParams
}: {
  searchParams: Promise<{ c1?: string; c2?: string; c3?: string }>;
}) {
  const { c1 = 'one-united-properties', c2 = 'constructii-erbasu', c3 = 'concelex' } = await searchParams;

  const comp1 = realCompaniesDataset.find(c => c.slug === c1) || realCompaniesDataset[0];
  const comp2 = realCompaniesDataset.find(c => c.slug === c2) || realCompaniesDataset[1];
  const comp3 = realCompaniesDataset.find(c => c.slug === c3) || realCompaniesDataset[2];

  const selectedCompanies = [comp1, comp2, comp3];

  return (
    <>
      <main>
        <div className="hero" style={{ paddingBottom: 40 }}>
          <SiteHeader />
          <div className="shell hero-content">
            <div className="eyebrow" style={{ color: '#c7a675' }}>Comparative Intelligence Engine</div>
            <h1>SIDE-BY-SIDE MARKET COMPARISON</h1>
            <p>Compare reported financial performance, YoY revenue growth, employee productivity, active construction pipelines, and source-verified portfolios across Romanian market entities.</p>
          </div>
        </div>

        <section className="section shell">
          {/* Entity Selector Bar */}
          <div
            style={{
              padding: 20,
              background: '#141715',
              border: '1px solid #262927',
              borderRadius: 6,
              marginBottom: 32
            }}
          >
            <form style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#c7a675' }}>SELECT ENTITIES TO COMPARE:</div>
              
              <select name="c1" defaultValue={comp1.slug} style={{ background: '#0e110f', color: '#fff', border: '1px solid #333', padding: '8px 12px', borderRadius: 4 }}>
                {realCompaniesDataset.map(c => (
                  <option key={c.slug} value={c.slug}>{c.name} ({c.type})</option>
                ))}
              </select>

              <select name="c2" defaultValue={comp2.slug} style={{ background: '#0e110f', color: '#fff', border: '1px solid #333', padding: '8px 12px', borderRadius: 4 }}>
                {realCompaniesDataset.map(c => (
                  <option key={c.slug} value={c.slug}>{c.name} ({c.type})</option>
                ))}
              </select>

              <select name="c3" defaultValue={comp3.slug} style={{ background: '#0e110f', color: '#fff', border: '1px solid #333', padding: '8px 12px', borderRadius: 4 }}>
                {realCompaniesDataset.map(c => (
                  <option key={c.slug} value={c.slug}>{c.name} ({c.type})</option>
                ))}
              </select>

              <button type="submit" className="btn fill" style={{ fontSize: 12, padding: '8px 16px' }}>
                Compare Entities →
              </button>
            </form>
          </div>

          {/* Side-by-Side Comparison Matrix */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: '#141715', border: '1px solid #262927', borderRadius: 6 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #262927' }}>
                  <th style={{ padding: 16, textAlign: 'left', fontSize: 12, color: '#888', width: '22%' }}>METRIC / ATTRIBUTE</th>
                  {selectedCompanies.map(c => (
                    <th key={c.slug} style={{ padding: 16, textAlign: 'left', width: '26%' }}>
                      <div style={{ fontSize: 10, color: '#c7a675', fontWeight: 800 }}>{c.type.replaceAll('_', ' ').toUpperCase()}</div>
                      <div style={{ fontSize: 18, color: '#fff', fontWeight: 700, margin: '4px 0' }}>
                        <Link href={`/companies/${c.slug}`} style={{ color: '#fff', textDecoration: 'none' }}>{c.name}</Link>
                      </div>
                      <div style={{ fontSize: 11, color: '#888' }}>{c.headquarters}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #222523' }}>
                  <td style={{ padding: 14, fontSize: 12, color: '#aaa', fontWeight: 700 }}>2025 REVENUE / TURNOVER</td>
                  {selectedCompanies.map(c => (
                    <td key={c.slug} style={{ padding: 14, fontSize: 16, fontWeight: 800, color: c.financials_2025?.revenue_eur ? '#86efac' : '#888' }}>
                      {c.financials_2025?.revenue_eur ? `€${(c.financials_2025.revenue_eur / 1000000).toFixed(1)}M` : 'NOT DISCLOSED'}
                      <div style={{ fontSize: 10, color: '#777', marginTop: 2 }}>{c.financials_2025?.status || 'N/D'}</div>
                    </td>
                  ))}
                </tr>

                <tr style={{ borderBottom: '1px solid #222523' }}>
                  <td style={{ padding: 14, fontSize: 12, color: '#aaa', fontWeight: 700 }}>2025 NET PROFIT</td>
                  {selectedCompanies.map(c => (
                    <td key={c.slug} style={{ padding: 14, fontSize: 15, fontWeight: 700, color: c.financials_2025?.net_profit_eur ? '#38bdf8' : '#888' }}>
                      {c.financials_2025?.net_profit_eur ? `€${(c.financials_2025.net_profit_eur / 1000000).toFixed(1)}M` : 'NOT DISCLOSED'}
                    </td>
                  ))}
                </tr>

                <tr style={{ borderBottom: '1px solid #222523' }}>
                  <td style={{ padding: 14, fontSize: 12, color: '#aaa', fontWeight: 700 }}>YoY REVENUE GROWTH</td>
                  {selectedCompanies.map(c => (
                    <td key={c.slug} style={{ padding: 14, fontSize: 14, fontWeight: 700, color: c.revenue_growth_yoy && c.revenue_growth_yoy > 0 ? '#22c55e' : '#fff' }}>
                      {c.revenue_growth_yoy ? `+${c.revenue_growth_yoy}%` : 'N/D'}
                    </td>
                  ))}
                </tr>

                <tr style={{ borderBottom: '1px solid #222523' }}>
                  <td style={{ padding: 14, fontSize: 12, color: '#aaa', fontWeight: 700 }}>EMPLOYEE HEADCOUNT</td>
                  {selectedCompanies.map(c => (
                    <td key={c.slug} style={{ padding: 14, fontSize: 14, fontWeight: 700, color: '#fff' }}>
                      {c.employees_count ? `${c.employees_count.toLocaleString()} People` : 'N/D'}
                    </td>
                  ))}
                </tr>

                <tr style={{ borderBottom: '1px solid #222523' }}>
                  <td style={{ padding: 14, fontSize: 12, color: '#aaa', fontWeight: 700 }}>ACTIVE CONSTRUCTION SITES</td>
                  {selectedCompanies.map(c => {
                    const activeCount = realProjectsDataset.filter(p => (p.developer_slug === c.slug || p.contractor_slug === c.slug) && p.status === 'under_construction').length;
                    return (
                      <td key={c.slug} style={{ padding: 14, fontSize: 15, fontWeight: 800, color: '#c7a675' }}>
                        {activeCount} Active Sites
                      </td>
                    );
                  })}
                </tr>

                <tr style={{ borderBottom: '1px solid #222523' }}>
                  <td style={{ padding: 14, fontSize: 12, color: '#aaa', fontWeight: 700 }}>TRACKED DELIVERED PORTFOLIO</td>
                  {selectedCompanies.map(c => {
                    const completedCount = realProjectsDataset.filter(p => (p.developer_slug === c.slug || p.contractor_slug === c.slug) && p.status === 'completed').length;
                    return (
                      <td key={c.slug} style={{ padding: 14, fontSize: 14, fontWeight: 700, color: '#fff' }}>
                        {completedCount} Delivered Projects
                      </td>
                    );
                  })}
                </tr>

                <tr style={{ borderBottom: '1px solid #222523' }}>
                  <td style={{ padding: 14, fontSize: 12, color: '#aaa', fontWeight: 700 }}>CUI / IDENTIFIER</td>
                  {selectedCompanies.map(c => (
                    <td key={c.slug} style={{ padding: 14, fontSize: 12, color: '#86efac', fontWeight: 700 }}>
                      {c.cui_cif || 'N/D'}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td style={{ padding: 14, fontSize: 12, color: '#aaa', fontWeight: 700 }}>VERIFICATION SCORE</td>
                  {selectedCompanies.map(c => (
                    <td key={c.slug} style={{ padding: 14, fontSize: 14, fontWeight: 800, color: c.completeness_score > 90 ? '#86efac' : '#c7a675' }}>
                      {c.completeness_score}% Verified
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
