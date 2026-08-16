import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { LeadForm } from '@/components/LeadForm';

export const metadata = {
  title: 'Promote Your Company | Commercial Presentation',
  description: 'Turn your construction, engineering, or development practice into a prestigious digital brand.'
};

export default function PromoteCompanyPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-hero shell">
          <div className="eyebrow">For Construction Companies, Developers & Engineering Practices</div>
          <h1>
            YOUR WORK DESERVES
            <br />
            TO BE SEEN.
          </h1>
          <p>
            Your construction sites and completed buildings are real. Your engineering expertise is proven.
            We ensure your digital presentation reflects the true caliber of your work.
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
              <span className="company-num">03 · Growth & Leads</span>
              <h3>Inbound Conversion</h3>
              <p>
                Search engine dominance, targeted market positioning, and direct routing of high-intent development & procurement inquiries.
              </p>
            </div>
          </div>
        </section>

        {/* Lead Form */}
        <section className="section shell" style={{ paddingTop: 0 }}>
          <div className="section-head">
            <div>
              <div className="eyebrow">Start a Conversation</div>
              <h2>REQUEST COMPANY PROMOTION</h2>
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
