'use client';

import React from 'react';
import Link from 'next/link';

interface TickerItem {
  label: string;
  href: string;
  badge?: string;
  isAction?: boolean;
}

const TICKER_ITEMS: TickerItem[] = [
  { label: 'CONSTRUCTIONS by AiXLuxury', href: '/' },
  { label: 'CONSTRUCTION INTELLIGENCE', href: '/intelligence', badge: 'PORTAL' },
  { label: '76 VERIFIED PROJECTS', href: '/projects' },
  { label: '48 DEVELOPER COMPANIES', href: '/developers' },
  { label: '13 OFFICIAL SERVICES', href: '/services', badge: 'DIVISIONS' },
  { label: 'QUALITY ASSURANCE & PCCVI', href: '/services/calitate-constructii' },
  { label: 'TECHNICAL BOOK (HG 273/1994)', href: '/services/cartea-tehnica' },
  { label: 'EUROCODES (EN 1990-1999)', href: '/knowledge/standards' },
  { label: 'CONCRETE INTEL (SR EN 206)', href: '/knowledge/concrete', badge: 'NORMS' },
  { label: 'STRUCTURAL SYSTEMS (P100-1)', href: '/knowledge/systems' },
  { label: 'CIVIL INFRASTRUCTURE & ROADS', href: '/knowledge/infrastructure' },
  { label: 'BUILDING PHYSICS & FIRE SAFETY', href: '/knowledge/engineering' },
  { label: 'MARKET RADAR & SIGNALS', href: '/signals', badge: 'LIVE' },
  { label: 'ALWAYS-ON CONTACT DESK', href: '/contact', isAction: true }
];

export function LiveRollingTicker() {
  const handleOpenContact = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-quick-contact', { detail: { interest: 'general-contact' } }));
    }
  };

  const renderItemSet = (keyPrefix: string) => (
    <div className="inline-flex items-center shrink-0">
      {TICKER_ITEMS.map((item, idx) => (
        <React.Fragment key={keyPrefix + '-' + idx}>
          {item.isAction ? (
            <button
              onClick={handleOpenContact}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-[#C9A227] hover:text-white transition-colors cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] animate-pulse" />
              <span className="font-bold">{item.label}</span>
              <span className="text-[9px] bg-[#C9A227]/20 px-1 py-0.2 rounded border border-[#C9A227]/40">
                DESK
              </span>
            </button>
          ) : (
            <Link
              href={item.href}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-[#A0A0A0] hover:text-[#C9A227] transition-colors"
            >
              <span>{item.label}</span>
              {item.badge && (
                <span className="text-[8px] bg-[#161816] text-[#C9A227] px-1 py-0.2 rounded border border-[#C9A227]/30">
                  {item.badge}
                </span>
              )}
            </Link>
          )}
          <span className="text-[#333333] text-[9px] select-none mx-1">•</span>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <aside
      aria-label="Platform information marquee"
      role="region"
      className="bg-[#060706] border-b border-[#1A1D1B] h-8 sm:h-7.5 overflow-hidden relative flex items-center select-none z-50 text-xs"
    >
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#060706] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#060706] to-transparent z-10 pointer-events-none" />

      <div className="animate-rolling-ticker">
        {renderItemSet('set1')}
        {renderItemSet('set2')}
      </div>
    </aside>
  );
}
