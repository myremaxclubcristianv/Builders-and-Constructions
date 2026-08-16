import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { getPublishedCompanies } from '@/lib/data';

export const metadata = {
  title: 'Companies',
  description: 'Discover construction companies, developers, engineers and architects shaping the built environment in Romania.'
};

const COMPANY_TYPES = [
  { value: '', label: 'All Company Types' },
  { value: 'developer', label: 'Developer' },
  { value: 'construction_company', label: 'Construction Company' },
  { value: 'general_contractor', label: 'General Contractor' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'architecture', label: 'Architecture' },
  { value: 'project_management', label: 'Project Management' },
  { value: 'specialized_contractor', label: 'Specialist Contractor' },
  { value: 'infrastructure', label: 'Infrastructure' }
];

const LOCATIONS = [
  { value: '', label: 'All Locations' },
  { value: 'Bucharest', label: 'Bucharest' },
  { value: 'Cluj-Napoca', label: 'Cluj-Napoca' },
  { value: 'Timișoara', label: 'Timișoara' },
  { value: 'Iași', label: 'Iași' },
  { value: 'Brașov', label: 'Brașov' },
  { value: 'Constanța', label: 'Constanța' },
  { value: 'Ilfov', label: 'Ilfov' }
];

export default async function Companies({
  searchParams
}: {
  searchParams: Promise<{ type?: string; location?: string; q?: string }>;
}) {
  const { type = '', location = '', q = '' } = await searchParams;
  const allCompanies = await getPublishedCompanies();

  const filtered = allCompanies.filter(c => {
    if (type && !c.type.toLowerCase().includes(type.toLowerCase().replace('_', ' '))) return false;
    if (location && !c.location?.toLowerCase().includes(location.toLowerCase())) return false;
    if (q && !`${c.name} ${c.type} ${c.location} ${c.specialism} ${c.description}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <SiteHeader />
      <main className="shell">
        <section className="page-hero">
          <div className="eyebrow">Industry Directory & Commercial Intelligence</div>
          <h1>COMPANIES</h1>
          <p>
            Discover the developers, general contractors, engineers and architecture practices moving Romania forward.
            Explore verified portfolios, completed projects, and active construction sites.
          </p>
        </section>

        <form className="filterbar" method="GET" action="/companies">
          <input
            name="q"
            defaultValue={q}
            className="field"
            placeholder="Search company name, expertise or keywords..."
          />
          <select name="type" defaultValue={type} className="field">
            {COMPANY_TYPES.map(t => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <select name="location" defaultValue={location} className="field">
            {LOCATIONS.map(l => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
          <button type="submit" className="btn fill">
            Filter Results
          </button>
          {(type || location || q) && (
            <Link href="/companies" className="btn" style={{ borderColor: '#555', color: '#aaa' }}>
              Clear
            </Link>
          )}
        </form>

        <div className="company-grid" style={{ marginBottom: 90 }}>
          {filtered.length > 0 ? (
            filtered.map((c, i) => (
              <Link href={`/companies/${c.slug}`} className="company" key={c.slug}>
                <span className="company-num">
                  {String(i + 1).padStart(2, '0')} · {c.type}
                </span>
                <div>
                  <h3>{c.name}</h3>
                  <p>{c.description}</p>
                </div>
                <footer>
                  {c.location} · {c.specialism}
                </footer>
              </Link>
            ))
          ) : (
            <div className="empty full" style={{ gridColumn: '1 / -1', padding: '40px 20px', textAlign: 'center' }}>
              <p style={{ color: '#e5e5e5', fontSize: 16, marginBottom: 12 }}>No published companies match your selected filters.</p>
              <Link href="/companies" className="btn">
                View All Companies
              </Link>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
