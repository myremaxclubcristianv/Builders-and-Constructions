import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { LeadForm } from '@/components/LeadForm';

export const metadata = {
  title: 'Work With CONSTRUCTIONS | Institutional Presentation & Platform Partnership',
  description: 'Engage directly with CONSTRUCTIONS by AiXLuxury for institutional research mandates, custom data solutions, site coverage, or strategic partnerships.'
};

export default function PromoteCompanyPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-hero shell">
          <div className="eyebrow">Institutional Presentation & Coverage Desk</div>
          <h1>
            INSTITUTIONAL MARKET
            <br />
            PRESENTATION.
          </h1>
          <p>
            Your construction sites and completed buildings are real. Your engineering expertise is proven.
            We ensure your digital presentation reflects the true caliber of your built work.
          </p>
        </section>

        {/* Value Proposition Cards */}
        <section className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow">Capabilities & Solutions</div>
              <h2>HOW WE ELEVATE YOUR PRACTICE</h2>
            </div>
          </div>

          <div className="company-grid">
            <div className="company">
              <span className="company-num">01 · Presentation</span>
              <h3>Premium Profile</h3>
              <p>
                A bespoke, editorially verified company profile that connects your historical portfolio, current construction sites, and consortium partners.
              </p>
            </div>

            <div className="company">
              <span className="company-num">02 · Digital Assets</span>
              <h3>Photography & Video</h3>
              <p>
                Architectural photography, drone footage, and construction progress documentation that captivate institutional investors and prospective clients.
              </p>
            </div>

            <div className="company">
              <span className="company-num">03 · Institutional Coverage</span>
              <h3>Market Intelligence</h3>
              <p>
                Search engine dominance, targeted market positioning, and direct research team collaboration for verified data audits and site coverage.
              </p>
            </div>
          </div>
        </section>

        {/* Lead Form */}
        <section className="section shell" style={{ paddingTop: 0 }}>
          <div className="section-head">
            <div>
              <div className="eyebrow">Start a Conversation</div>
              <h2>WORK WITH CONSTRUCTIONS</h2>
            </div>
          </div>
          <div style={{ maxWidth: 720 }}>
            <LeadForm kind="promote" source="promote_company" />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
