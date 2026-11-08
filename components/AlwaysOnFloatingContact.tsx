'use client';

import React from 'react';

export function AlwaysOnFloatingContact() {
  const handleOpenContact = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('open-quick-contact', {
          detail: { interest: 'general-contact' }
        })
      );
    }
  };

  return (
    <aside
      aria-label="Always-on contact assistance"
      className="fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom))] lg:bottom-[calc(1.75rem+env(safe-area-inset-bottom))] right-[calc(1rem+env(safe-area-inset-right))] z-40 print:hidden"
    >
      <button
        onClick={handleOpenContact}
        aria-label="Open contact desk"
        className="group relative flex items-center gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 bg-[#0E100F]/95 hover:bg-[#151816] text-white border border-[#C9A227]/50 hover:border-[#C9A227] rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.6)] backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:ring-offset-2 focus:ring-offset-[#050505] cursor-pointer"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9A227] opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C9A227]" />
        </span>

        {/* Clean SVG Chat Bubble Icon (zero emojis) */}
        <svg
          className="w-4 h-4 text-[#C9A227] group-hover:text-white transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>

        <span className="text-xs font-mono font-bold tracking-wider text-white group-hover:text-[#C9A227] transition-colors uppercase">
          Contact
        </span>
      </button>
    </aside>
  );
}
