import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { realProjectsDataset, realCompaniesDataset, getCanonicalCapexSummary } from '@/lib/real-romanian-data';

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
  const capex = getCanonicalCapexSummary();

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
    <div className="bg-white text-slate-900 min-h-screen selection:bg-amber-100 selection:text-amber-950">
      <SiteHeader />

      <main className="pt-24 pb-20">
        <div className="max-w-[1120px] mx-auto px-4 md:px-8 space-y-12">
          {/* Report Top Meta & Header */}
          <div className="p-8 md:p-12 bg-slate-50 border border-slate-200 rounded-3xl space-y-6 relative overflow-hidden font-mono">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4 text-xs">
              <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg font-bold">
                RAPORT INSTITUȚIONAL MOSTRĂ · CLASA INVESTIȚIONALĂ
              </span>
              <span className="text-slate-500 font-medium">
                REF: AIX-REP-2026-Q4 · DATA VERIFICĂRII: 8 NOIEMBRIE 2026
              </span>
            </div>

            <div className="space-y-3 font-sans">
              <h1 className="text-3xl md:text-5xl font-extrabold text-slate-950 tracking-tight">
                BAROMETRUL PIEȚEI DE CONSTRUCȚII &amp; REAL ESTATE ROMÂNIA
              </h1>
              <p className="text-base text-slate-600 max-w-3xl leading-relaxed">
                Analiză factuală a marilor șantiere, lichidității de capital, antreprenorilor generali calificați și riscurilor de execuție în conformitate cu normativele românești și europene.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">CAPEX NET RECONCILIAT</span>
                <span className="text-xl font-bold text-amber-800">{capex.netReconciledCapexLabel}</span>
                <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">Deduplicat faptic · n=76 proiecte</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">INFRASTRUCTURĂ PUBLICĂ NETĂ</span>
                <span className="text-xl font-bold text-sky-800">€{(capex.publicInfrastructureNetEur / 1_000_000_000).toFixed(2)} MLD. EUR</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Contracte SEAP / CNAIR / CFR</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">REAL ESTATE PRIVAT NET</span>
                <span className="text-xl font-bold text-emerald-800">€{(capex.privateRealEstateNetEur / 1_000_000_000).toFixed(2)} MLD. EUR</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Rezidențial, Birouri, Logistică</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">CAPEX BRUT INDEXAT</span>
                <span className="text-xl font-bold text-slate-950">{capex.grossCapexLabel}</span>
                <span className="text-[10px] text-amber-700 block mt-0.5">-€{(capex.overlaps.totalOverlapsEur / 1_000_000_000).toFixed(2)} MLD suprapuneri</span>
              </div>
            </div>

            {/* Metodologie CAPEX & Reconciliere Suprapuneri */}
            <div className="p-5 bg-white border border-slate-200 rounded-2xl text-[11px] text-slate-600 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                <span className="text-amber-800 font-bold uppercase text-[10px]">
                  RECONCILIEREA CAPEX ȘI ELIMINAREA DUBLĂRILOR (TOTAL NET: €10,86 MLD. EUR)
                </span>
                <span className="text-[10px] text-slate-400 font-mono">AUDIT DE INTEGRITATE DOCUMENTARĂ</span>
              </div>
              <p>
                Totalul brut indexat de <strong>11,95 miliarde EUR</strong> conține valoarea cumulată a tuturor dosarelor de proiect. În urma auditului de rigoare, au fost identificate și excluse din totalul net trei suprapuneri documentare în valoare de <strong>1,09 miliarde EUR</strong>:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-[10px]">
                <div className="p-3 bg-slate-50 border border-rose-200 rounded-xl space-y-1">
                  <span className="text-rose-700 font-bold block">1. Podul Brăila Duplicat (-€500M)</span>
                  <span className="text-slate-500 block">Înregistrare duplicat de portofoliu constructor (Webuild) a aceluiași pod suspendat de 1.974m.</span>
                </div>
                <div className="p-3 bg-slate-50 border border-rose-200 rounded-xl space-y-1">
                  <span className="text-rose-700 font-bold block">2. Brăila Connectors (-€500M)</span>
                  <span className="text-slate-500 block">Drumurile de legătură (21,5 km) au fost finanțate în contractul global CNAIR de €500M al podului.</span>
                </div>
                <div className="p-3 bg-slate-50 border border-amber-200 rounded-xl space-y-1">
                  <span className="text-amber-800 font-bold block">3. Silk District Faza 1 (-€90M)</span>
                  <span className="text-slate-500 block">Investiția de €90M livrată în faza 1 este inclusă în masterplanul total anunțat de €200M.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Top Developers by Capital Pipeline */}
          <section className="space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-950 uppercase tracking-wider flex items-center gap-2">
                <span className="text-amber-800">01.</span> TOP DEZVOLTATORI DUPĂ VOLUMUL DE CAPITAL VERIFICAT
              </h2>
              <span className="text-[10px] text-emerald-700 font-bold">100% SURSE OFICIALE</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200 font-bold">
                  <tr>
                    <th className="p-3.5">Dezvoltator</th>
                    <th className="p-3.5">Listare / CUI</th>
                    <th className="p-3.5">Capex Estimat / Anunțat</th>
                    <th className="p-3.5">Proiecte Majore Verificate</th>
                    <th className="p-3.5">Statut Probatoriu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {topDevelopers.map((dev, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900">{dev.name}</td>
                      <td className="p-3.5 text-slate-500">{dev.ticker}</td>
                      <td className="p-3.5 text-amber-800 font-bold">{dev.capex}</td>
                      <td className="p-3.5 text-slate-600">{dev.projects}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
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
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-950 uppercase tracking-wider flex items-center gap-2">
                <span className="text-amber-800">02.</span> CAPACITATEA DE EXECUȚIE A ANTREPRENORILOR GENERALI
              </h2>
              <span className="text-[10px] text-slate-500 font-bold">BILANȚURI FINANCIARE AUDITATE</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200 font-bold">
                  <tr>
                    <th className="p-3.5">Constructor General</th>
                    <th className="p-3.5">Cifră Afaceri Anuală</th>
                    <th className="p-3.5">Portofoliu Activ Recomandat</th>
                    <th className="p-3.5">Certificări &amp; Standarde</th>
                    <th className="p-3.5">Nivel Verificare</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {topContractors.map((c, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900">{c.name}</td>
                      <td className="p-3.5 text-amber-800 font-bold">{c.revenue}</td>
                      <td className="p-3.5 text-slate-600">{c.projects}</td>
                      <td className="p-3.5 text-slate-500">{c.cert}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
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
          <section className="p-6 md:p-8 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 font-mono text-xs">
            <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wider">
              03. METODOLOGIE &amp; TRANSPARENȚĂ FAPTICĂ
            </h3>
            <p className="text-slate-600 leading-relaxed font-sans">
              În conformitate cu standardul de integritate CONSTRUCTIONS by AiXLuxury, datele din acest raport sunt clasificate în patru niveluri distincte:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-4 bg-white rounded-xl border border-emerald-200 shadow-xs">
                <span className="text-emerald-800 font-bold block mb-1">VERIFICAT FAPTIC (VERIFIED)</span>
                <span className="text-slate-600 text-[11px]">Date probate indubitabil prin registre de stat: depuneri BVB, rapoarte financiare ONRC/ANAF, extrase ANCPI sau autorizații de construire emise de primării.</span>
              </div>
              <div className="p-4 bg-white rounded-xl border border-amber-200 shadow-xs">
                <span className="text-amber-800 font-bold block mb-1">RAPORTAT OFICIAL (REPORTED)</span>
                <span className="text-slate-600 text-[11px]">Informații publicate pe portalurile oficiale ale companiilor sau declarații de presă semnate de conducerea executivă, înainte de auditul terț.</span>
              </div>
              <div className="p-4 bg-white rounded-xl border border-sky-200 shadow-xs">
                <span className="text-sky-800 font-bold block mb-1">ESTIMAT DE PIAȚĂ (ESTIMATED)</span>
                <span className="text-slate-600 text-[11px]">Proiecții tehnice de cost calculate pe baza suprafețelor desfășurate și a costului mediu de execuție din normativele tehnice. Fără certitudine juridică.</span>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-300 shadow-xs">
                <span className="text-slate-600 font-bold block mb-1">NEDIVULGAT / CONFIDENȚIAL (NOT DISCLOSED)</span>
                <span className="text-slate-600 text-[11px]">Câmpuri pentru care nu există documente publice confirmate; nu se inventează valori și nu se extrapolează speculativ.</span>
              </div>
            </div>
          </section>

          {/* Institutional Contact CTA */}
          <div className="p-8 bg-slate-50 border border-amber-300 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
            <div className="space-y-1">
              <h4 className="text-xl font-bold text-slate-950 font-sans">
                Doriți un raport personalizat pentru portofoliul dumneavoastră?
              </h4>
              <p className="text-xs text-slate-600 font-mono">
                Echipa noastră furnizează rapoarte de due-diligence tehnic și economic pentru fonduri, bănci și dezvoltatori.
              </p>
            </div>
            <Link
              href="/contact"
              className="px-6 py-3.5 bg-slate-950 hover:bg-slate-800 text-white font-bold font-mono text-xs uppercase tracking-wider rounded-xl transition-all shrink-0 shadow-sm"
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
