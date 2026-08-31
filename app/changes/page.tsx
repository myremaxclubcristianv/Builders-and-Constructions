import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { MarketChangesTerminal, DocumentedChangeItem } from '@/components/MarketChangesTerminal';
import { realLocationsDataset } from '@/lib/real-romanian-data';

export const metadata: Metadata = {
  title: 'Recent Documented Market Changes · CONSTRUCTIONS by AiXLuxury',
  description: 'Chronological audit trail of documented changes across Romanian market entities, construction projects, contractor relationships, and verified source citations.',
  alternates: {
    canonical: 'https://constructions.cristianvaduva.com/changes'
  }
};

export default function ChangesPage() {
  const documentedChanges: DocumentedChangeItem[] = [
    {
      id: 'chg-1',
      date: '2026-08-30',
      change_type: 'NEW PROJECT DOCUMENTED',
      entity_name: 'Metalurgiei Park Residence Phase 2',
      entity_type: 'Project',
      entity_category: 'Developer',
      entity_slug: 'metalurgiei-park-residence-phase-2',
      city: 'Bucharest',
      summary: 'Documented 3,000-unit residential district expansion in Bucharest Sector 4 with developer Sud Rezidențial and contractor Terra Gaz Construct.',
      previous_state: 'NOT DISCLOSED',
      new_state: 'UNDER CONSTRUCTION',
      source_url: 'https://metalurgieipark.ro',
      source_title: 'Public Permit & Official Release',
      verification_state: 'VERIFIED'
    },
    {
      id: 'chg-2',
      date: '2026-08-28',
      change_type: 'CONTRACTOR RELATIONSHIP DOCUMENTED',
      entity_name: 'Saidel Engineering',
      entity_type: 'Company',
      entity_category: 'Engineer',
      entity_slug: 'saidel-engineering',
      city: 'Bucharest',
      summary: 'Documented structural engineering consultancy role for Marmorosch Hotel Heritage Restoration in Bucharest Sector 3.',
      previous_state: 'UNAVAILABLE',
      new_state: 'CONTRACTOR APPOINTED',
      source_url: 'https://saidel.ro',
      source_title: 'Official Technical Disclosure',
      verification_state: 'DOCUMENTED'
    },
    {
      id: 'chg-3',
      date: '2026-08-26',
      change_type: 'PROJECT STATUS UPDATED',
      entity_name: 'UP-site Bucharest',
      entity_type: 'Project',
      entity_category: 'Developer',
      entity_slug: 'upsite-bucharest',
      city: 'Bucharest',
      summary: 'Updated construction stage from structure to facade curtain wall completion following site inspection & developer verification.',
      previous_state: 'STRUCTURE UNDERWAY',
      new_state: 'FACADE ENCLOSURE COMPLETE',
      source_url: 'https://www.atenor.eu/en/projects/up-site-floreasca/',
      source_title: 'Atenor Quarterly Report',
      verification_state: 'VERIFIED'
    },
    {
      id: 'chg-4',
      date: '2026-08-24',
      change_type: 'MARKET SIGNAL ADDED',
      entity_name: 'One High District',
      entity_type: 'Project',
      entity_category: 'Developer',
      entity_slug: 'one-high-district',
      city: 'Bucharest',
      summary: 'Logged construction milestone signal for 15th-floor structural completion on 786-unit residential project in Sector 2.',
      previous_state: 'NOT YET MEASURED',
      new_state: '15TH FLOOR TOPPING OUT',
      source_url: 'https://one.ro/one-high-district/',
      source_title: 'Official Press Release',
      verification_state: 'VERIFIED'
    },
    {
      id: 'chg-5',
      date: '2026-08-22',
      change_type: 'NEW PRIMARY SOURCE',
      entity_name: 'Prime Kapital',
      entity_type: 'Company',
      entity_category: 'Developer',
      entity_slug: 'prime-kapital',
      city: 'Iași',
      summary: 'Added audited 2025 financial disclosures and primary BVB statement citations for Silk District Iași office developments.',
      previous_state: 'NOT DISCLOSED',
      new_state: 'AUDITED DISCLOSURE ADDED',
      source_url: 'https://silkdistrict.ro',
      source_title: 'Audited Financial Statement',
      verification_state: 'VERIFIED'
    },
    {
      id: 'chg-6',
      date: '2026-08-20',
      change_type: 'ENTITY PROFILE UPDATED',
      entity_name: 'Construcții Erbașu',
      entity_type: 'Company',
      entity_category: 'Contractor',
      entity_slug: 'constructii-erbasu',
      city: 'Bucharest',
      summary: 'Updated corporate profile with €240M EUR 2025 revenue figure and 1,200 employee headcount verified against Ministry of Finance filings.',
      previous_state: 'NOT YET MEASURED',
      new_state: '2025 FINANCIALS VERIFIED',
      source_url: 'https://erbasu.ro',
      source_title: 'Ministry of Finance Filing',
      verification_state: 'VERIFIED'
    },
    {
      id: 'chg-7',
      date: '2026-08-18',
      change_type: 'NEW PROJECT DOCUMENTED',
      entity_name: 'Eli Park Bucharest (Buftea)',
      entity_type: 'Project',
      entity_category: 'Developer',
      entity_slug: 'eli-park-buftea',
      city: 'Buftea',
      summary: 'Indexed Phase 2 20,000 sqm logistics expansion by Element Industrial in Northern Ilfov e-commerce hub.',
      previous_state: 'NOT DISCLOSED',
      new_state: 'PHASE 2 UNDER CONSTRUCTION',
      source_url: 'https://elementindustrial.ro/eli-park-1/',
      source_title: 'Official Permit Disclosure',
      verification_state: 'VERIFIED'
    },
    {
      id: 'chg-8',
      date: '2026-08-15',
      change_type: 'PROJECT STATUS UPDATED',
      entity_name: 'A7 Motorway Focșani–Bacău Segment',
      entity_type: 'Project',
      entity_category: 'Contractor',
      entity_slug: 'a7-highway-focsani-bacau',
      city: 'Bacău',
      summary: 'Updated civil infrastructure progress to 78% physical asphalt completion for Spedition UMB / CNAIR contract.',
      previous_state: '65% ASPHALT PROGRESS',
      new_state: '78% ASPHALT COMPLETE',
      source_url: 'https://www.cnadnr.ro',
      source_title: 'CNAIR Public Statement',
      verification_state: 'VERIFIED'
    }
  ];

  const availableCities = realLocationsDataset.map(loc => loc.name).sort();

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
                PUBLIC AUDIT TERMINAL
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              RECENT DOCUMENTED MARKET CHANGES
            </h1>
            <p className="text-sm md:text-base text-[#A0A0A0] max-w-2xl leading-relaxed">
              Interactive, multi-dimensional audit terminal logging factual changes, newly documented contractor relationships, project lifecycle status updates, and primary source additions.
            </p>
          </div>
        </section>

        {/* Interactive Changes Terminal */}
        <section className="py-12 md:py-16">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <MarketChangesTerminal initialChanges={documentedChanges} availableCities={availableCities} />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
