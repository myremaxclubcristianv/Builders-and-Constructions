import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { getIndustryHubData } from '@/lib/data';
import { SignalsFeed } from '@/components/SignalsFeed';

export const metadata = {
  title: 'Semnale de Piață & Șantiere Active · CONSTRUCTIONS by AiXLuxury',
  description: 'Cronologie documentată a etapelor de construcție, comunicatelor oficiale, gradului de preînchiriere și raportărilor din România.'
};

export default async function SignalsPage() {
  const hubData = await getIndustryHubData();
  const { marketActivity } = hubData;

  return (
    <div className="bg-white text-slate-900 min-h-screen">
      <SiteHeader />

      <main className="pt-20">
        <section className="py-10 md:py-16 border-b border-slate-200 bg-slate-50/70">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-[11px] font-mono tracking-widest text-[#b45309] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#b45309] animate-pulse" />
              Flux Documentar de Intelligence Imobiliar
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              SEMNALE DE PIAȚĂ VERIFICATE
            </h1>
            <p className="text-sm md:text-base text-slate-600 max-w-2xl leading-relaxed">
              Evoluții de șantier, autorizații, etape structurale și raportări oficiale de piață din România. Ultima actualizare verificată: 8 Noiembrie 2026.
            </p>
          </div>
        </section>

        <section className="py-10 md:py-16 bg-white">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8">
            <SignalsFeed signals={marketActivity} />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
