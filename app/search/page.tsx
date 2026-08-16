import Link from 'next/link';
import {SiteHeader} from '@/components/SiteHeader';
import {SiteFooter} from '@/components/SiteFooter';
import {searchGlobal} from '@/lib/data';

export const metadata = {
  title: 'Search',
  description: 'Search published construction companies, projects, and industry insights in Romania.'
};

export default async function Search({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = '' } = await searchParams;
  const term = q.trim();
  const { matchingCompanies, matchingProjects, matchingArticles } = await searchGlobal(term);

  return (
    <>
      <SiteHeader />
      <main className="shell">
        <section className="page-hero">
          <div className="eyebrow">Global Search</div>
          <h1>SEARCH</h1>
          <form className="filterbar" action="/search">
            <input
              className="field"
              name="q"
              defaultValue={q}
              placeholder="Search company, project, location or industry..."
              autoFocus
            />
            <button className="btn" type="submit">
              Search
            </button>
          </form>
        </section>

        {!term ? (
          <section className="section">
            <p style={{ color: '#bdbbb4' }}>
              Search published companies, projects, locations and editorial content from one place.
            </p>
          </section>
        ) : (
          <section className="section">
            <div className="section-head">
              <div>
                <div className="eyebrow">Results for</div>
                <h2>{q}</h2>
              </div>
            </div>

            {/* Companies */}
            <h3 className="eyebrow" style={{ marginTop: 24 }}>Companies</h3>
            <div className="search-results">
              {matchingCompanies.length ? (
                matchingCompanies.map((c: any) => (
                  <Link className="company" href={`/companies/${c.slug}`} key={c.slug}>
                    <span className="company-num">{c.type}</span>
                    <h3>{c.name}</h3>
                    <p>{c.location}</p>
                  </Link>
                ))
              ) : (
                <div className="empty">No published company profiles found matching &quot;{term}&quot;.</div>
              )}
            </div>

            {/* Projects */}
            <h3 className="eyebrow" style={{ marginTop: 45 }}>Projects</h3>
            <div className="search-results">
              {matchingProjects.length ? (
                matchingProjects.map((p: any) => (
                  <Link className="company" href={`/projects/${p.slug}`} key={p.slug}>
                    <span className="company-num">{p.status}</span>
                    <h3>{p.name}</h3>
                    <p>{p.location}</p>
                  </Link>
                ))
              ) : (
                <div className="empty">No published project profiles found matching &quot;{term}&quot;.</div>
              )}
            </div>

            {/* Articles */}
            {matchingArticles.length > 0 && (
              <>
                <h3 className="eyebrow" style={{ marginTop: 45 }}>Editorial Stories</h3>
                <div className="search-results">
                  {matchingArticles.map((a: any) => (
                    <Link className="company" href={`/editorial/${a.slug}`} key={a.slug}>
                      <span className="company-num">{a.category}</span>
                      <h3>{a.title}</h3>
                      <p>{a.excerpt || 'View article'}</p>
                    </Link>
                  ))}
                </div>
              </>
            )}

            {!matchingCompanies.length && !matchingProjects.length && !matchingArticles.length && (
              <div className="actions" style={{ marginTop: 40 }}>
                <Link href="/promote" className="btn fill">
                  Can&apos;t find your company? Get featured
                </Link>
              </div>
            )}
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
