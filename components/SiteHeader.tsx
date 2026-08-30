'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Top Header Bar */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#050505]/95 backdrop-blur-md border-b border-[#1A1D1B] py-3'
            : 'bg-gradient-to-b from-[#050505]/90 to-transparent py-4'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex items-center justify-between">
          <Link href="/" className="flex flex-col group">
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-lg md:text-xl text-white group-hover:text-[#C9A227] transition-colors">
                CONSTRUCTIONS
              </span>
              <span className="text-[10px] font-mono tracking-widest text-[#C9A227] px-1.5 py-0.5 border border-[#C9A227]/30 rounded bg-[#C9A227]/10">
                PROD
              </span>
            </div>
            <span className="text-[10px] font-mono tracking-wider text-[#A0A0A0] uppercase">
              by AiXLuxury
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs tracking-wider uppercase font-medium text-[#C5C5C5]">
            <Link
              href="/projects"
              className={`hover:text-[#C9A227] transition-colors ${
                pathname.startsWith('/projects') ? 'text-[#C9A227] font-semibold' : ''
              }`}
            >
              Projects
            </Link>
            <Link
              href="/companies"
              className={`hover:text-[#C9A227] transition-colors ${
                pathname.startsWith('/companies') ? 'text-[#C9A227] font-semibold' : ''
              }`}
            >
              Companies
            </Link>
            <Link
              href="/rankings"
              className={`hover:text-[#C9A227] transition-colors ${
                pathname === '/rankings' ? 'text-[#C9A227] font-semibold' : ''
              }`}
            >
              Rankings
            </Link>
            <Link
              href="/compare"
              className={`hover:text-[#C9A227] transition-colors ${
                pathname === '/compare' ? 'text-[#C9A227] font-semibold' : ''
              }`}
            >
              Compare
            </Link>
            <Link
              href="/pipeline"
              className={`hover:text-[#C9A227] transition-colors ${
                pathname === '/pipeline' ? 'text-[#C9A227] font-semibold' : ''
              }`}
            >
              Pipeline
            </Link>
            <Link
              href="/map"
              className={`hover:text-[#C9A227] transition-colors ${
                pathname === '/map' ? 'text-[#C9A227] font-semibold' : ''
              }`}
            >
              Map
            </Link>
            <Link
              href="/search"
              className="flex items-center gap-1.5 text-[#C9A227] font-semibold hover:text-[#E4C58F] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </Link>
            <Link
              href="/promote-company"
              className="px-3.5 py-1.5 border border-[#C9A227]/40 text-[#C9A227] hover:bg-[#C9A227] hover:text-[#050505] transition-all rounded text-xs font-mono tracking-wider"
            >
              Promote Entity
            </Link>
          </nav>

          {/* Mobile Right Actions */}
          <div className="flex lg:hidden items-center gap-3">
            <Link
              href="/search"
              aria-label="Search"
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#111111] border border-[#1A1D1B] text-[#C9A227] active:scale-95 transition-transform"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation drawer"
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#111111] border border-[#1A1D1B] text-white active:scale-95 transition-transform"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6 text-[#C9A227]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#050505] flex flex-col justify-between p-6 overflow-y-auto animate-fadeIn">
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-[#1A1D1B]">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <span className="font-extrabold tracking-tight text-xl text-white">CONSTRUCTIONS</span>
                <span className="block text-[10px] font-mono text-[#A0A0A0]">by AiXLuxury</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-11 h-11 flex items-center justify-center rounded-lg bg-[#111111] border border-[#1A1D1B] text-[#C9A227]"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="py-6 space-y-6">
              <div>
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] mb-3">Explore Database</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/projects"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-lg text-sm font-medium text-white hover:border-[#C9A227]/50 active:bg-[#111111] flex items-center justify-between"
                  >
                    <span>Projects</span>
                    <span className="text-[10px] font-mono text-[#C9A227]">53</span>
                  </Link>
                  <Link
                    href="/companies"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-lg text-sm font-medium text-white hover:border-[#C9A227]/50 active:bg-[#111111] flex items-center justify-between"
                  >
                    <span>Companies</span>
                    <span className="text-[10px] font-mono text-[#C9A227]">40</span>
                  </Link>
                  <Link
                    href="/cities"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-lg text-sm font-medium text-white hover:border-[#C9A227]/50 active:bg-[#111111] flex items-center justify-between"
                  >
                    <span>Locations</span>
                    <span className="text-[10px] font-mono text-[#C9A227]">36</span>
                  </Link>
                  <Link
                    href="/contractors"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-lg text-sm font-medium text-white hover:border-[#C9A227]/50 active:bg-[#111111] flex items-center justify-between"
                  >
                    <span>Contractors</span>
                    <span className="text-[10px] font-mono text-[#C9A227]">12</span>
                  </Link>
                  <Link
                    href="/architects"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-lg text-sm font-medium text-white hover:border-[#C9A227]/50 active:bg-[#111111] flex items-center justify-between"
                  >
                    <span>Architects</span>
                    <span className="text-[10px] font-mono text-[#C9A227]">3</span>
                  </Link>
                  <Link
                    href="/engineers"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-lg text-sm font-medium text-white hover:border-[#C9A227]/50 active:bg-[#111111] flex items-center justify-between"
                  >
                    <span>Engineers</span>
                    <span className="text-[10px] font-mono text-[#C9A227]">3</span>
                  </Link>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] mb-3">Intelligence & Analytics</h4>
                <div className="space-y-2">
                  <Link
                    href="/rankings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-lg text-sm font-medium text-white hover:border-[#C9A227]/50 active:bg-[#111111] flex items-center justify-between"
                  >
                    <span>Rankings & Leaders</span>
                    <span className="text-xs text-[#C9A227]">→</span>
                  </Link>
                  <Link
                    href="/compare"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-lg text-sm font-medium text-white hover:border-[#C9A227]/50 active:bg-[#111111] flex items-center justify-between"
                  >
                    <span>Compare Entities</span>
                    <span className="text-xs text-[#C9A227]">→</span>
                  </Link>
                  <Link
                    href="/pipeline"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-lg text-sm font-medium text-white hover:border-[#C9A227]/50 active:bg-[#111111] flex items-center justify-between"
                  >
                    <span>Development Pipeline</span>
                    <span className="text-xs text-[#C9A227]">→</span>
                  </Link>
                  <Link
                    href="/map"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-lg text-sm font-medium text-white hover:border-[#C9A227]/50 active:bg-[#111111] flex items-center justify-between"
                  >
                    <span>Interactive Map</span>
                    <span className="text-xs text-[#C9A227]">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1A1D1B] space-y-3 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <Link
              href="/promote-company"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-3 text-center bg-[#C9A227] text-[#050505] font-semibold font-mono text-xs uppercase tracking-wider rounded-lg active:scale-98 transition-transform"
            >
              Promote Entity
            </Link>
            <p className="text-[10px] font-mono text-[#888888] text-center">
              National Construction Intelligence · Verified Primary Sources
            </p>
          </div>
        </div>
      )}

      {/* Persistent Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0B0B]/95 backdrop-blur-lg border-t border-[#1C1F1D] px-2 py-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))]">
        <div className="grid grid-cols-5 gap-1 text-center">
          <Link
            href="/"
            className={`flex flex-col items-center justify-center py-1 rounded-lg transition-colors ${
              pathname === '/' ? 'text-[#C9A227] font-semibold' : 'text-[#888888] hover:text-white'
            }`}
          >
            <svg className="w-5 h-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-[9px] font-medium tracking-tight">Home</span>
          </Link>

          <Link
            href="/projects"
            className={`flex flex-col items-center justify-center py-1 rounded-lg transition-colors ${
              pathname.startsWith('/projects') ? 'text-[#C9A227] font-semibold' : 'text-[#888888] hover:text-white'
            }`}
          >
            <svg className="w-5 h-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4m-4 0H7" />
            </svg>
            <span className="text-[9px] font-medium tracking-tight">Projects</span>
          </Link>

          <Link
            href="/companies"
            className={`flex flex-col items-center justify-center py-1 rounded-lg transition-colors ${
              pathname.startsWith('/companies') ? 'text-[#C9A227] font-semibold' : 'text-[#888888] hover:text-white'
            }`}
          >
            <svg className="w-5 h-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13200 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-[9px] font-medium tracking-tight">Companies</span>
          </Link>

          <Link
            href="/search"
            className={`flex flex-col items-center justify-center py-1 rounded-lg transition-colors ${
              pathname === '/search' ? 'text-[#C9A227] font-semibold' : 'text-[#888888] hover:text-white'
            }`}
          >
            <svg className="w-5 h-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-[9px] font-medium tracking-tight">Search</span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center py-1 rounded-lg text-[#888888] hover:text-white transition-colors"
          >
            <svg className="w-5 h-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="text-[9px] font-medium tracking-tight">More</span>
          </button>
        </div>
      </div>
    </>
  );
}
