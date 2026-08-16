import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { getPublishedCompanies, getPublishedProjects } from '@/lib/data';

export default async function Home(){
  const [companyList, projectList] = await Promise.all([
    getPublishedCompanies(),
    getPublishedProjects()
  ]);

  const featuredProjects = projectList.slice(0, 3);
  const featuredCompanies = companyList.slice(0, 3);

  return (
    <>
      <main>
        <div className="hero">
          <SiteHeader />
          <div className="shell hero-content">
            <div className="eyebrow">AiXLuxury · Built environment intelligence</div>
            <h1>THE COMPANIES<br />BUILDING WHAT COMES NEXT.</h1>
            <p>Discover the developers, construction companies, engineers and architectural practices shaping the built environment. Built by the industry. Presented professionally.</p>
            <div className="actions">
              <Link className="btn fill" href="/companies">Explore Companies</Link>
              <Link className="btn" href="/projects">Explore Projects</Link>
              <Link className="btn" href="/promote-company">Promote Your Company</Link>
              <Link className="btn" href="/promote-project">Promote Your Project</Link>
            </div>
            <div className="ticker">
              <span>Independent industry platform</span>
              <span>Companies · Projects · Intelligence</span>
              <span>By AiXLuxury</span>
            </div>
          </div>
        </div>

        <section className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow">Project intelligence</div>
              <h2>WHAT&apos;S BEING BUILT</h2>
            </div>
            <Link className="link-arrow" href="/projects">View all projects →</Link>
          </div>
          <div className="project-grid">
            {featuredProjects.map(p => (
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
            ))}
          </div>
        </section>

        <section className="companies section">
          <div className="shell">
            <div className="section-head">
              <div>
                <div className="eyebrow">Selected profiles</div>
                <h2>COMPANIES TO KNOW</h2>
              </div>
              <Link className="link-arrow" href="/companies">Discover companies →</Link>
            </div>
            <div className="company-grid">
              {featuredCompanies.map((c, i) => (
                <Link href={`/companies/${c.slug}`} className="company" key={c.slug}>
                  <span className="company-num">0{i + 1} · {c.type}</span>
                  <div>
                    <h3>{c.name}</h3>
                    <p>{c.description}</p>
                  </div>
                  <footer>{c.location} · {c.specialism}</footer>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow">Reporting the built environment</div>
              <h2>DISCOVER THE INDUSTRY</h2>
            </div>
            <Link className="link-arrow" href="/industry">All industry stories →</Link>
          </div>
          <div className="editorial">
            {[
              'Development & investment',
              'Construction & infrastructure',
              'Engineering & technology',
              'Architecture & design'
            ].map((title, i) => (
              <article className="story" key={title}>
                <div className="eyebrow">0{i + 1} / Intelligence</div>
                <h3>{title}</h3>
                <p>Clear, useful context on the forces shaping Romania&apos;s next built environment.</p>
              </article>
            ))}
          </div>
        </section>

        <section className="conversion">
          <div className="shell">
            <div className="eyebrow" style={{ color: '#25221b' }}>For companies shaping the future</div>
            <h2>YOUR WORK DESERVES<br />TO BE SEEN.</h2>
            <p>We help construction companies, developers and engineering firms turn their projects and experience into powerful digital brands.</p>
            <div className="actions" style={{ marginTop: 24 }}>
              <Link className="btn" href="/promote-company" style={{ borderColor: '#191914' }}>
                Promote My Company
              </Link>
              <Link className="btn" href="/promote-project" style={{ borderColor: '#191914', background: 'transparent' }}>
                Promote A Project
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
