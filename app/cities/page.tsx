import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { realLocationsDataset, realProjectsDataset, realCompaniesDataset } from '@/lib/real-romanian-data';

export const metadata = {
  title: 'Romanian Construction City Intelligence · CONSTRUCTIONS by AiXLuxury',
  description: 'Explore verified construction pipelines, active developers, projects under construction, and contractors across Romanian cities.'
};

export default function CitiesPage() {
  // Aggregate stats per county/city
  const citiesMap = new Map<string, { name: string; slug: string; county: string; projectsCount: number; companiesCount: number; activeProjects: number }>();

  realLocationsDataset.forEach(loc => {
    const cityName = loc.county === 'Bucharest' || loc.county === 'Ilfov' ? loc.name : loc.name;
    const key = loc.slug;
    
    const cityProjects = realProjectsDataset.filter(p => p.location_slug === loc.slug || p.county === loc.county);
    const cityDevs = new Set(cityProjects.map(p => p.developer_slug));

    citiesMap.set(key, {
      name: cityName,
      slug: loc.slug,
      county: loc.county,
      projectsCount: cityProjects.length,
      companiesCount: cityDevs.size,
      activeProjects: cityProjects.filter(p => p.status === 'under_construction').length
    });
  });

  const cityList = Array.from(citiesMap.values()).sort((a, b) => b.projectsCount - a.projectsCount);

  return (
    <>
      <main>
        <div className="hero" style={{ paddingBottom: 60 }}>
          <SiteHeader />
          <div className="shell hero-content">
            <div className="eyebrow" style={{ color: '#c7a675' }}>City & Regional Intelligence</div>
            <h1>ROMANIAN CONSTRUCTION BY CITY</h1>
            <p>Comprehensive market coverage of real estate development activity, construction sites, and active developers across Bucharest, Ilfov, Cluj-Napoca, Timișoara, Iași, Brașov, Constanța, Sibiu, Oradea, and major Romanian growth hubs.</p>
          </div>
        </div>

        <section className="section shell">
          <div className="section-head">
            <div>
              <div className="eyebrow" style={{ color: '#c7a675' }}>Coverage Map</div>
              <h2>PRIMARY DEVELOPMENT MARKETS</h2>
            </div>
            <span style={{ fontSize: 13, color: '#888' }}>{cityList.length} Verified Cities & Sub-markets</span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 20
            }}
          >
            {cityList.map(city => (
              <Link
                href={`/cities/${city.slug}`}
                key={city.slug}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: 24,
                  background: '#141715',
                  border: '1px solid #262927',
                  borderRadius: 6,
                  textDecoration: 'none',
                  color: '#fff',
                  transition: 'border-color 0.2s'
                }}
              >
                <div>
                  <div style={{ fontSize: 10, color: '#c7a675', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {city.county} COUNTY
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, margin: '6px 0 12px', color: '#fff' }}>{city.name}</h3>
                </div>

                <div style={{ borderTop: '1px solid #222523', paddingTop: 14, marginTop: 14, display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <div>
                    <span style={{ color: '#888' }}>Projects: </span>
                    <strong style={{ color: '#fff' }}>{city.projectsCount}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#888' }}>Active Sites: </span>
                    <strong style={{ color: '#c7a675' }}>{city.activeProjects}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#888' }}>Devs: </span>
                    <strong style={{ color: '#fff' }}>{city.companiesCount}</strong>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
