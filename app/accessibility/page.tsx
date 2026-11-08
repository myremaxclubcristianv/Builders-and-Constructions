import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Accessibility Statement | CONSTRUCTIONS by AiXLuxury',
  description: 'Commitment to digital accessibility, assistive technology support, semantic structure, and keyboard navigation for CONSTRUCTIONS by AiXLuxury.',
  alternates: {
    canonical: 'https://constructions.cristianvaduva.com/accessibility'
  },
  openGraph: {
    title: 'Accessibility Statement | CONSTRUCTIONS by AiXLuxury',
    description: 'Digital accessibility principles and assistive standards for CONSTRUCTIONS by AiXLuxury.',
    url: 'https://constructions.cristianvaduva.com/accessibility',
    siteName: 'CONSTRUCTIONS by AiXLuxury',
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Accessibility Statement | CONSTRUCTIONS by AiXLuxury',
    description: 'Digital accessibility principles and assistive standards for CONSTRUCTIONS by AiXLuxury.'
  }
};

export default function AccessibilityPage() {
  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <SiteHeader />
      <main className="max-w-[1000px] mx-auto px-4 md:px-8 pt-28 md:pt-36 pb-24 space-y-8">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227]">
            ACCESSIBILITY & USABILITY STANDARDS
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-2">
            ACCESSIBILITY STATEMENT
          </h1>
          <p className="text-xs font-mono text-[#888888] mt-2">
            Last Updated: November 1, 2026 · CONSTRUCTIONS by AiXLuxury
          </p>
        </div>

        <div className="space-y-8 text-sm text-[#A0A0A0] leading-relaxed border-t border-[#1A1D1B] pt-8">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">1. Our Commitment</h2>
            <p>
              <strong>CONSTRUCTIONS by AiXLuxury</strong> is dedicated to providing an inclusive, barrier-free digital intelligence experience accessible to all users, regardless of ability or assistive technology. We build our platform in continuous alignment with the <strong>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong> standards.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">2. Core Technical Measures Implemented</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-2">
                <span className="font-bold text-white block">Semantic HTML &amp; Landmarks</span>
                <p className="text-xs text-[#A0A0A0]">
                  Proper heading hierarchies (<code>h1</code> through <code>h4</code>), landmark tags (<code>header</code>, <code>nav</code>, <code>main</code>, <code>aside</code>, <code>footer</code>), and descriptive section identifiers throughout all dossiers.
                </p>
              </div>

              <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-2">
                <span className="font-bold text-white block">Keyboard Navigation &amp; Focus</span>
                <p className="text-xs text-[#A0A0A0]">
                  Full focusability with visible outline rings, intuitive tab sequences, and standard keybindings (including <code>Escape</code> to immediately dismiss modal dialogs and slide-out navigation drawers).
                </p>
              </div>

              <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-2">
                <span className="font-bold text-white block">Reduced Motion Preferences</span>
                <p className="text-xs text-[#A0A0A0]">
                  Automatic compliance with <code>prefers-reduced-motion</code>. Tickers, transitions, and slide animations gracefully freeze or switch to instant updates for users sensitive to motion.
                </p>
              </div>

              <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-2">
                <span className="font-bold text-white block">Touch Targets &amp; Responsiveness</span>
                <p className="text-xs text-[#A0A0A0]">
                  All interactive controls, links, and mobile drawer triggers satisfy minimum 44 &times; 44px touch target guidelines with generous spacing to prevent accidental taps.
                </p>
              </div>

              <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-2">
                <span className="font-bold text-white block">Contrast &amp; Legibility</span>
                <p className="text-xs text-[#A0A0A0]">
                  Tailored color palette with high-contrast text ratios exceeding 4.5:1 on obsidian and dark-slate backgrounds, paired with scalable system and geometric typography.
                </p>
              </div>

              <div className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-2">
                <span className="font-bold text-white block">ARIA Attributes &amp; Labels</span>
                <p className="text-xs text-[#A0A0A0]">
                  Accessible name tags (<code>aria-label</code>, <code>aria-expanded</code>, <code>aria-haspopup</code>) applied to icon buttons, modal overlays, disclosure widgets, and search inputs.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white">3. Compatibility &amp; Assistive Tech</h2>
            <p>
              CONSTRUCTIONS is designed to be compatible with modern desktop and mobile browsers (Safari, Chrome, Firefox, Edge) and screen readers including Apple VoiceOver, NVDA, and Android TalkBack.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-[#1A1D1B]">
            <h2 className="text-lg font-bold text-white">4. Feedback &amp; Assistance</h2>
            <p>
              If you encounter any accessibility barriers while using our platform, or require information in an alternative format, please let us know. We treat accessibility feedback with priority.
            </p>
            <div className="pt-2">
              <Link
                href="/report-error"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#141715] border border-[#C9A227]/40 hover:border-[#C9A227] text-[#C9A227] rounded-lg font-mono text-xs font-bold transition-all"
              >
                <span>Report Accessibility Issue →</span>
              </Link>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
