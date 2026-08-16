import Link from 'next/link';
import {SiteHeader} from '@/components/SiteHeader';
import {SiteFooter} from '@/components/SiteFooter';
import {getPublishedProjects} from '@/lib/data';

export const metadata = {
  title: 'Projects',
  description: 'Track completed projects, active construction and planned developments across Romania.'
};

const PROJECT_STATUSES = [
  { value: '', label: 'All Statuses' },
  { value: 'under_construction', label: 'Under Construction' },
  { value: 'completed', label: 'Completed' },
  { value: 'upcoming', label: 'Upcoming' }
];

const PROJECT_TYPES = [
  { value: '', label: 'All Project Types' },
  { value: 'residential', label: 'Residential' },
  { value: 'office', label: 'Office & Workspace' },
  { value: 'mixed_use', label: 'Mixed-Use' },
  { value: 'retail', label: 'Retail & Commercial' },
  { value: 'hospitality', label: 'Hospitality & Hotels' },
  { value: 'industrial', label: 'Industrial & Manufacturing' },
  { value: 'logistics', label: 'Logistics & Warehousing' },
  { value: 'infrastructure', label: 'Infrastructure & Civil' }
];

export default async function Projects({
  searchParams
}: {
  searchParams: Promise<{ status?: string; type?: string; q?: string }>;
}){
  const { status = '', type = '', q = '' } = await searchParams;
  const allProjects = await getPublishedProjects();

  const filtered = allProjects.filter(p => {
    if (status && !p.status.toLowerCase().replace(/[\s-]/g, '_').includes(status.toLowerCase())) return false;
    if (type && !p.type?.toLowerCase().replace(/[\s-]/g, '_').includes(type.toLowerCase())) return false;
    if (q && !`${p.name} ${p.type} ${p.location} ${p.developer} ${p.description}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <SiteHeader />
      <main className="shell">
        <section className="page-hero">
          <div className="eyebrow">Project Database & Construction Intelligence</div>
          <h1>PROJECTS</h1>
          <p>
            Track verified development milestones, active construction sites and planned masterplans across Romania.
            Access accurate consortium details, engineering specs, and timeline progress.
          </p>
        </section>

        <form className="filterbar" method="GET" action="/projects">
          <input
            name="q"
            defaultValue={q}
            className="field"
            placeholder="Search project name, location, developer..."
          />
          <select name="status" defaultValue={status} className="field">
            {PROJECT_STATUSES.map(st => (
              <option key={st.value} value={st.value}>
                {st.label}
              </option>
            ))}
          </select>
          <select name="type" defaultValue={type} className="field">
            {PROJECT_TYPES.map(pt => (
              <option key={pt.value} value={pt.value}>
                {pt.label}
              </option>
            ))}
          </select>
          <button type="submit" className="btn fill">
            Filter Projects
          </button>
          {(status || type || q) && (
            <Link href="/projects" className="btn" style={{ borderColor: '#555', color: '#aaa' }}>
              Clear
            </Link>
          )}
        </form>

        <div className="project-grid" style={{ marginBottom: 90 }}>
          {filtered.length > 0 ? (
            filtered.map(p => (
              <Link
                href={`/projects/${p.slug}`}
                className="project-card"
                key={p.slug}
                style={{ '--bg': `url('${p.image}')` } as React.CSSProperties}
              >
                <span className="tag">{p.status}</span>
                <h3>{p.name}</h3>
                <p>{p.location}</p>
                <div className="card-meta">
                  <span>{p.type}</span>
                  {p.completion && <span>{p.completion}</span>}
                </div>
              </Link>
            ))
          ) : (
            <div className="empty full" style={{ gridColumn: '1 / -1', padding: '40px 20px', textAlign: 'center' }}>
              <p style={{ color: '#e5e5e5', fontSize: 16, marginBottom: 12 }}>No published projects match your selected filters.</p>
              <Link href="/projects" className="btn">
                View All Projects
              </Link>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
