import {notFound} from 'next/navigation';
import {getCompanyBySlug, demoCompanies} from '@/lib/data';
import {SiteHeader} from '@/components/SiteHeader';
import {SiteFooter} from '@/components/SiteFooter';
import {ClaimForm} from '@/components/ClaimForm';

export const metadata = {
  title: 'Claim Profile | CONSTRUCTIONS by AiXLuxury',
  description: 'Claim your company profile to review your information, update your projects and present your work accurately.'
};

export function generateStaticParams() {
  return demoCompanies.map(c => ({ slug: c.slug }));
}

export default async function ClaimPage({params}:{params:Promise<{slug:string}>}){
  const {slug} = await params;
  const data = await getCompanyBySlug(slug);
  if (!data?.company) notFound();
  const company = data.company;

  return (
    <>
      <SiteHeader/>
      <main className="shell">
        <section className="page-hero">
          <div className="eyebrow">Institutional Profile Verification</div>
          <h1>IS THIS YOUR<br/>COMPANY?</h1>
          <p>
            Claim your company profile to review your information, update your project portfolio, and present your built work accurately.
            All profile claims are rigorously vetted by our editorial team before verification is granted.
          </p>
        </section>
        <section className="section" style={{ maxWidth: 720 }}>
          <ClaimForm companySlug={company.slug} companyName={company.name}/>
        </section>
      </main>
      <SiteFooter/>
    </>
  );
}
