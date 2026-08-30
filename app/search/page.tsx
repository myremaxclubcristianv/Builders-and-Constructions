import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { searchIntelligenceGlobal } from '@/lib/data';
import { CompanyIntelligencePreview } from '@/components/CompanyIntelligencePreview';

export const metadata = {
  title: 'Intelligence Search — Romanian Construction Market',
  description: 'Search published construction companies, development projects, market signals, evidence and editorial analysis in Romania.'
};

export default async function Search({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = '' } = await searchParams;
  const term = q.trim();
  const { matchingCompanies, matchingProjects, matchingSignals, matchingArticles } = await searchIntelligenceGlobal(term);

  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <SiteHeader />

      <main className="pt-20">
        {/* Search Hero */}
        <section className="py-10 md:py-16 border-b border-[#1A1D1B] bg-[#0B0B0B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block">
              Global Intelligence Search
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              MARKET SEARCH TERMINAL
            </h1>
            <form action="/search" method="GET" className="flex items-center gap-2 max-w-2xl">
              <input
                className="flex-1 h-12 px-4 bg-[#111111] border border-[#1A1D1B] rounded-xl text-base text-white placeholder-[#666666] focus:outline-none focus:border-[#C9A227]/50"
                name="q"
                defaultValue={q}
                placeholder="Search company, CUI, project name, city, signal..."
                autoFocus
              />
              <button
                type="submit"
                className="h-12 px-6 bg-[#C9A227] text-[#050505] font-mono text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#E4C58F] active:scale-95 transition-all"
              >
                Search
              </button>
            </form>
          </div>
        </section>

        {!term ? (
          <section className="py-16 text-center">
            <div className="max-w-md mx-auto px-4 space-y-3">
              <p className="text-sm text-[#A0A0A0]">
                Search across 53 verified projects, 40 companies, 36 locations, contractors, architects, and market signals.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-mono text-[#888888]">
                <span>Popular:</span>
                <Link href="/search?q=One+United" className="text-[#C9A227] hover:underline">One United</Link>
                <span>·</span>
                <Link href="/search?q=Skanska" className="text-[#C9A227] hover:underline">Skanska</Link>
                <span>·</span>
                <Link href="/search?q=Bucharest" className="text-[#C9A227] hover:underline">Bucharest</Link>
                <span>·</span>
                <Link href="/search?q=Infrastructure" className="text-[#C9A227] hover:underline">Infrastructure</Link>
              </div>
            </div>
          </section>
        ) : (
          <section className="py-10 md:py-16">
            <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-12">
              <div className="border-b border-[#1A1D1B] pb-4">
                <span className="text-[10px] font-mono text-[#888888] uppercase">Results for</span>
                <h2 className="text-xl md:text-2xl font-bold text-white mt-1">&quot;{q}&quot;</h2>
              </div>

              {/* Companies Category */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono text-[#C9A227] uppercase tracking-widest flex items-center justify-between">
                  <span>COMPANIES ({matchingCompanies.length})</span>
                </h3>
                {matchingCompanies.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {matchingCompanies.map((c: any) => (
                      <div key={c.slug} className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl flex flex-col justify-between space-y-3">
                        <div>
                          <span className="text-[10px] font-mono text-[#888888]">{c.type}</span>
                          <h4 className="text-base font-bold text-white mt-1">
                            <CompanyIntelligencePreview company={{ name: c.name, slug: c.slug, type: c.type, location: c.location }}>
                              <Link href={`/companies/${c.slug}`} className="hover:text-[#C9A227] transition-colors">
                                {c.name}
                              </Link>
                            </CompanyIntelligencePreview>
                          </h4>
                          <p className="text-xs text-[#A0A0A0] line-clamp-2 mt-1">{c.description}</p>
                        </div>
                        <div className="pt-3 border-t border-[#1A1D1B] flex items-center justify-between text-xs font-mono">
                          <span className="text-[#888888]">{c.location}</span>
                          <Link href={`/companies/${c.slug}`} className="text-[#C9A227] font-semibold">
                            DOSSIER →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#666666] italic">No matching companies found.</p>
                )}
              </div>

              {/* Projects Category */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono text-[#C9A227] uppercase tracking-widest flex items-center justify-between">
                  <span>PROJECTS ({matchingProjects.length})</span>
                </h3>
                {matchingProjects.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {matchingProjects.map((p: any) => (
                      <div key={p.slug} className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl flex flex-col justify-between space-y-3">
                        <div>
                          <span className="text-[10px] font-mono text-[#888888]">{p.status}</span>
                          <h4 className="text-base font-bold text-white mt-1">
                            <Link href={`/projects/${p.slug}`} className="hover:text-[#C9A227] transition-colors">
                              {p.name}
                            </Link>
                          </h4>
                          <p className="text-xs text-[#A0A0A0] mt-1">{p.type} · {p.location}</p>
                        </div>
                        <div className="pt-3 border-t border-[#1A1D1B] flex items-center justify-between text-xs font-mono">
                          <span className="text-[#888888]">{p.location}</span>
                          <Link href={`/projects/${p.slug}`} className="text-[#C9A227] font-semibold">
                            PROJECT DOSSIER →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#666666] italic">No matching projects found.</p>
                )}
              </div>

              {/* Market Signals Category */}
              {matchingSignals.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-mono text-[#C9A227] uppercase tracking-widest">
                    MARKET SIGNALS & EVIDENCE ({matchingSignals.length})
                  </h3>
                  <div className="space-y-3">
                    {matchingSignals.map((s: any) => (
                      <div key={s.id} className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-mono text-[#38bdf8] uppercase">{s.signal_type.replaceAll('_', ' ')}</span>
                          <h4 className="text-sm font-semibold text-white mt-0.5">{s.title}</h4>
                          {s.summary && <p className="text-xs text-[#888888] mt-1">{s.summary}</p>}
                        </div>
                        {s.source_url && (
                          <a href={s.source_url} target="_blank" rel="noreferrer" className="text-xs font-mono text-[#C9A227] hover:underline shrink-0">
                            CITATION ↗
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
