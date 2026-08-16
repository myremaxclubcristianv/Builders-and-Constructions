import {SiteHeader} from '@/components/SiteHeader';
import {SiteFooter} from '@/components/SiteFooter';
import {LeadForm} from '@/components/LeadForm';

export const metadata = {
  title: 'Promote Your Company | CONSTRUCTIONS by AiXLuxury',
  description: 'Turn your construction, engineering, or development practice into a prestigious digital brand.'
};

export default function Promote(){
  return (
    <>
      <SiteHeader/>
      <main>
        <section className="page-hero shell">
          <div className="eyebrow">For Construction & Real Estate Companies</div>
          <h1>YOUR WORK DESERVES<br/>TO BE SEEN.</h1>
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
              <h3>High-Intent Leads</h3>
              <p>Editorial spotlight · corporate inquiry capture · client routing</p>
            </div>
          </div>
        </section>
        <section className="section shell" style={{paddingTop:0}}>
          <div className="section-head">
            <div>
              <div className="eyebrow">Start a Conversation</div>
              <h2>GET YOUR COMPANY FEATURED</h2>
            </div>
          </div>
          <div style={{maxWidth:720}}>
            <LeadForm kind="promote" source="promote_company"/>
          </div>
        </section>
      </main>
      <SiteFooter/>
    </>
  );
}
