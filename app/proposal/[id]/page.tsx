import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getServiceClient } from '@/lib/supabase';
import { SALES_SERVICE_CATALOG } from '@/lib/services';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export const dynamic = 'force-dynamic';

export default async function ProposalClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = getServiceClient();

  let proposal: any = null;
  let company: any = null;

  if (client) {
    const { data: prop } = await client.from('proposals').select('*').eq('id', id).maybeSingle();
    if (prop) {
      proposal = prop;
      const { data: comp } = await client.from('companies').select('*').eq('id', prop.company_id).maybeSingle();
      company = comp;
    }
  }

  // Fallback demo proposal if unconfigured or mock id
  if (!proposal) {
    proposal = {
      id,
      title: 'Digital Authority & Masterplan Showcase Engagement',
      status: 'draft',
      services: ['WEBSITE', 'PROJECT_MARKETING', 'PHOTOGRAPHY', 'VIDEO', 'LEAD_GENERATION'],
      objectives: 'Establish high-prestige digital presence, present verified landmark projects, and capture direct private developer inquiries.',
      scope: 'Custom architectural website development, full 4K drone video documentation, professional jobsite photoshoot, and verified indexation on CONSTRUCTIONS by AiXLuxury.',
      estimated_value: 6500,
      created_at: new Date().toISOString()
    };
    company = {
      name: 'Architectural & Engineering Group',
      type: 'General Contractor',
      location: 'Bucharest, Romania'
    };
  }

  return (
    <>
      <main>
        <div className="hero" style={{ paddingBottom: 60 }}>
          <SiteHeader />
          <div className="shell hero-content">
            <div className="eyebrow" style={{ color: '#d4af37' }}>
              Strategic Commercial Proposal · Client Presentation
            </div>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', margin: '12px 0 16px 0' }}>
              {proposal.title.toUpperCase()}
            </h1>
            <p style={{ maxWidth: 650, fontSize: 16, color: '#d1cfc7', lineHeight: 1.6 }}>
              Prepared exclusively for <strong style={{ color: '#fff' }}>{company.name}</strong> by CONSTRUCTIONS by AiXLuxury.
            </p>
          </div>
        </div>

        {/* Executive Summary & Scope */}
        <section className="section shell" style={{ paddingTop: 40 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
            <div className="admin-panel" style={{ background: '#141715', border: '1px solid #262927' }}>
              <div className="eyebrow" style={{ color: '#d4af37' }}>
                Strategic Objectives
              </div>
              <h3 style={{ fontSize: 20, margin: '8px 0 12px 0', color: '#fff' }}>TRANSFORMATION GOALS</h3>
              <p style={{ fontSize: 14, color: '#ccc', lineHeight: 1.7 }}>
                {proposal.objectives || 'Transform existing project portfolio into an authoritative digital asset, elevate engineering prestige, and capture institutional procurement leads.'}
              </p>
            </div>

            <div className="admin-panel" style={{ background: '#141715', border: '1px solid rgba(212, 175, 55, 0.4)' }}>
              <div className="eyebrow" style={{ color: '#86efac' }}>
                Scope of Deliverables
              </div>
              <h3 style={{ fontSize: 20, margin: '8px 0 12px 0', color: '#fff' }}>SCOPE & EXECUTION</h3>
              <p style={{ fontSize: 14, color: '#ccc', lineHeight: 1.7 }}>
                {proposal.scope || 'Custom responsive digital infrastructure, verified consortium attribution, architectural media production, and direct commercial inquiry routing.'}
              </p>
            </div>
          </div>
        </section>

        {/* Selected Services Breakdown */}
        <section className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#d4af37' }}>Structured Deliverables</div>
              <h2>PROPOSED SERVICE MODULES</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginTop: 24 }}>
            {(proposal.services || []).map((srvKey: string) => {
              const srv = SALES_SERVICE_CATALOG[srvKey] || {
                name: srvKey,
                category: 'Growth',
                description: 'Bespoke high-performance digital delivery.',
                typicalDeliverables: ['Standard deliverable specification']
              };

              return (
                <div key={srvKey} style={{ background: '#141715', border: '1px solid #262927', padding: 24, borderRadius: 8 }}>
                  <span className="eyebrow" style={{ color: '#d4af37' }}>{srv.category}</span>
                  <h3 style={{ fontSize: 18, color: '#fff', margin: '8px 0 10px 0' }}>{srv.name}</h3>
                  <p style={{ fontSize: 13, color: '#aaa9a1', lineHeight: 1.6, marginBottom: 14 }}>{srv.description}</p>
                  <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: '#d1cfc7', lineHeight: 1.7 }}>
                    {srv.typicalDeliverables.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* Next Steps & Commercial Contact */}
        <section className="conversion" style={{ marginTop: 60 }}>
          <div className="shell">
            <div className="eyebrow" style={{ color: '#25221b' }}>Ready To Proceed</div>
            <h2>AUTHORIZE THIS ENGAGEMENT</h2>
            <p style={{ maxWidth: 580, margin: '0 auto 24px auto' }}>
              Confirm your scope of work with the CONSTRUCTIONS by AiXLuxury editorial & commercial leadership team.
            </p>
            <Link className="btn" href={`mailto:commercial@aixluxury.com?subject=Proposal%20Authorization%20—%20${encodeURIComponent(company.name)}`}>
              Confirm & Schedule Briefing →
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
