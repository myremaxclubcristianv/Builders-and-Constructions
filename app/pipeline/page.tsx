import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { realProjectsDataset } from '@/lib/real-romanian-data';
import { PipelineWorkstation } from '@/components/PipelineWorkstation';

export const metadata = {
  title: 'Ce Se Construiește Acum în România · Pipeline Șantiere · CONSTRUCTIONS by AiXLuxury',
  description: 'Bază de date în timp real cu șantierele active din România. Filtrează proiectele în execuție după oraș, dezvoltator, tipologie și termen de livrare estimat.'
};

export default async function PipelinePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative border-b border-slate-200 bg-linear-to-b from-slate-50 to-white py-12 md:py-16">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200/80 rounded-full text-xs font-mono font-semibold text-amber-800 uppercase tracking-widest mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
              Pipeline Șantiere în Execuție
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-950 uppercase mb-4">
              CE SE CONSTRUIEȘTE ACUM ÎN ROMÂNIA?
            </h1>
            <p className="max-w-3xl text-slate-600 text-base md:text-lg leading-relaxed">
              Monitorizare în timp real a șantierelor active, a stadiului fizic structural, a termenelor de finalizare și a echipelor de proiectare și execuție din întreaga țară.
            </p>
          </div>
        </div>

        {/* Workstation Section */}
        <section className="py-8 md:py-12 bg-white">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <PipelineWorkstation initialProjects={realProjectsDataset} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

