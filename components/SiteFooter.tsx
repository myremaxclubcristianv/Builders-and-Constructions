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
              Construction Market Intelligence & Factually Verified Materials Platform for Romania&apos;s evolving built environment.
            </p>
            <p className="text-[10px] leading-relaxed text-[#666666] pt-1 font-mono">
              Eurocodes, NE 012-1:2022, P100-1/2013, CR 6-2013 and Legea 10/1995 verified data framework.
            </p>
          </div>

          {/* Column 2: Construction Knowledge Base */}
          <div>
                        <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] mb-4">Knowledge & Materials</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/knowledge" className="hover:text-white transition-colors font-semibold text-white">Knowledge Hub</Link></li>
              <li><Link href="/knowledge/materials" className="hover:text-white transition-colors">Materials & Products</Link></li>
              <li><Link href="/knowledge/concrete" className="hover:text-white transition-colors">Concrete & Cement Matrix</Link></li>
              <li><Link href="/knowledge/systems" className="hover:text-white transition-colors">Structural Systems & P100-1</Link></li>
              <li><Link href="/knowledge/infrastructure" className="hover:text-white transition-colors">Civil Infrastructure</Link></li>
              <li><Link href="/knowledge/engineering" className="hover:text-white transition-colors">Building Physics & Fire</Link></li>
              <li><Link href="/knowledge/standards" className="hover:text-white transition-colors">Eurocodes & CPR 2024</Link></li>
              <li><Link href="/knowledge/glossary" className="hover:text-white transition-colors">Construction Glossary</Link></li>
              <li><Link href="/knowledge/sources" className="hover:text-white transition-colors">Official Sources Registry</Link></li>
            </ul>
          </div>

          {/* Column 3: Market Discovery */}
          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] mb-4">Market Discovery</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/developers" className="hover:text-white transition-colors">Real Estate Developers</Link></li>
              <li><Link href="/projects" className="hover:text-white transition-colors">Development Projects</Link></li>
              <li><Link href="/contractors" className="hover:text-white transition-colors">Contractors & Builders</Link></li>
              <li><Link href="/architects" className="hover:text-white transition-colors">Architects & Planners</Link></li>
              <li><Link href="/engineers" className="hover:text-white transition-colors">Engineering Consultants</Link></li>
              <li><Link href="/agencies" className="hover:text-white transition-colors">Real Estate Agencies</Link></li>
              <li><Link href="/cities" className="hover:text-white transition-colors">Regional Locations</Link></li>
            </ul>
          </div>

          {/* Column 4: Intelligence & Research */}
          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] mb-4">Intelligence & Research</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/intelligence" className="hover:text-white transition-colors">Intelligence Desk</Link></li>
              <li><Link href="/signals" className="hover:text-white transition-colors">Live Construction Signals</Link></li>
              <li><Link href="/changes" className="hover:text-white transition-colors">Documented Changes</Link></li>
              <li><Link href="/compare" className="hover:text-white transition-colors">Entity Comparison</Link></li>
              <li><Link href="/watchlist" className="hover:text-white transition-colors">Market Watchlist</Link></li>
              <li><Link href="/research-request" className="hover:text-white transition-colors">Research Request Desk</Link></li>
              <li><Link href="/methodology" className="hover:text-white transition-colors">Provenance Methodology</Link></li>
              <li><Link href="/video" className="hover:text-[#C9A227] transition-colors font-semibold text-white">Video Desk & Shorts</Link></li>
            </ul>
          </div>

          {/* Column 5: Governance & Profiles */}
          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] mb-4">Governance & About</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/about/cristian-vaduva" className="hover:text-white transition-colors">Cristian Văduva</Link></li>
              <li><Link href="/about/aixluxury" className="hover:text-white transition-colors">AiXLuxury Platform</Link></li>
              <li><Link href="/work-with-us" className="hover:text-white transition-colors">Work With CONSTRUCTIONS</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/gdpr" className="hover:text-white transition-colors">GDPR & Data Rights</Link></li>
              <li className="pt-2">
                <a href="https://aixluxury.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] hover:text-white transition-colors">
                  <span>aixluxury.com</span>
                  <span className="text-[10px] text-[#C9A227]">↗</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#666666]">
          <p>© {new Date().getFullYear()} CONSTRUCTIONS by AiXLuxury. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>BUCHAREST, ROMANIA</span>
            <span>•</span>
            <span className="text-[#C9A227]">TIER 1 PROVENANCE DATA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
