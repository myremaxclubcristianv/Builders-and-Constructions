import {SiteHeader} from '@/components/SiteHeader';
import {SiteFooter} from '@/components/SiteFooter';
import {LeadForm} from '@/components/LeadForm';

export const metadata = {
  title: 'Promote Your Project | CONSTRUCTIONS by AiXLuxury',
  description: 'Present your active construction or upcoming development to investors, partners, and the market.'
};

export default function ProjectPromotion(){
  return (
    <>
      <SiteHeader/>
      <main className="shell">
        <section className="page-hero">
          <div className="eyebrow">For Developers, General Contractors & Architects</div>
          <h1>PROMOTE THIS<br/>PROJECT.</h1>
          <p>Make a current or upcoming development visible through verified progress documentation, architectural imagery, and targeted investor placement.</p>
        </section>
        <section className="section">
          <div style={{maxWidth:720}}>
            <LeadForm kind="project" source="promote_project"/>
          </div>
        </section>
      </main>
      <SiteFooter/>
    </>
  );
}
