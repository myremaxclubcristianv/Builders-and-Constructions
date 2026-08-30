import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { LeadForm } from '@/components/LeadForm';

export const metadata = {
  title: 'Institutional Partnerships · CONSTRUCTIONS by AiXLuxury',
  description: 'Partner directly with CONSTRUCTIONS by AiXLuxury for institutional research, market intelligence, and custom data solutions.'
};

export default function WorkWithUsPage() {
  return (
    <>
      <SiteHeader />
      <main className="shell pt-24 pb-16">
        <section className="page-hero">
          <div className="eyebrow">Institutional Partnership Desk</div>
          <h1>WORK WITH CONSTRUCTIONS</h1>
          <p className="max-w-xl text-sm leading-relaxed text-[#A0A0A0]">
            Engage directly with CONSTRUCTIONS by AiXLuxury for institutional research mandates, custom market intelligence reports, site coverage, or strategic partnerships.
          </p>
        </section>
        <section className="section">
          <LeadForm kind="work" source="work_with_us" />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
