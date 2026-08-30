import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="bg-[#050505] border-t border-[#1A1D1B] pt-12 pb-24 lg:pb-12 text-[#A0A0A0]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-[#1A1D1B]">
          {/* Column 1: Brand & Independent Platform Disclosure */}
          <div className="space-y-3">
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-lg text-white">CONSTRUCTIONS</span>
              <span className="text-[10px] font-mono tracking-wider text-[#C9A227] uppercase">by AiXLuxury</span>
            </div>
            <p className="text-xs leading-relaxed text-[#888888]">
              Independent construction-market intelligence platform for Romania&apos;s evolving built environment documenting verified developers, contractors, engineers, and architectural practices.
            </p>
            <p className="text-[10px] leading-relaxed text-[#666666] pt-1">
              CONSTRUCTIONS is an independent information platform. Inclusion does not imply representation or endorsement of indexed entities.
            </p>
          </div>

          {/* Column 2: Intelligence & Media */}
          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] mb-4">Intelligence & Media</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/projects" className="hover:text-white transition-colors">Development Projects</Link></li>
              <li><Link href="/companies" className="hover:text-white transition-colors">Corporate Companies</Link></li>
              <li><Link href="/cities" className="hover:text-white transition-colors">Regional Locations</Link></li>
              <li><Link href="/video" className="hover:text-[#C9A227] transition-colors font-semibold text-white">Video Desk & Shorts</Link></li>
              <li><Link href="/rankings" className="hover:text-white transition-colors">Rankings & Leaders</Link></li>
              <li><Link href="/coverage" className="hover:text-white transition-colors">Data Coverage Matrix</Link></li>
              <li><Link href="/search" className="hover:text-white transition-colors">Global Search</Link></li>
            </ul>
          </div>

          {/* Column 3: Institutional Research */}
          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] mb-4">Institutional Research</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/research-request" className="hover:text-white transition-colors">Request Institutional Research</Link></li>
              <li><Link href="/methodology" className="hover:text-white transition-colors">Data Methodology</Link></li>
              <li><Link href="/report-error" className="hover:text-white transition-colors">Request Profile Correction</Link></li>
              <li><Link href="/alerts" className="hover:text-white transition-colors">Market Alerts Terminal</Link></li>
              <li><Link href="/decisions" className="hover:text-white transition-colors">Institutional Decisions</Link></li>
              <li><Link href="/actions" className="hover:text-white transition-colors">Private Action Queue</Link></li>
            </ul>
          </div>

          {/* Column 4: Governance & Legal */}
          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] mb-4">Governance & Legal</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/gdpr" className="hover:text-white transition-colors">GDPR & Data Rights</Link></li>
              <li><Link href="/work-with-us" className="hover:text-white transition-colors">Work With CONSTRUCTIONS</Link></li>
              <li className="pt-2">
                <a href="https://aixluxury.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[11px] hover:text-white transition-colors">
                  <span>aixluxury.com</span>
                  <span className="text-[10px] text-[#C9A227]">↗</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#888888] gap-4">
          <p>© {new Date().getFullYear()} CONSTRUCTIONS by AiXLuxury. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/methodology" className="hover:text-[#C9A227] transition-colors">Data Methodology</Link>
            <span>·</span>
            <Link href="/report-error" className="hover:text-[#C9A227] transition-colors">Request Correction</Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-[#C9A227] transition-colors">Terms</Link>
            <span>·</span>
            <Link href="/privacy" className="hover:text-[#C9A227] transition-colors">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
