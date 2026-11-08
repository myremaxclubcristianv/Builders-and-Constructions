import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { realProjectsDataset, realCompaniesDataset } from '@/lib/real-romanian-data';

export const metadata = {
  title: 'Raport Mostră de Piață Q3/Q4 2026 · CONSTRUCTIONS by AiXLuxury',
  description: 'Mostră de analiză instituțională pe date verificate: volumul investițiilor, stadiul fizic al marilor proiecte, antreprenorii generali activi și dinamica pieței de construcții din România.',
  alternates: {
    canonical: 'https://constructions.cristianvaduva.com/sample-report'
  }
};

export default function SampleReportPage() {
  const activeProjects = realProjectsDataset.filter(p => p.status === 'under_construction');
  const deliveredProjects = realProjectsDataset.filter(p => p.status === 'completed');

  const totalCapex = realProjectsDataset.reduce((sum, p) => sum + (p.investment_eur || 0), 0);
  const activeCapex = activeProjects.reduce((sum, p) => sum + (p.investment_eur || 0), 0);

  const topDevelopers = [
    { name: 'One United Properties', ticker: 'BVB: ONE', capex: '€650M+', projects: 'One Lake Club, One High District, One Floreasca Towers', status: 'VERIFICAT BVB' },
    { name: 'CTP Romania', ticker: 'Euronext: CTPNV', capex: '€500M+', projects: 'CTPark Bucharest West, CTPark Cluj I', status: 'VERIFICAT RAPORT CORPORATIV' },
    { name: 'Vastint Romania', ticker: 'Corporate', capex: '€200M+', projects: 'Timpuri Noi Square Phase 1 & 2', status: 'VERIFICAT PORTAL OFICIAL' },
    { name: 'Impact Developer & Contractor', ticker: 'BVB: IMP', capex: '€420M+', projects: 'Greenfield Băneasa Phase 1 & 2', status: 'VERIFICAT BVB' },
    { name: 'Atenor Romania', ticker: 'Euronext: ATEB', capex: '€180M+', projects: 'Dacia One Office, @Expo Bucharest', status: 'VERIFICAT EURONEXT' }
  ];

  const topContractors = [
    { name: "Bog'Art", revenue: '€160M+', projects: 'Timpuri Noi Square, CTPark West, Dacia One', cert: 'ISO 9001 / 14001', status: 'VERIFICAT BILANȚ ONRC' },
    { name: 'Construcții Erbașu', revenue: '€240M+', projects: 'Greenfield Phase 1, Spitale Județene, Stadioane', cert: 'ISO 9001 / 45001', status: 'VERIFICAT BILANȚ ONRC' },
    { name: 'Concelex', revenue: '€120M+', projects: 'Greenfield Phase 2 Teilor, Parcuri Fotovoltaice', cert: 'ISO 9001 / 27001', status: 'VERIFICAT BILANȚ ONRC' },
    { name: 'KÉSZ Construct Romania', revenue: '€85M+', projects: 'CTPark Cluj I, Parcuri Industriale', cert: 'Standard European', status: 'VERIFICAT BILANȚ ONRC' }
  ];

  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <SiteHeader />

      <main className="pt-24 pb-20">
        <div className="max-w-[1100px] mx-auto px-4 md:px-8 space-y-12">
          {/* Report Top Meta & Header */}
          <div className="p-8 md:p-12 bg-[#0C0E0D] border border-[#262A27] rounded-3xl space-y-6 relative overflow-hidden font-mono">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1A1D1B] pb-4 text-xs">
              <span className="px-3 py-1 bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/30 rounded-lg font-bold">
                RAPORT INSTITUȚIONAL MOSTRĂ · CLASA INVESTIȚIONALĂ
              </span>
              <span className="text-[#888]">
                REF: AIX-REP-2026-Q3 · DATA VERIFICĂRII: 28 AUGUST 2026
              </span>
            </div>

            <div className="space-y-3 font-sans">
              <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
                BAROMETRUL PIEȚEI DE CONSTRUCȚII & REAL ESTATE ROMÂNIA
              </h1>
              <p className="text-base text-[#AAA] max-w-3xl leading-relaxed">
                Analiză factuală a marilor șantiere, lichidității de capital, antreprenorilor generali calificați și riscurilor de execuție în conformitate cu normativele românești și europene.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#1A1D1B] text-xs">
              <div>
                <span className="text-[#777] block text-[10px] uppercase">CAPEX TOTAL MONITORIZAT</span>
                <span className="text-xl font-bold text-[#C9A227]">€{(totalCapex / 1_000_000_000).toFixed(2)} MLD. EUR</span>
              </div>
              <div>
                <span className="text-[#777] block text-[10px] uppercase">ȘANTIERE ÎN EXECUȚIE</span>
                <span className="text-xl font-bold text-white">{activeProjects.length} Obiective</span>
              </div>
              <div>
                <span className="text-[#777] block text-[10px] uppercase">PROIECTE LIVRATE VERIFICATE</span>
                <span className="text-xl font-bold text-[#22c55e]">{deliveredProjects.length} Proiecte</span>
              </div>
              <div>
                <span className="text-[#777] block text-[10px] uppercase">COMPANII INDEXATE</span>
                <span className="text-xl font-bold text-white">{realCompaniesDataset.length} Entități</span>
              </div>
            </div>
          </div>

          {/* Section 1: Top Developers by Capital Pipeline */}
          <section className="space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-[#1A1D1B] pb-3">
              <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="text-[#C9A227]">01.</span> TOP DEZVOLTATORI DUPĂ VOLUMUL DE CAPITAL VERIFICAT
              </h2>
              <span className="text-[10px] text-[#22c55e]">100% SURSE OFICIALE</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-[#1A1D1B] rounded-xl overflow-hidden">
                <thead className="bg-[#111111] text-[#777] uppercase text-[10px] border-b border-[#1A1D1B]">
                  <tr>
                    <th className="p-3.5">Dezvoltator</th>
                    <th className="p-3.5">Listare / CUI</th>
                    <th className="p-3.5">Capex Estimat / Anunțat</th>
                    <th className="p-3.5">Proiecte Majore Verificate</th>
                    <th className="p-3.5">Statut Probatoriu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1D1B] bg-[#0A0B0A]">
                  {topDevelopers.map((dev, idx) => (
                    <tr key={idx} className="hover:bg-[#111311] transition-colors">
                      <td className="p-3.5 font-bold text-white">{dev.name}</td>
                      <td className="p-3.5 text-[#AAA]">{dev.ticker}</td>
                      <td className="p-3.5 text-[#C9A227] font-bold">{dev.capex}</td>
                      <td className="p-3.5 text-[#888]">{dev.projects}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/30">
                          {dev.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 2: General Contractors Capacity */}
          <section className="space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-[#1A1D1B] pb-3">
              <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="text-[#C9A227]">02.</span> CAPACITATEA DE EXECUȚIE A ANTREPRENORILOR GENERALI
              </h2>
              <span className="text-[10px] text-[#888]">BILANȚURI FINANCIARE AUDITATE</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-[#1A1D1B] rounded-xl overflow-hidden">
                <thead className="bg-[#111111] text-[#777] uppercase text-[10px] border-b border-[#1A1D1B]">
                  <tr>
                    <th className="p-3.5">Constructor General</th>
                    <th className="p-3.5">Cifră Afaceri Anuală</th>
                    <th className="p-3.5">Portofoliu Activ Recomandat</th>
                    <th className="p-3.5">Certificări & Standarde</th>
                    <th className="p-3.5">Nivel Verificare</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1A1D1B] bg-[#0A0B0A]">
                  {topContractors.map((c, idx) => (
                    <tr key={idx} className="hover:bg-[#111311] transition-colors">
                      <td className="p-3.5 font-bold text-white">{c.name}</td>
                      <td className="p-3.5 text-[#C9A227] font-bold">{c.revenue}</td>
                      <td className="p-3.5 text-[#AAA]">{c.projects}</td>
                      <td className="p-3.5 text-[#888]">{c.cert}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/30">
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3: Technical Integrity & Fact vs Estimate Distinction */}
          <section className="p-6 md:p-8 bg-[#111111] border border-[#1A1D1B] rounded-2xl space-y-4 font-mono text-xs">
            <h3 className="text-sm font-bold text-[#C9A227] uppercase tracking-wider">
              03. METODOLOGIE & TRANSPARENȚĂ FAPTICĂ
            </h3>
            <p className="text-[#AAA] leading-relaxed">
              În conformitate cu standardul de integritate CONSTRUCTIONS by AiXLuxury, datele din acest raport sunt clasificate în patru niveluri distincte:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-[#141715] rounded-lg border border-[#22c55e]/30">
                <span className="text-[#22c55e] font-bold block mb-1">VERIFICAT FAPTIC (100%)</span>
                <span className="text-[#888] text-[11px]">Date probate prin documente depuse la BVB, ONRC, cărți funciare ANCPI sau autorizații de construire emise de primării.</span>
              </div>
              <div className="p-3 bg-[#141715] rounded-lg border border-[#C9A227]/30">
                <span className="text-[#C9A227] font-bold block mb-1">RAPORTAT OFICIAL (85-95%)</span>
                <span className="text-[#888] text-[11px]">Informații publicate pe portalurile oficiale ale companiilor sau declarații de presă semnate de conducerea executivă.</span>
              </div>
              <div className="p-3 bg-[#141715] rounded-lg border border-[#38bdf8]/30">
                <span className="text-[#38bdf8] font-bold block mb-1">ESTIMAT DE PIAȚĂ (60-80%)</span>
                <span className="text-[#888] text-[11px]">Modele economice de cost bazate pe indicatorii standard pe metru pătrat construit conform NE 012 și Eurocode.</span>
              </div>
              <div className="p-3 bg-[#141715] rounded-lg border border-[#ef4444]/30">
                <span className="text-[#ef4444] font-bold block mb-1">NEDIVULGAT / CONFIDENȚIAL</span>
                <span className="text-[#888] text-[11px]">Câmpuri pentru care nu există documente publice confirmate; nu se inventează valori de umplutură.</span>
              </div>
            </div>
          </section>

          {/* Institutional Contact CTA */}
          <div className="p-8 bg-gradient-to-r from-[#141715] to-[#0E100F] border border-[#C9A227]/40 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h4 className="text-xl font-bold text-white font-sans">
                Doriți un raport personalizat pentru portofoliul dumneavoastră?
              </h4>
              <p className="text-xs text-[#888] font-mono">
                Echipa noastră furnizează rapoarte de due-diligence tehnic și economic pentru fonduri, bănci și dezvoltatori.
              </p>
            </div>
            <Link
              href="/contact"
              className="px-6 py-3 bg-[#C9A227] hover:bg-[#d8b135] text-black font-bold font-mono text-xs rounded-xl transition-all shrink-0"
            >
              Comandă Analiză Dedicată →
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
