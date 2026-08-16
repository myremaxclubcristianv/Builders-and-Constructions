import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { LeadForm } from '@/components/LeadForm';

export const metadata = {
  title: 'Promote Your Project | Development Showcase',
  description: 'Present your active construction or upcoming development to investors, partners, and the market.'
};

export default function PromoteProjectPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-hero shell">
          <div className="eyebrow">For Developers, General Contractors & Architects</div>
          <h1>
            PROMOTE THIS
            <br />
            PROJECT.
          </h1>
          <p>
            From ground breaking to milestone delivery, give your project the authoritative digital presence
            it deserves with verified progress documentation, architectural imagery, and market reach.
          </p>
        </section>

        <section className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow">Project Marketing Capabilities</div>
              <h2>END-TO-END PROJECT INTELLIGENCE</h2>
            </div>
          </div>

          <div className="company-grid">
            <div className="company">
              <span className="company-num">01 · Identity</span>
              <h3>Project Showcase</h3>
              <p>
                A dedicated, verified profile highlighting masterplan specs, consortium partners (contractor, architect, engineering), and timeline milestones.
              </p>
            </div>

            <div className="company">
              <span className="company-num">02 · Documentation</span>
              <h3>Progress & Drone</h3>
              <p>
                Milestone verification, high-resolution photography, and monthly drone progress reports for stakeholder transparency and marketing.
              </p>
            </div>

            <div className="company">
              <span className="company-num">03 · Commercial</span>
              <h3>Investor Reach</h3>
              <p>
                Direct placement across CONSTRUCTIONS by AiXLuxury intelligence channels, editorial stories, and search indexing.
              </p>
            </div>
          </div>
        </section>

        <section className="section shell" style={{ paddingTop: 0 }}>
          <div className="section-head">
            <div>
              <div className="eyebrow">Start a Conversation</div>
              <h2>FEATURE YOUR PROJECT</h2>
            </div>
          </div>
          <div style={{ maxWidth: 720 }}>
            <LeadForm kind="project" source="promote_project" />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
