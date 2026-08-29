import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { realCompaniesDataset, realProjectsDataset } from '@/lib/real-romanian-data';
import { CompareWorkstation } from '@/components/CompareWorkstation';

export const metadata = {
  title: 'Side-by-Side Market Comparison · CONSTRUCTIONS by AiXLuxury',
  description: 'Compare financial turnover, net profit, employee headcounts, active construction sites, and delivered portfolios across top Romanian developers and general contractors.'
};

export default async function ComparePage({
  searchParams
}: {
  searchParams: Promise<{ c1?: string; c2?: string; c3?: string }>;
}) {
  const { c1 = 'one-united-properties', c2 = 'constructii-erbasu', c3 = 'akcent-development' } = await searchParams;

  const comp1 = realCompaniesDataset.find(c => c.slug === c1) || realCompaniesDataset[0];
  const comp2 = realCompaniesDataset.find(c => c.slug === c2) || realCompaniesDataset[1];
  const comp3 = realCompaniesDataset.find(c => c.slug === c3) || realCompaniesDataset[2];

  const selectedCompanies = [comp1, comp2, comp3];

  return (
    <>
      <main>
        <div className="hero" style={{ paddingBottom: 40 }}>
          <SiteHeader />
          <div className="shell hero-content">
            <div className="eyebrow" style={{ color: '#c7a675' }}>Comparative Intelligence Engine</div>
            <h1>SIDE-BY-SIDE MARKET COMPARISON</h1>
            <p>Compare reported financial performance, YoY revenue growth, employee productivity, active construction pipelines, and source-verified portfolios across Romanian market entities and developments.</p>
          </div>
        </div>

        <section className="section shell">
          <CompareWorkstation
            companies={realCompaniesDataset}
            projects={realProjectsDataset}
            initialCompanies={selectedCompanies}
          />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
