import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="bg-[#050505] border-t border-[#1A1D1B] pt-12 pb-24 lg:pb-12 text-[#A0A0A0]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-[#1A1D1B]">
          <div className="space-y-3">
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-lg text-white">CONSTRUCTIONS</span>
              <span className="text-[10px] font-mono tracking-wider text-[#C9A227] uppercase">by AiXLuxury</span>
            </div>
            <p className="text-xs leading-relaxed max-w-sm text-[#888888]">
              National Construction Intelligence platform documenting the developers, contractors, engineers, and architectural practices shaping the built environment.
            </p>
          </div>

          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] mb-4">Discover</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/projects" className="hover:text-white transition-colors">Projects Dataset</Link></li>
              <li><Link href="/companies" className="hover:text-white transition-colors">Verified Companies</Link></li>
              <li><Link href="/cities" className="hover:text-white transition-colors">Locations & Cities</Link></li>
              <li><Link href="/contractors" className="hover:text-white transition-colors">Contractors</Link></li>
              <li><Link href="/rankings" className="hover:text-white transition-colors">Rankings & Leaders</Link></li>
              <li><Link href="/search" className="hover:text-white transition-colors">Global Intelligence Search</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] mb-4">Services & Promotion</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/promote-company" className="hover:text-white transition-colors">Promote Your Company</Link></li>
              <li><Link href="/promote-project" className="hover:text-white transition-colors">Promote A Project</Link></li>
              <li><Link href="/work-with-us" className="hover:text-white transition-colors">Institutional Intelligence</Link></li>
              <li><Link href="/compare" className="hover:text-white transition-colors">Entity Benchmark</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] mb-4">AiXLuxury Network</h4>
            <div className="space-y-2 text-xs">
              <a href="https://aixluxury.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-white transition-colors">
                <span>aixluxury.com</span>
                <span className="text-[10px] text-[#C9A227]">↗</span>
              </a>
              <p className="text-[11px] text-[#666666]">Bucharest · Romania</p>
              <p className="text-[10px] font-mono text-[#888888] pt-2">
                Primary-Source Verification Engine · 100% Real Data
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#888888] gap-4">
          <p>© {new Date().getFullYear()} CONSTRUCTIONS by AiXLuxury. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Primary-Source Data</span>
            <span>·</span>
            <span>Zero Fabrication</span>
            <span>·</span>
            <span>Verified Intelligence</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
