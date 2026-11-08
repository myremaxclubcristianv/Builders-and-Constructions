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
  { label: 'INTELIGENȚĂ & ANALIZĂ DE PIAȚĂ', href: '/intelligence', badge: 'PORTAL' },
  { label: '76 DE PROIECTE VERIFICATE', href: '/projects' },
  { label: '48 DE DEZVOLTATORI IMOBILIARI', href: '/developers' },
  { label: '13 DIVIZII OFICIALE DE SERVICII', href: '/services', badge: 'DIVIZII' },
  { label: 'ASIGURAREA CALITĂȚII & PCCVI', href: '/services/calitate-constructii' },
  { label: 'CARTEA TEHNICĂ (HG 273/1994)', href: '/services/cartea-tehnica' },
  { label: 'EUROCODURI STRUCTURALE (EN 1990-1999)', href: '/knowledge/standards' },
  { label: 'STANDARDE BETON & CIMENT (SR EN 206)', href: '/knowledge/concrete', badge: 'NORME' },
  { label: 'SISTEME STRUCTURALE SEISMICE (P100-1)', href: '/knowledge/systems' },
  { label: 'INFRASTRUCTURĂ CIVILĂ & DRUMURI', href: '/knowledge/infrastructure' },
  { label: 'FIZICA CONSTRUCȚIILOR & SECURITATE INCENDIU', href: '/knowledge/engineering' },
  { label: 'SEMNALE DE PIAȚĂ NOIEMBRIE 2026', href: '/signals', badge: 'ACTUALIZAT' },
  { label: 'BIROU DE CONTACT & CONSULTANȚĂ', href: '/contact', isAction: true }
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
              className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-[#b45309] hover:text-[#92400e] transition-colors cursor-pointer font-bold"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#b45309] animate-pulse" />
              <span>{item.label}</span>
              <span className="text-[9px] bg-amber-100 text-[#b45309] px-1 py-0.2 rounded border border-amber-200">
                BIROU
              </span>
            </button>
          ) : (
            <Link
              href={item.href}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-600 hover:text-[#b45309] transition-colors"
            >
              <span>{item.label}</span>
              {item.badge && (
                <span className="text-[8px] bg-slate-200/80 text-slate-700 px-1 py-0.2 rounded border border-slate-300">
                  {item.badge}
                </span>
              )}
            </Link>
          )}
          <span className="text-slate-300 text-[9px] select-none mx-1">•</span>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <aside
      aria-label="Flux informativ derulant"
      role="region"
      className="bg-slate-50 border-b border-slate-200 h-8 sm:h-7.5 overflow-hidden relative flex items-center select-none z-50 text-xs"
    >
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

      <div className="ticker-track flex items-center whitespace-nowrap will-change-transform">
        {renderItemSet('set-1')}
        {renderItemSet('set-2')}
      </div>
    </aside>
  );
}
