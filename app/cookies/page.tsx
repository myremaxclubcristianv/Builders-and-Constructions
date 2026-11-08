import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cookie Policy | CONSTRUCTIONS by AiXLuxury',
  description: 'Cookie policy, storage mechanisms, session tokens, and privacy preferences for CONSTRUCTIONS by AiXLuxury.',
  alternates: {
    canonical: 'https://constructions.cristianvaduva.com/cookies'
  },
  openGraph: {
    title: 'Cookie Policy | CONSTRUCTIONS by AiXLuxury',
    description: 'Cookie policy and technical storage mechanisms for CONSTRUCTIONS by AiXLuxury.',
    url: 'https://constructions.cristianvaduva.com/cookies',
    siteName: 'CONSTRUCTIONS by AiXLuxury',
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cookie Policy | CONSTRUCTIONS by AiXLuxury',
    description: 'Cookie policy and technical storage mechanisms for CONSTRUCTIONS by AiXLuxury.'
  }
};

export default function CookiesPage() {
  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <SiteHeader />
      <main className="max-w-[1000px] mx-auto px-4 md:px-8 pt-28 md:pt-36 pb-24 space-y-8">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227]">
            LEGAL & PRIVACY DISCLOSURE
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-2">
            COOKIE POLICY
          </h1>
          <p className="text-xs font-mono text-[#888888] mt-2">
            Last Updated: November 1, 2026 · CONSTRUCTIONS by AiXLuxury
          </p>
        </div>

        <div className="space-y-8 text-sm text-[#A0A0A0] leading-relaxed border-t border-[#1A1D1B] pt-8">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">1. Scope and Architecture</h2>
            <p>
              This Cookie Policy describes how <strong>CONSTRUCTIONS by AiXLuxury</strong> utilizes cookies, browser local storage, and similar web technologies when you access our market intelligence platform. We prioritize privacy minimization and do not deploy third-party advertising tracking networks or invasive behavioral profiling trackers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">2. Categories of Storage Mechanisms</h2>
            <div className="space-y-4">
              <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Essential & Operational Cookies</span>
                  <span className="text-[10px] font-mono text-[#C9A227] px-2 py-0.5 bg-[#C9A227]/10 rounded border border-[#C9A227]/30">STRICTLY NECESSARY</span>
                </div>
                <p className="text-xs text-[#A0A0A0]">
                  Required for core platform navigation, DDoS protection, edge security through Cloudflare, and authenticated administrative session state. These cannot be deactivated without disrupting platform security.
                </p>
                <div className="text-[11px] font-mono text-[#888888]">
                  Examples: Cloudflare security verification tokens (__cf_bm, cf_clearance), Admin session JWT cookies.
                </div>
              </div>

              <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Functional Local Storage & Session State</span>
                  <span className="text-[10px] font-mono text-[#38bdf8] px-2 py-0.5 bg-[#38bdf8]/10 rounded border border-[#38bdf8]/30">FUNCTIONAL</span>
                </div>
                <p className="text-xs text-[#A0A0A0]">
                  Used client-side to persist user preferences such as the Market Watchlist (pinned companies and projects), UI state, and first-party visitor telemetry session IDs to prevent duplicate alerts.
                </p>
                <div className="text-[11px] font-mono text-[#888888]">
                  Storage Type: Browser localStorage / sessionStorage (aix_visitor_id, aix_session_id, market_watchlist).
                </div>
              </div>

              <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Third-Party Media Embeds</span>
                  <span className="text-[10px] font-mono text-[#86efac] px-2 py-0.5 bg-[#86efac]/10 rounded border border-[#86efac]/30">OPT-IN EMBED</span>
                </div>
                <p className="text-xs text-[#A0A0A0]">
                  Video desk showcases utilize YouTube&apos;s privacy-enhanced embed domain (<code>youtube-nocookie.com</code>). When viewing a video embed, YouTube may store cookies necessary to stream the video media.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">3. Retention Periods</h2>
            <p>
              Session tokens persist for the duration of your browser session or until logout. Client-side local storage items such as your saved Watchlist persist until you clear your browser cache or manually click &ldquo;Remove&rdquo; in the Watchlist terminal.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">4. Managing Your Preferences</h2>
            <p>
              You can block or delete cookies and local storage directly through your browser settings at any time:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Chrome: Settings → Privacy and Security → Third-party cookies</li>
              <li>Safari: Settings → Safari → Advanced → Privacy &amp; Cookies</li>
              <li>Firefox: Settings → Privacy &amp; Security → Cookies and Site Data</li>
            </ul>
          </section>

          <section className="space-y-3 pt-4 border-t border-[#1A1D1B]">
            <h2 className="text-lg font-bold text-white">5. Contact Regarding Data Rights</h2>
            <p>
              For privacy and data access requests under GDPR, please consult our{' '}
              <Link href="/privacy" className="text-[#C9A227] hover:underline">
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link href="/gdpr" className="text-[#C9A227] hover:underline">
                GDPR &amp; Data Rights
              </Link>{' '}
              desk, or submit an official inquiry via our{' '}
              <Link href="/contact" className="text-[#C9A227] hover:underline">
                Contact Desk
              </Link>.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
