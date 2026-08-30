import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { LeadForm } from '@/components/LeadForm';

export const metadata = {
  title: 'Work With CONSTRUCTIONS | Platform Partnerships',
  description: 'Partner directly with CONSTRUCTIONS by AiXLuxury for verified profile updates, site media coverage, and institutional research mandates.'
};

export default function Promote() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="page-hero shell">
          <div className="eyebrow">For Construction & Real Estate Companies</div>
          <h1>
            YOUR WORK DESERVES
            <br />
            TO BE SEEN.
          </h1>
          <p>Your projects are real. Your experience is proven. We ensure your digital presentation matches the prestige of your built work.</p>
        </section>
        <section className="section shell">
          <div className="company-grid">
            <div className="company">
              <span className="company-num">01</span>
              <h3>Digital Presence</h3>
              <p>Verified company profile · brand authority · strategic SEO</p>
            </div>
            <div className="company">
              <span className="company-num">02</span>
              <h3>Project Marketing</h3>
              <p>Architectural photography · drone video · progress timelines</p>
            </div>
            <div className="company">
              <span className="company-num">03</span>
              <h3>Institutional Reach</h3>
              <p>Editorial spotlight · verified data audit · research team desk</p>
            </div>
          </div>
        </section>
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
