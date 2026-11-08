import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: 'Metodologie și Ierarhia Surselor de Date · CONSTRUCTIONS by AiXLuxury',
  description: 'Cadrul metodologic de verificare, proveniența surselor primare, taxonomia probatorie și clasificarea CAPEX pentru sectorul construcțiilor din România.',
  alternates: {
    canonical: 'https://constructions.cristianvaduva.com/methodology'
  },
  openGraph: {
    title: 'Metodologie și Ierarhia Surselor de Date · CONSTRUCTIONS by AiXLuxury',
    description: 'Cadrul metodologic de verificare, proveniența surselor primare, taxonomia probatorie și clasificarea CAPEX pentru sectorul construcțiilor din România.',
    url: 'https://constructions.cristianvaduva.com/methodology',
    siteName: 'CONSTRUCTIONS by AiXLuxury',
    locale: 'ro_RO',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Metodologie și Ierarhia Surselor de Date · CONSTRUCTIONS by AiXLuxury',
    description: 'Cadrul metodologic de verificare, proveniența surselor primare, taxonomia probatorie și clasificarea CAPEX pentru sectorul construcțiilor din România.'
  }
};

export default function MethodologyPage() {
  return (
    <div className="bg-white text-slate-900 min-h-screen selection:bg-amber-100 selection:text-amber-950">
      <SiteHeader />
      <main className="max-w-[1040px] mx-auto px-4 md:px-8 pt-32 pb-24 space-y-10">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-amber-800 font-bold block mb-2">
            CADRU METODOLOGIC DE CERCETARE INSTITUȚIONALĂ
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
            METODOLOGIE, PROVENIENȚĂ ȘI INTEGRITATE FAPTICĂ
          </h1>
          <p className="text-xs font-mono text-slate-500 mt-2 font-medium">
            Standarde de Verificare Independentă · Clasificare Probatorie · Transparență Editorială · Noiembrie 2026
          </p>
        </div>

        <div className="space-y-10 text-sm text-slate-600 leading-relaxed border-t border-slate-200 pt-8">
          {/* Secțiunea 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-950">1. Filosofia de Verificare și Independență</h2>
            <p>
              Platforma CONSTRUCTIONS by AiXLuxury oferă informații structurate de cercetare și intelligence tehnic asupra sectorului construcțiilor și dezvoltărilor imobiliare din România. Informațiile factuale sunt colectate exclusiv din registre publice de stat, raportări corporative auditate, documentații urbanistice oficiale și comunicări instituționale.
            </p>
            <p>
              Acolo unde o informație nu poate fi verificată independent din surse primare sigure, aceasta este clasificată explicit drept <code className="text-amber-800 font-semibold px-1 py-0.5 bg-amber-50 rounded border border-amber-200">NEDIVULGAT</code> sau <code className="text-amber-800 font-semibold px-1 py-0.5 bg-amber-50 rounded border border-amber-200">RAPORTAT</code>, fără a fi interpolate artificial sau prezentate drept certitudini.
            </p>
          </section>

          {/* Secțiunea 2 */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-950">2. Ierarhia Surselor în 4 Niveluri</h2>
            
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-800 uppercase block">NIVELUL 1 — REGISTRE STATUTARE ȘI INSTITUȚIONALE (AUTORITATE MAXIMĂ)</span>
              <p className="text-xs text-slate-600">
                Registre publice oficiale: Agenția Națională de Cadastru și Publicitate Imobiliară (ANCPI / OCPI), Oficiul Național al Registrului Comerțului (ONRC), Agenția Națională de Administrare Fiscală (ANAF), Ministerul Finanțelor Publice, Sistemul Electronic de Achiziții Publice (SEAP/SICAP), raportările reglementate BVB / Euronext și autorizațiile de construire emise de autoritățile publice locale.
              </p>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <span className="text-xs font-mono font-bold text-sky-800 uppercase block">NIVELUL 2 — RAPORTĂRI CORPORATIVE ȘI DECLARAȚII SEMNATE</span>
              <p className="text-xs text-slate-600">
                Rapoarte anuale de gestiune, situații financiare auditate, prezentări oficiale pentru investitori, comunicate de presă asumate nominal de conducerea executivă a dezvoltatorilor sau antreprenorilor generali.
              </p>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <span className="text-xs font-mono font-bold text-amber-800 uppercase block">NIVELUL 3 — PUBLICAȚII ECONOMICE ȘI JURNALISM FINANCIAR</span>
              <p className="text-xs text-slate-600">
                Articole de presă financiară de specialitate (Ziarul Financiar, Profit.ro, Economica.net, CIJ World, Economedia) cu atribuire clară a surselor și date factuale citate.
              </p>
            </div>

            <div className="p-6 bg-slate-50/50 border border-slate-200 rounded-2xl space-y-2 opacity-75">
              <span className="text-xs font-mono font-bold text-rose-700 uppercase block">NIVELUL 4 — SURSE EXCLUSE / NEACCEPTATE</span>
              <p className="text-xs text-slate-500">
                Site-uri imobiliare neoficiale, portaluri de anunțuri, bloguri anonime, agregatoare comerciale fără citare de sursă și materiale promoționale neverificabile. Toate acestea sunt respinse la indexare.
              </p>
            </div>
          </section>

          {/* Secțiunea 3 */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-950">3. Taxonomia Statutului Probatoriu</h2>
            <p>
              Pentru transparență maximă și excluderea oricăror estimări arbitrare, datele și imaginile din dosarele CONSTRUCTIONS primesc una dintre următoarele etichete calitative:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-5 bg-white border border-emerald-200 rounded-2xl space-y-1.5 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <span className="text-xs font-mono font-bold text-emerald-800 uppercase">VERIFIED / VERIFICAT FAPTIC</span>
                </div>
                <p className="text-xs text-slate-600">
                  Confirmat independent prin documente oficiale: ONRC, ANAF, extras CF ANCPI, autorizație de construire emisă sau raport BVB. Nu conține deducții sau proiecții neprobate.
                </p>
              </div>

              <div className="p-5 bg-white border border-sky-200 rounded-2xl space-y-1.5 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
                  <span className="text-xs font-mono font-bold text-sky-800 uppercase">REPORTED / RAPORTAT OFICIAL</span>
                </div>
                <p className="text-xs text-slate-600">
                  Comunicat asumat de reprezentanții oficiali ai companiei sau preluat din presă financiară de referință, în curs de confirmare prin registrele de stat.
                </p>
              </div>

              <div className="p-5 bg-white border border-amber-200 rounded-2xl space-y-1.5 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                  <span className="text-xs font-mono font-bold text-amber-800 uppercase">ESTIMATED / ESTIMAT</span>
                </div>
                <p className="text-xs text-slate-600">
                  Proiecție tehnică sau economică bazată pe suprafața utilă autorizată și costul mediu pe m² conform normativelor tehnice (ex. NE 012). Marcat întotdeauna explicit.
                </p>
              </div>

              <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-1.5 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  <span className="text-xs font-mono font-bold text-slate-600 uppercase">NEDIVULGAT / CONFIDENȚIAL</span>
                </div>
                <p className="text-xs text-slate-600">
                  Indicator ferm că datele specifice (CUI, valoare contract, subcontractanți, progres fizic) nu sunt publice; secțiunea rămâne neutră și nu este inventată nicio valoare.
                </p>
              </div>
            </div>
          </section>

          {/* Secțiunea 4 - CAPEX */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-950">4. Metodologia CAPEX și Reconcilierea Suprapunerilor</h2>
            <p>
              Cifrele agregate de CAPEX (Cheltuieli de Capital) prezentate pe platformă derivă exclusiv din eșantionul verificat și indexat în baza de date. Totalul brut al dosarelor indexate este de <strong>11,95 miliarde EUR</strong>, iar totalul net deduplicat este de <strong>10,86 miliarde EUR</strong>:
            </p>
            <div className="space-y-3 pt-1">
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <span className="text-xs font-mono font-bold text-amber-800 uppercase block">A. Distincția între Infrastructură Publică și Real Estate Privat</span>
                <p className="text-xs text-slate-600">
                  Marile obiective de infrastructură de transport (autostrăzi, drumuri expres, magistrale de metrou, poduri) finanțate din fonduri UE și bugetul de stat (<strong>€4,52 MLD. EUR net</strong>) sunt separate net de investițiile imobiliare comerciale private (rezidențial, birouri, parcuri logistice, retail: <strong>€6,34 MLD. EUR net</strong>).
                </p>
              </div>
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <span className="text-xs font-mono font-bold text-amber-800 uppercase block">B. Faze vs. Masterplan și Eliminarea Dublărilor (-€1,09 MLD. EUR)</span>
                <p className="text-xs text-slate-600">
                  Pentru a asigura integritatea matematică, au fost eliminate trei suprapuneri documentate:
                </p>
                <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1 pt-1">
                  <li><strong>Podul Brăila Duplicat (-€500M):</strong> Eliminat duplicatul de portofoliu al constructorului (Webuild) pentru același contract canonic al podului de 1.974m.</li>
                  <li><strong>Podul Brăila Conectoare (-€500M):</strong> Drumurile de legătură de 21,5 km sunt cuprinse în contractul global CNAIR de €500M al podului; valoarea nu a fost numărată dublu.</li>
                  <li><strong>Silk District Faza 1 (-€90M):</strong> Faza 1 finalizată și livrată este cuprinsă în masterplanul total anunțat de €200M și a fost dedusă pentru a evita cumularea fazei peste masterplan.</li>
                </ul>
              </div>
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <span className="text-xs font-mono font-bold text-amber-800 uppercase block">C. Categorii de Înregistrare CAPEX</span>
                <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
                  <li><strong>CAPEX Contractat:</strong> Valori confirmate prin contracte de antrepriză generală, licitații publice atribuite și înregistrate în SEAP sau raportări la Bursa de Valori.</li>
                  <li><strong>CAPEX Realizat:</strong> Tranșe financiare recepționate pe baza situațiilor de lucrări executate și a proceselor verbale de recepție la terminarea lucrărilor.</li>
                  <li><strong>CAPEX Anunțat:</strong> Bugete de investiții declarate în documentațiile de autorizare și comunicatele oficiale de lansare ale dezvoltatorului.</li>
                  <li><strong>CAPEX Estimat:</strong> Calcule analitice deduse din costul de construcție specific tipologiei și suprafeței desfășurate.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Secțiunea 5 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-950">5. Limitele Eșantionului Indexat și Natura Clasamentelor</h2>
            <p>
              CONSTRUCTIONS by AiXLuxury indexează în prezent <strong>76 de proiecte majore</strong> și <strong>143 de companii comerciale</strong> din România.
            </p>
            <p>
              Clasamentele și indicatorii agregați reflectă în mod onest și direct <em>dimensiunea eșantionului propriu verificat</em> (n=76 proiecte), și nu un recensământ exhaustiv al întregii industrii naționale de construcții. Entitățile sau orașele neindexate încă nu reflectă inactivitate economică, ci stadiul curent de cercetare editorială.
            </p>
          </section>

          {/* Secțiunea 6 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-950">6. Politica de Corecții și Actualizări</h2>
            <p>
              Reprezentanții acreditați ai dezvoltatorilor, antreprenorilor generali, birourilor de arhitectură și inginerie pot trimite actualizări sau rectificări documentate:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li>Trimiteți propuneri factuale prin intermediul <Link href="/contact" className="text-amber-800 underline font-semibold">Biroului de Asistență și Corecții</Link>.</li>
              <li>Atașați sau indicați sursa primară verificabilă (extras CF, certificat de urbanism, autorizație de construire, comunicat oficial sau link SEAP).</li>
              <li>Orice rectificare este validată de echipa de cercetare înainte de actualizarea dosarului canonic.</li>
            </ul>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
