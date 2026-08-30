import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { realCompaniesDataset, realProjectsDataset } from '@/lib/real-romanian-data';

export const metadata = {
  title: 'Commercial Priority Command Center · CONSTRUCTIONS by AiXLuxury',
  description: 'Evidence-backed priority scoring evaluating corporate entities and development pipelines across Romania based strictly on documented site counts and verified scale.'
};

export default function PrioritiesPage() {
  // Compute transparent evidence score for developers
  const scoredCompanies = realCompaniesDataset
    .filter(c => c.type === 'developer')
    .map(c => {
      const devProjects = realProjectsDataset.filter(p => p.developer_slug === c.slug);
      const activeSites = devProjects.filter(p => p.status === 'under_construction').length;
      const totalArea = devProjects.reduce((acc, p) => acc + (p.built_area_sqm || 0), 0);
      const uniqueCities = new Set(devProjects.map(p => p.location)).size;

      // Transparent Score Calculation Breakdown
      const siteScore = Math.min(activeSites * 20, 40);
      const areaScore = Math.min(Math.floor(totalArea / 10000) * 5, 30);
      const geoScore = Math.min(uniqueCities * 10, 20);
      const portfolioScore = Math.min(devProjects.length * 5, 10);

      const totalScore = siteScore + areaScore + geoScore + portfolioScore;

      return {
        ...c,
        activeSites,
        totalProjects: devProjects.length,
        totalArea,
        uniqueCities,
        totalScore,
        scoreBreakdown: { siteScore, areaScore, geoScore, portfolioScore }
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore);

  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <SiteHeader />

      <main className="pt-20">
        <section className="py-10 md:py-16 border-b border-[#1A1D1B] bg-[#0B0B0B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block">
              Commercial Priority Command Center
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              COMMERCIAL PRIORITIES
            </h1>
            <p className="text-sm md:text-base text-[#A0A0A0] max-w-2xl leading-relaxed">
              Transparent, evidence-based prioritization scoring evaluating developer activity, active construction site counts, surface area scale, and regional footprint.
            </p>
          </div>
        </section>

        <section className="py-10 md:py-16">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-8">
            <div className="p-4 bg-[#111111] border border-[#C9A227]/40 rounded-xl space-y-2">
              <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest font-bold">
                SCORING METHODOLOGY TRANSPARENCY DISCLOSURE
              </span>
              <p className="text-xs text-[#A0A0A0] leading-relaxed">
                Priority scores are computed directly from documented data points: <strong className="text-white">Active Construction Sites (40%)</strong>, <strong className="text-white">Documented Built Area (30%)</strong>, <strong className="text-white">Geographic Footprint (20%)</strong>, and <strong className="text-white">Indexed Portfolio Size (10%)</strong>. No black-box algorithms or pay-to-play manipulation.
              </p>
            </div>

            <div className="space-y-4">
              {scoredCompanies.map((c, idx) => (
                <div
                  key={c.slug}
                  className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#C9A227]/40 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-2xl font-mono font-extrabold text-[#C9A227] w-8">
                      {String(idx + 1).padStart(2, '0')}
                    </span>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-bold text-white">
                          <Link href={`/companies/${c.slug}`} className="hover:text-[#C9A227] transition-colors">
                            {c.name}
                          </Link>
                        </h2>
                        <span className="px-2 py-0.5 bg-[#C9A227]/10 text-[#C9A227] rounded text-[10px] font-mono font-bold">
                          SCORE: {c.totalScore} / 100
                        </span>
                      </div>

                      <p className="text-xs text-[#888888] font-mono">
                        HQ: {c.location} · {c.activeSites} Active Sites · {c.totalProjects} Portfolio Projects · {c.uniqueCities} Regional Cities
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs font-mono border-t md:border-t-0 border-[#1A1D1B] pt-3 md:pt-0">
                    <div className="p-2.5 bg-[#050505] border border-[#1A1D1B] rounded space-y-0.5 text-[10px]">
                      <span className="text-[#666666] block font-bold">SCORE BREAKDOWN:</span>
                      <span className="text-white block">Sites: +{c.scoreBreakdown.siteScore} | Area: +{c.scoreBreakdown.areaScore}</span>
                      <span className="text-white block">Geo: +{c.scoreBreakdown.geoScore} | Scale: +{c.scoreBreakdown.portfolioScore}</span>
                    </div>

                    <Link
                      href={`/companies/${c.slug}`}
                      className="px-4 py-2 bg-[#050505] border border-[#1A1D1B] text-[#C9A227] rounded-lg hover:border-[#C9A227]/50 text-xs shrink-0"
                    >
                      DOSSIER →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
