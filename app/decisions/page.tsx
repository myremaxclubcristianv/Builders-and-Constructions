import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { realCompaniesDataset, realProjectsDataset } from '@/lib/real-romanian-data';

export const metadata = {
  title: 'Institutional Decision Engine · CONSTRUCTIONS by AiXLuxury',
  description: 'Deterministic decision-support system evaluating developer activity, active construction site pipelines, surface area scale, and regional footprint across Romania.'
};

export default function DecisionsPage() {
  // Compute deterministic Decision Relevance Score (0-100)
  const decisionEntities = realCompaniesDataset.map(company => {
    const devProjects = realProjectsDataset.filter(p => p.developer_slug === company.slug || p.contractor_slug === company.slug);
    const activeSites = devProjects.filter(p => p.status === 'under_construction').length;
    const totalArea = devProjects.reduce((acc, p) => acc + (p.built_area_sqm || 0), 0);
    const uniqueCities = new Set(devProjects.map(p => p.location)).size;

    // Component weights
    const activityScore = Math.min(activeSites * 12.5, 25);
    const pipelineScore = Math.min(devProjects.length * 5, 20);
    const scaleScore = Math.min(Math.floor(totalArea / 10000) * 3, 15);
    const signalScore = activeSites > 0 ? 15 : 5;
    const geoScore = Math.min(uniqueCities * 5, 10);
    const networkScore = company.type === 'general_contractor' ? 10 : 8;
    const freshnessScore = 5;

    const totalScore = Math.round(activityScore + pipelineScore + scaleScore + signalScore + geoScore + networkScore + freshnessScore);

    let classification: 'ACT NOW' | 'INVESTIGATE' | 'MONITOR' | 'NO ACTION' = 'NO ACTION';
    if (totalScore >= 75) classification = 'ACT NOW';
    else if (totalScore >= 50) classification = 'INVESTIGATE';
    else if (totalScore >= 25) classification = 'MONITOR';

    return {
      ...company,
      activeSites,
      totalProjects: devProjects.length,
      totalArea,
      uniqueCities,
      totalScore,
      classification,
      scoreComponents: {
        activityScore,
        pipelineScore,
        scaleScore,
        signalScore,
        geoScore,
        networkScore,
        freshnessScore
      },
      connectedProjects: devProjects.slice(0, 3)
    };
  }).sort((a, b) => b.totalScore - a.totalScore);

  const actNowList = decisionEntities.filter(e => e.classification === 'ACT NOW');
  const investigateList = decisionEntities.filter(e => e.classification === 'INVESTIGATE');
  const monitorList = decisionEntities.filter(e => e.classification === 'MONITOR');

  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <SiteHeader />

      <main className="pt-20">
        <section className="py-10 md:py-16 border-b border-[#1A1D1B] bg-[#0B0B0B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block">
              Institutional Decision Support Engine
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              INSTITUTIONAL DECISIONS
            </h1>
            <p className="text-sm md:text-base text-[#A0A0A0] max-w-2xl leading-relaxed">
              Deterministic, evidence-backed decision classifications (ACT NOW, INVESTIGATE, MONITOR) evaluating developer pipeline activity, surface area scale, and regional footprint.
            </p>
          </div>
        </section>

        <section className="py-10 md:py-16">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-12">
            {/* Methodology Note */}
            <div className="p-4 bg-[#111111] border border-[#C9A227]/40 rounded-xl space-y-2 text-xs">
              <span className="font-mono text-[#C9A227] uppercase tracking-widest font-bold block">
                DECISION ENGINE SCORING METHODOLOGY (TRANSPARENT & EXPLAINABLE)
              </span>
              <p className="text-[#A0A0A0] leading-relaxed">
                Decision relevance scores are computed deterministically: <strong className="text-white">Verified Activity (25%)</strong>, <strong className="text-white">Active Pipeline (20%)</strong>, <strong className="text-white">Documented Scale (15%)</strong>, <strong className="text-white">Recent Signals (15%)</strong>, <strong className="text-white">Geographic Footprint (10%)</strong>, <strong className="text-white">Network Depth (10%)</strong>, and <strong className="text-white">Data Freshness (5%)</strong>. Zero opaque AI predictions or sponsored bias.
              </p>
            </div>

            {/* Category: ACT NOW */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#1A1D1B] pb-3">
                <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest font-bold">
                  HIGH RELEVANCE — ACT NOW ({actNowList.length})
                </span>
                <span className="text-[10px] font-mono text-[#888888]">SCORE &gt;= 75 / 100</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {actNowList.map(item => (
                  <div key={item.slug} className="p-5 bg-[#111111] border border-[#C9A227]/50 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 bg-[#C9A227] text-[#050505] font-mono font-bold text-[10px] rounded uppercase">
                        {item.classification}
                      </span>
                      <span className="text-xs font-mono text-[#C9A227] font-bold">
                        SCORE: {item.totalScore} / 100
                      </span>
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-white">
                        <Link href={`/companies/${item.slug}`} className="hover:text-[#C9A227] transition-colors">
                          {item.name}
                        </Link>
                      </h2>
                      <p className="text-xs text-[#888888] font-mono">
                        HQ: {item.location} · Type: {item.type.toUpperCase()}
                      </p>
                    </div>

                    <div className="p-3 bg-[#050505] border border-[#1A1D1B] rounded space-y-1 text-xs font-mono">
                      <span className="text-[#888888] text-[10px] uppercase font-bold block">SUPPORTING EVIDENCE:</span>
                      <span className="text-white block">• {item.activeSites} Active Construction Sites</span>
                      <span className="text-white block">• {item.totalProjects} Portfolio Projects Indexed</span>
                      <span className="text-white block">• {item.totalArea > 0 ? `${item.totalArea.toLocaleString()} m² Documented Surface` : 'NOT DISCLOSED'}</span>
                      <span className="text-white block">• {item.uniqueCities} Regional Cities ({item.location})</span>
                    </div>

                    <div className="pt-2 border-t border-[#1A1D1B] flex items-center justify-between text-xs font-mono">
                      <Link href={`/actions`} className="text-[#C9A227] font-bold hover:underline">
                        + CONVERT TO ACTION →
                      </Link>
                      <Link href={`/companies/${item.slug}`} className="text-[#888888] hover:text-white">
                        DOSSIER →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category: INVESTIGATE */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#1A1D1B] pb-3">
                <span className="text-xs font-mono text-[#38bdf8] uppercase tracking-widest font-bold">
                  MEDIUM RELEVANCE — INVESTIGATE ({investigateList.length})
                </span>
                <span className="text-[10px] font-mono text-[#888888]">SCORE 50 - 74 / 100</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {investigateList.map(item => (
                  <div key={item.slug} className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#38bdf8] font-bold">{item.classification}</span>
                      <span className="text-[10px] font-mono text-[#888888]">{item.totalScore}/100</span>
                    </div>

                    <h3 className="font-bold text-white">
                      <Link href={`/companies/${item.slug}`} className="hover:text-[#C9A227]">
                        {item.name}
                      </Link>
                    </h3>

                    <p className="text-[#888888] font-mono text-[10px]">
                      {item.totalProjects} Projects · {item.uniqueCities} Cities
                    </p>

                    <div className="pt-2 border-t border-[#1A1D1B] flex justify-end">
                      <Link href={`/companies/${item.slug}`} className="text-[#38bdf8] font-mono text-[10px] hover:underline">
                        DOSSIER →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category: MONITOR */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#1A1D1B] pb-3">
                <span className="text-xs font-mono text-[#888888] uppercase tracking-widest font-bold">
                  MONITOR ({monitorList.length})
                </span>
                <span className="text-[10px] font-mono text-[#888888]">SCORE 25 - 49 / 100</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {monitorList.slice(0, 8).map(item => (
                  <div key={item.slug} className="p-3 bg-[#111111] border border-[#1A1D1B] rounded-lg space-y-1 text-xs">
                    <span className="text-[10px] font-mono text-[#888888]">MONITOR ({item.totalScore}/100)</span>
                    <h4 className="font-bold text-white truncate">
                      <Link href={`/companies/${item.slug}`} className="hover:text-[#C9A227]">
                        {item.name}
                      </Link>
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
