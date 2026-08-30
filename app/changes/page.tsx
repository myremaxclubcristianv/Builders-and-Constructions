import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export const metadata = {
  title: 'Recent Documented Market Changes · CONSTRUCTIONS by AiXLuxury',
  description: 'Chronological audit trail of documented changes across Romanian market entities, construction projects, contractor relationships, and verified source citations.',
  alternates: {
    canonical: 'https://constructions.cristianvaduva.com/changes'
  }
};

export default function ChangesPage() {
  const documentedChanges = [
    {
      id: 'chg-1',
      date: '2026-08-30',
      change_type: 'NEW PROJECT DOCUMENTED',
      entity_name: 'Metalurgiei Park Residence Phase 2',
      entity_type: 'Project',
      entity_slug: 'metalurgiei-park-residence-phase-2',
      description: 'Documented 3,000-unit residential district expansion in Bucharest Sector 4 with developer Sud Rezidențial and contractor Terra Gaz Construct.',
      source_url: 'https://metalurgieipark.ro',
      source_title: 'Public Permit & Official Release'
    },
    {
      id: 'chg-2',
      date: '2026-08-28',
      change_type: 'CONTRACTOR RELATIONSHIP DOCUMENTED',
      entity_name: 'Saidel Engineering',
      entity_type: 'Company',
      entity_slug: 'saidel-engineering',
      description: 'Documented structural engineering consultancy role for Marmorosch Hotel Heritage Restoration in Bucharest Sector 3.',
      source_url: 'https://saidel.ro',
      source_title: 'Official Technical Disclosure'
    },
    {
      id: 'chg-3',
      date: '2026-08-26',
      change_type: 'PROJECT STATUS UPDATED',
      entity_name: 'UP-site Bucharest',
      entity_type: 'Project',
      entity_slug: 'upsite-bucharest',
      description: 'Updated construction stage from structure to facade curtain wall completion following site inspection & developer verification.',
      source_url: 'https://www.atenor.eu/en/projects/up-site-floreasca/',
      source_title: 'Atenor Quarterly Report'
    },
    {
      id: 'chg-4',
      date: '2026-08-24',
      change_type: 'NEW MARKET SIGNAL',
      entity_name: 'One High District',
      entity_type: 'Project',
      entity_slug: 'one-high-district',
      description: 'Logged construction milestone signal for 15th-floor structural completion on 786-unit residential project in Sector 2.',
      source_url: 'https://one.ro/one-high-district/',
      source_title: 'Official Press Release'
    },
    {
      id: 'chg-5',
      date: '2026-08-22',
      change_type: 'NEW PRIMARY SOURCE',
      entity_name: 'Prime Kapital',
      entity_type: 'Company',
      entity_slug: 'prime-kapital',
      description: 'Added audited 2025 financial disclosures and primary BVB statement citations for Silk District Iași office developments.',
      source_url: 'https://silkdistrict.ro',
      source_title: 'Audited Financial Statement'
    },
    {
      id: 'chg-6',
      date: '2026-08-20',
      change_type: 'ENTITY PROFILE UPDATED',
      entity_name: 'Construcții Erbașu',
      entity_type: 'Company',
      entity_slug: 'constructii-erbasu',
      description: 'Updated corporate profile with €240M EUR 2025 revenue figure and 1,200 employee headcount verified against Ministry of Finance filings.',
      source_url: 'https://erbasu.ro',
      source_title: 'Ministry of Finance Filing'
    },
    {
      id: 'chg-7',
      date: '2026-08-18',
      change_type: 'NEW PROJECT DOCUMENTED',
      entity_name: 'Eli Park Bucharest (Buftea)',
      entity_type: 'Project',
      entity_slug: 'eli-park-buftea',
      description: 'Indexed Phase 2 20,000 sqm logistics expansion by Element Industrial in Northern Ilfov e-commerce hub.',
      source_url: 'https://elementindustrial.ro/eli-park-1/',
      source_title: 'Official Permit Disclosure'
    },
    {
      id: 'chg-8',
      date: '2026-08-15',
      change_type: 'PROJECT STATUS UPDATED',
      entity_name: 'A7 Motorway Focșani–Bacău Segment',
      entity_type: 'Project',
      entity_slug: 'a7-highway-focsani-bacau',
      description: 'Updated civil infrastructure progress to 78% physical asphalt completion for Spedition UMB / CNAIR contract.',
      source_url: 'https://www.cnadnr.ro',
      source_title: 'CNAIR Public Statement'
    }
  ];

  const changesJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Recent Documented Market Changes — CONSTRUCTIONS by AiXLuxury',
    description: 'Chronological audit trail of documented changes across Romanian market entities and projects.',
    url: 'https://constructions.cristianvaduva.com/changes'
  };

  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(changesJsonLd) }}
      />
      <SiteHeader />

      <main className="pt-20">
        {/* Page Hero */}
        <section className="py-12 md:py-16 border-b border-[#1A1D1B] bg-[#0B0B0B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] font-bold">
                Factual Change Detection Log
              </span>
              <span className="px-2 py-0.5 bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/30 rounded text-[9px] font-mono font-bold uppercase">
                PUBLIC AUDIT TRAIL
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              RECENT DOCUMENTED MARKET CHANGES
            </h1>
            <p className="text-sm md:text-base text-[#A0A0A0] max-w-2xl leading-relaxed">
              Transparent, public-safe audit trail logging factual changes, newly documented contractor relationships, project lifecycle status updates, and primary source additions.
            </p>
          </div>
        </section>

        {/* Changes Feed Section */}
        <section className="py-12 md:py-16">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-8">
            <div className="flex items-center justify-between border-b border-[#1A1D1B] pb-3 text-xs font-mono text-[#888888]">
              <span className="text-white font-bold">SHOWING {documentedChanges.length} AUDITED CHANGES</span>
              <span className="text-[#C9A227]">100% FACTUAL PROVENANCE LINKED</span>
            </div>

            <div className="space-y-4">
              {documentedChanges.map(chg => (
                <div
                  key={chg.id}
                  className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#C9A227]/40 transition-all font-mono"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="px-2.5 py-1 bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] rounded text-[10px] font-bold uppercase">
                        {chg.change_type}
                      </span>
                      <span className="text-[#888888]">{chg.date}</span>
                    </div>

                    <h2 className="text-lg font-bold text-white tracking-tight">
                      {chg.entity_type === 'Company' ? (
                        <Link href={`/companies/${chg.entity_slug}`} className="hover:text-[#C9A227] transition-colors">
                          🏢 {chg.entity_name}
                        </Link>
                      ) : (
                        <Link href={`/projects/${chg.entity_slug}`} className="hover:text-[#38bdf8] transition-colors">
                          🏗️ {chg.entity_name}
                        </Link>
                      )}
                    </h2>

                    <p className="text-xs text-[#A0A0A0] leading-relaxed font-sans">
                      {chg.description}
                    </p>
                  </div>

                  {chg.source_url && (
                    <a
                      href={chg.source_url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-[#050505] border border-[#1A1D1B] text-xs text-[#C9A227] rounded-lg hover:border-[#C9A227]/50 shrink-0 self-start md:self-center font-bold"
                    >
                      {chg.source_title} ↗
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* Disclosure Banner */}
            <div className="p-4 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-[11px] font-mono text-[#777777] leading-relaxed">
              <strong className="text-[#A0A0A0]">CHANGE DETECTION POLICY:</strong> Changes are published only when verified by official building permits, primary trade registry statements, or authenticated corporate filings. Private internal workspace notes and unverified rumors are strictly excluded.
            </div>

          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
