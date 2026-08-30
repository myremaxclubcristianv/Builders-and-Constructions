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
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <SiteHeader />

      <main className="pt-20">
        <section className="py-10 md:py-16 border-b border-[#1A1D1B] bg-[#0B0B0B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block">
              Comparative Intelligence Engine
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              SIDE-BY-SIDE MARKET COMPARISON
            </h1>
            <p className="text-sm md:text-base text-[#A0A0A0] max-w-2xl leading-relaxed">
              Compare reported financial performance, YoY revenue growth, employee productivity, active construction pipelines, and source-verified portfolios across Romanian market entities and developments.
            </p>
          </div>
        </section>

        <section className="py-10 md:py-16">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <CompareWorkstation
              companies={realCompaniesDataset}
              projects={realProjectsDataset}
              initialCompanies={selectedCompanies}
            />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
