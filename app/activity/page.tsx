import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { getIndustryHubData } from '@/lib/data';

export const metadata = {
  title: 'Real-Time Romanian Market Signals & Construction News · CONSTRUCTIONS by AiXLuxury',
  description: 'Verified chronological market signals, construction milestones, building permit issuances, lease agreements, and acquisitions in Romania.'
};

export default async function ActivityPage() {
  const { marketActivity } = await getIndustryHubData();

  return (
    <>
      <main>
        <div className="hero" style={{ paddingBottom: 40 }}>
          <SiteHeader />
          <div className="shell hero-content">
            <div className="eyebrow" style={{ color: '#c7a675' }}>Live Market Intelligence Stream</div>
            <h1>ROMANIAN CONSTRUCTION & REAL ESTATE ACTIVITY</h1>
            <p>Chronological feed of verified building permits, structural milestones, land acquisitions, anchor lease signings, and project deliveries across Romanian markets.</p>
          </div>
        </div>

        <section className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>Chronological Feed</div>
              <h2>LIVE MARKET SIGNALS ({marketActivity.length})</h2>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 900 }}>
            {marketActivity.map((sig: any) => (
              <article
                key={sig.id}
                style={{
                  background: '#141715',
                  border: '1px solid #262927',
                  borderRadius: 8,
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: 3,
                        background: sig.commercial_relevance === 'CRITICAL' ? 'rgba(239,68,68,0.15)' : 'rgba(56,189,248,0.15)',
                        color: sig.commercial_relevance === 'CRITICAL' ? '#ef4444' : '#38bdf8',
                        border: `1px solid ${sig.commercial_relevance === 'CRITICAL' ? '#ef4444' : '#38bdf8'}`
                      }}
                    >
                      {sig.signal_type.replaceAll('_', ' ')}
                    </span>
                    <span style={{ fontSize: 11, color: '#888' }}>{sig.location}</span>
                  </div>

                  <span style={{ fontSize: 11, color: '#aaa9a1', fontWeight: 600 }}>
                    Event Date: {sig.event_date}
                  </span>
                </div>

                <h3 style={{ fontSize: 20, color: '#fff', margin: 0, fontWeight: 700 }}>{sig.title}</h3>

                <p style={{ fontSize: 14, color: '#ccc', lineHeight: 1.5, margin: 0 }}>{sig.summary}</p>

                {sig.why_it_matters && (
                  <div style={{ padding: '10px 14px', background: '#0e110f', borderRadius: 4, borderLeft: '3px solid #c7a675', fontSize: 12, color: '#c7a675' }}>
                    <strong>WHY IT MATTERS:</strong> {sig.why_it_matters}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #222523', paddingTop: 14, marginTop: 4 }}>
                  <div style={{ fontSize: 12, color: '#aaa' }}>
                    Entity: <Link href={`/companies/${sig.company_slug}`} style={{ color: '#fff', fontWeight: 700, textDecoration: 'none' }}>{sig.company_name}</Link>
                    {sig.project_name && (
                      <>
                        {' · '}
                        Project: <Link href={`/projects/${sig.project_slug}`} style={{ color: '#c7a675', fontWeight: 700, textDecoration: 'none' }}>{sig.project_name}</Link>
                      </>
                    )}
                  </div>

                  {sig.source_url && (
                    <a
                      href={sig.source_url}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: 11, color: '#38bdf8', textDecoration: 'underline' }}
                    >
                      Source Citation ↗
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
