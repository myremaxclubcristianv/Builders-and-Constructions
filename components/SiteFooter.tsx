import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-[#050505] border-t border-[#1A1D1B] pt-12 pb-24 lg:pb-12 text-[#A0A0A0]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-[#1A1D1B]">
          {/* Column 1: Brand & Platform Mission */}
          <div className="space-y-3 sm:col-span-2 lg:col-span-1">
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-lg text-white">CONSTRUCTIONS</span>
              <span className="text-[10px] font-mono tracking-wider text-[#C9A227] uppercase">by AiXLuxury</span>
            </div>
            <p className="text-xs leading-relaxed text-[#888888]">
              Platformă independentă de cercetare tehnică și date verificate faptic pentru piața construcțiilor și dezvoltării imobiliare din România.
            </p>
            <p className="text-[10px] leading-relaxed text-[#666666] pt-1 font-mono">
              Conformitate Eurocode, NE 012-1:2022, P100-1/2013, CR 6-2013 și Legea 10/1995 privind calitatea în construcții.
            </p>
          </div>

          {/* Column 2: Bază Normativă & Materiale */}
          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] mb-4">Normative & Materiale</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/knowledge" className="hover:text-white transition-colors font-semibold text-white">Hub Normative & Ghiduri</Link></li>
              <li><Link href="/knowledge/materials" className="hover:text-white transition-colors">Materiale & Produse</Link></li>
              <li><Link href="/knowledge/concrete" className="hover:text-white transition-colors">Beton & Matrice Ciment</Link></li>
              <li><Link href="/knowledge/systems" className="hover:text-white transition-colors">Sisteme Structurale & P100-1</Link></li>
              <li><Link href="/knowledge/infrastructure" className="hover:text-white transition-colors">Infrastructură Civilă</Link></li>
              <li><Link href="/knowledge/engineering" className="hover:text-white transition-colors">Fizica Construcțiilor & ISU</Link></li>
              <li><Link href="/knowledge/standards" className="hover:text-white transition-colors">Eurocoduri & CPR 2024</Link></li>
              <li><Link href="/knowledge/glossary" className="hover:text-white transition-colors">Glosar Tehnic Construcții</Link></li>
              <li><Link href="/knowledge/sources" className="hover:text-white transition-colors">Registrul Surselor Oficiale</Link></li>
            </ul>
          </div>

          {/* Column 3: Director Național */}
          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] mb-4">Director Național</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/developers" className="hover:text-white transition-colors">Dezvoltatori Imobiliari</Link></li>
              <li><Link href="/projects" className="hover:text-white transition-colors">Proiecte & Șantiere</Link></li>
              <li><Link href="/contractors" className="hover:text-white transition-colors">Antreprenori Generali</Link></li>
              <li><Link href="/architects" className="hover:text-white transition-colors">Birouri de Arhitectură</Link></li>
              <li><Link href="/engineers" className="hover:text-white transition-colors">Inginerie & Structuri</Link></li>
              <li><Link href="/agencies" className="hover:text-white transition-colors">Consultanță Imobiliară</Link></li>
              <li><Link href="/map" className="hover:text-white transition-colors">Harta Națională Interactivă</Link></li>
            </ul>
          </div>

          {/* Column 4: Cercetare & Intelligence */}
          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] mb-4">Intelligence & Analiză</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/intelligence" className="hover:text-white transition-colors">Birou de Intelligence</Link></li>
              <li><Link href="/signals" className="hover:text-white transition-colors">Semnale de Piață Verificate</Link></li>
              <li><Link href="/rankings" className="hover:text-white transition-colors">Clasamente pe Eșantion</Link></li>
              <li><Link href="/sample-report" className="hover:text-white transition-colors">Raport Mostră de Piață</Link></li>
              <li><Link href="/compare" className="hover:text-white transition-colors">Comparare Proiecte</Link></li>
              <li><Link href="/watchlist" className="hover:text-white transition-colors">Monitorizare Portofoliu</Link></li>
              <li><Link href="/methodology" className="hover:text-white transition-colors">Metodologia Surselor</Link></li>
              <li><Link href="/video" className="hover:text-[#C9A227] transition-colors font-semibold text-white">Studio Video & Rapoarte</Link></li>
            </ul>
          </div>

          {/* Column 5: Guvernanță & Transparență */}
          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] mb-4">Guvernanță & Despre</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/about/cristian-vaduva" className="hover:text-white transition-colors">Cristian Văduva</Link></li>
              <li><Link href="/about/aixluxury" className="hover:text-white transition-colors">Platforma AiXLuxury</Link></li>
              <li><Link href="/work-with-us" className="hover:text-white transition-colors">Colaborare Instituțională</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Termeni & Condiții</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Politica de Confidențialitate</Link></li>
              <li><Link href="/cookies" className="hover:text-white transition-colors">Politica de Cookie-uri</Link></li>
              <li><Link href="/gdpr" className="hover:text-white transition-colors">Drepturi Date & GDPR</Link></li>
              <li><Link href="/accessibility" className="hover:text-white transition-colors">Declarație de Accesibilitate</Link></li>
              <li className="pt-2">
                <a href="https://aixluxury.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] hover:text-white transition-colors">
                  <span>aixluxury.com</span>
                  <span className="text-[10px] text-[#C9A227]">↗</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Independence & Non-Financial Advice Disclaimer */}
        <div className="py-6 border-b border-[#1A1D1B] text-[11px] font-mono text-[#777777] leading-relaxed space-y-2">
          <p>
            <strong className="text-[#A0A0A0]">DECLARAȚIE DE INDEPENDENȚĂ & CARACTER INFORMATIV:</strong> CONSTRUCTIONS by AiXLuxury este o platformă exclusiv informativă de cercetare editorială și intelligence pe date publice. Informațiile, clasamentele și dosarele publicate nu reprezintă recomandări de investiții, oferte financiare, intermedieri sau garanții contractuale. Cristian Văduva și entitățile afiliate (inclusiv serviciile specializate HomeFind în imobiliare și What If Insurance în asigurări) își desfășoară activitățile comerciale în mod distinct și transparent. Indexarea, ranking-urile și clasificările probatorii din CONSTRUCTIONS sunt guvernate strict de metodologia bazată pe dovezi verificabile (ONRC, ANAF, ANCPI, BVB, autorizații de construire) și nu pot fi influențate sau achiziționate comercial.
          </p>
        </div>

        {/* Bottom Legal Copyright Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#666666]">
          <p>© {new Date().getFullYear()} CONSTRUCTIONS by AiXLuxury. Toate drepturile rezervate.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>BUCUREȘTI, ROMÂNIA</span>
            <span>•</span>
            <span className="text-[#C9A227]">DATE DE NIVEL 1 DIN SURSE STATUTARE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
