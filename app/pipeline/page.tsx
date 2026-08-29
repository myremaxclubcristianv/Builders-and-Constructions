import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { realProjectsDataset } from '@/lib/real-romanian-data';
import { PipelineWorkstation } from '@/components/PipelineWorkstation';

export const metadata = {
  title: 'What Is Being Built Right Now in Romania · CONSTRUCTIONS by AiXLuxury',
  description: 'Live construction pipeline database in Romania. Filter active construction sites by city, developer, project type, and expected delivery date.'
};

export default async function PipelinePage() {
  return (
    <>
      <main>
        <div className="hero" style={{ paddingBottom: 40 }}>
          <SiteHeader />
          <div className="shell hero-content">
            <div className="eyebrow" style={{ color: '#c7a675' }}>Live Construction Pipeline</div>
            <h1>WHAT IS BEING BUILT RIGHT NOW?</h1>
            <p>Real-time tracking of active construction sites, structural stage progress, expected delivery dates, and project teams across Romania.</p>
          </div>
        </div>

        <section className="section shell">
          <PipelineWorkstation initialProjects={realProjectsDataset} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
