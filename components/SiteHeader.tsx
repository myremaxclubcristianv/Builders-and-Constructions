'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
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
    setActiveDropdown(null);
  }, [pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard accessibility: Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleDropdown = (menu: string) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  return (
    <>
      {/* Top Header Bar */}
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 pt-[env(safe-area-inset-top)] ${
          scrolled
            ? 'bg-[#050505]/95 backdrop-blur-md border-b border-[#1A1D1B] py-3'
            : 'bg-gradient-to-b from-[#050505]/90 via-[#050505]/60 to-transparent py-4'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex flex-col group shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-lg md:text-xl text-white group-hover:text-[#C9A227] transition-colors">
                CONSTRUCTIONS
              </span>
            </div>
            <span className="text-[10px] font-mono tracking-wider text-[#A0A0A0] uppercase">
              by AiXLuxury
            </span>
          </Link>

          {/* Desktop Mega Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-xs tracking-wider uppercase font-medium text-[#C5C5C5]">
            {/* DISCOVER DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('discover')}
                aria-expanded={activeDropdown === 'discover'}
                aria-haspopup="true"
                className={`flex items-center gap-1 hover:text-[#C9A227] transition-colors cursor-pointer py-1 ${
                  pathname.startsWith('/developers') ||
                  pathname.startsWith('/projects') ||
                  pathname.startsWith('/contractors') ||
                  pathname.startsWith('/architects') ||
                  pathname.startsWith('/engineers') ||
                  pathname.startsWith('/agencies') ||
                  pathname.startsWith('/cities') ||
                  pathname.startsWith('/companies')
                    ? 'text-[#C9A227] font-bold border-b border-[#C9A227] pb-0.5'
                    : ''
                }`}
              >
                <span>DISCOVER</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === 'discover' ? 'rotate-180 text-[#C9A227]' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeDropdown === 'discover' && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl shadow-2xl p-4 space-y-2 animate-fadeIn z-50">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block mb-2">
                    MARKET ENTITIES & PROJECTS
                  </span>
                  <div className="space-y-1 text-xs">
                    <Link
                      href="/developers"
                      className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors flex items-center justify-between"
                    >
                      <span>Real Estate Developers</span>
                      <span className="text-[10px] font-mono text-[#888888]">38</span>
                    </Link>
                    <Link
                      href="/projects"
                      className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors flex items-center justify-between"
                    >
                      <span>Construction Projects</span>
                      <span className="text-[10px] font-mono text-[#888888]">53</span>
                    </Link>
                    <Link
                      href="/contractors"
                      className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors flex items-center justify-between"
                    >
                      <span>Contractors & Builders</span>
                      <span className="text-[10px] font-mono text-[#888888]">26</span>
                    </Link>
                    <Link
                      href="/architects"
                      className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors flex items-center justify-between"
                    >
                      <span>Architects & Planners</span>
                      <span className="text-[10px] font-mono text-[#888888]">15</span>
                    </Link>
                    <Link
                      href="/engineers"
                      className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors flex items-center justify-between"
                    >
                      <span>Engineering Consultants</span>
                      <span className="text-[10px] font-mono text-[#888888]">15</span>
                    </Link>
                    <Link
                      href="/agencies"
                      className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors flex items-center justify-between"
                    >
                      <span>Real Estate Agencies</span>
                      <span className="text-[10px] font-mono text-[#888888]">15</span>
                    </Link>
                    <Link
                      href="/cities"
                      className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors flex items-center justify-between"
                    >
                      <span>Geographic Locations</span>
                      <span className="text-[10px] font-mono text-[#888888]">36</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* INTELLIGENCE DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('intelligence')}
                aria-expanded={activeDropdown === 'intelligence'}
                aria-haspopup="true"
                className={`flex items-center gap-1 hover:text-[#C9A227] transition-colors cursor-pointer py-1 ${
                  pathname === '/search' ||
                  pathname === '/decisions' ||
                  pathname === '/opportunities' ||
                  pathname === '/alerts' ||
                  pathname === '/network' ||
                  pathname === '/coverage' ||
                  pathname === '/rankings' ||
                  pathname === '/compare'
                    ? 'text-[#C9A227] font-bold border-b border-[#C9A227] pb-0.5'
                    : ''
                }`}
              >
                <span>INTELLIGENCE</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === 'intelligence' ? 'rotate-180 text-[#C9A227]' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeDropdown === 'intelligence' && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl shadow-2xl p-4 space-y-2 animate-fadeIn z-50">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block mb-2">
                    ANALYTICAL TERMINALS
                  </span>
                  <div className="space-y-1 text-xs">
                    <Link
                      href="/search"
                      className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors"
                    >
                      Institutional Search
                    </Link>
                    <Link
                      href="/rankings"
                      className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors"
                    >
                      Market Leaders & Rankings
                    </Link>
                    <Link
                      href="/compare"
                      className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors"
                    >
                      Entity Comparison
                    </Link>
                    <Link
                      href="/network"
                      className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors"
                    >
                      Discovery Network Graph
                    </Link>
                    <Link
                      href="/coverage"
                      className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors"
                    >
                      Coverage Matrix
                    </Link>
                    <Link
                      href="/alerts"
                      className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors"
                    >
                      Market Signals & Alerts
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* RESEARCH DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('research')}
                aria-expanded={activeDropdown === 'research'}
                aria-haspopup="true"
                className={`flex items-center gap-1 hover:text-[#C9A227] transition-colors cursor-pointer py-1 ${
                  pathname === '/research-request' ||
                  pathname === '/methodology' ||
                  pathname === '/report-error'
                    ? 'text-[#C9A227] font-bold border-b border-[#C9A227] pb-0.5'
                    : ''
                }`}
              >
                <span>RESEARCH</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === 'research' ? 'rotate-180 text-[#C9A227]' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeDropdown === 'research' && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl shadow-2xl p-4 space-y-2 animate-fadeIn z-50">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block mb-2">
                    RESEARCH SERVICES
                  </span>
                  <div className="space-y-1 text-xs">
                    <Link
                      href="/research-request"
                      className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors"
                    >
                      Research Request Desk
                    </Link>
                    <Link
                      href="/methodology"
                      className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors"
                    >
                      Provenance Methodology
                    </Link>
                    <Link
                      href="/report-error"
                      className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors"
                    >
                      Request Profile Correction
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* MEDIA */}
            <Link
              href="/video"
              className={`hover:text-[#C9A227] transition-colors py-1 ${
                pathname === '/video' ? 'text-[#C9A227] font-bold border-b border-[#C9A227] pb-0.5' : ''
              }`}
            >
              MEDIA
            </Link>

            {/* ABOUT */}
            <Link
              href="/work-with-us"
              className={`hover:text-[#C9A227] transition-colors py-1 ${
                pathname === '/work-with-us' ? 'text-[#C9A227] font-bold border-b border-[#C9A227] pb-0.5' : ''
              }`}
            >
              ABOUT
            </Link>
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/search"
              aria-label="Search Database"
              className="p-2 text-[#888888] hover:text-[#C9A227] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
            <Link
              href="/research-request"
              className="px-4 py-2 border border-[#C9A227]/50 text-[#C9A227] hover:bg-[#C9A227] hover:text-[#050505] transition-all rounded-lg text-xs font-mono font-bold tracking-wider uppercase active:scale-95"
            >
              REQUEST RESEARCH
            </Link>
          </div>

          {/* Mobile Right Actions */}
          <div className="flex lg:hidden items-center gap-3">
            <Link
              href="/search"
              aria-label="Search"
              className="w-11 h-11 flex items-center justify-center rounded-lg bg-[#111111] border border-[#1A1D1B] text-[#C9A227] active:scale-95 transition-transform"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation drawer"
              className="w-11 h-11 flex items-center justify-center rounded-lg bg-[#111111] border border-[#1A1D1B] text-white active:scale-95 transition-transform"
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
        <div className="fixed inset-0 z-50 bg-[#050505] flex flex-col justify-between p-6 pt-[calc(1.5rem+env(safe-area-inset-top))] overflow-y-auto animate-fadeIn">
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
              {/* DISCOVER SECTION */}
              <div>
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] mb-3">
                  DISCOVER MARKET TAXONOMY
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/developers"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white hover:border-[#C9A227]/50 active:bg-[#111111] flex items-center justify-between min-h-[44px]"
                  >
                    <span>Developers</span>
                    <span className="text-[10px] font-mono text-[#C9A227]">38</span>
                  </Link>
                  <Link
                    href="/projects"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white hover:border-[#C9A227]/50 active:bg-[#111111] flex items-center justify-between min-h-[44px]"
                  >
                    <span>Projects</span>
                    <span className="text-[10px] font-mono text-[#C9A227]">53</span>
                  </Link>
                  <Link
                    href="/contractors"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white hover:border-[#C9A227]/50 active:bg-[#111111] flex items-center justify-between min-h-[44px]"
                  >
                    <span>Contractors</span>
                    <span className="text-[10px] font-mono text-[#C9A227]">26</span>
                  </Link>
                  <Link
                    href="/architects"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white hover:border-[#C9A227]/50 active:bg-[#111111] flex items-center justify-between min-h-[44px]"
                  >
                    <span>Architects</span>
                    <span className="text-[10px] font-mono text-[#C9A227]">15</span>
                  </Link>
                  <Link
                    href="/engineers"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white hover:border-[#C9A227]/50 active:bg-[#111111] flex items-center justify-between min-h-[44px]"
                  >
                    <span>Engineers</span>
                    <span className="text-[10px] font-mono text-[#C9A227]">15</span>
                  </Link>
                  <Link
                    href="/agencies"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white hover:border-[#C9A227]/50 active:bg-[#111111] flex items-center justify-between min-h-[44px]"
                  >
                    <span>Agencies</span>
                    <span className="text-[10px] font-mono text-[#C9A227]">15</span>
                  </Link>
                </div>
              </div>

              {/* INTELLIGENCE SECTION */}
              <div>
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] mb-3">
                  INTELLIGENCE & RESEARCH
                </h4>
                <div className="space-y-2">
                  <Link
                    href="/search"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white hover:border-[#C9A227]/50 active:bg-[#111111] flex items-center justify-between min-h-[44px]"
                  >
                    <span>Institutional Search Terminal</span>
                    <span className="text-xs text-[#C9A227]">→</span>
                  </Link>
                  <Link
                    href="/network"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white hover:border-[#C9A227]/50 active:bg-[#111111] flex items-center justify-between min-h-[44px]"
                  >
                    <span>Discovery Network Graph</span>
                    <span className="text-xs text-[#C9A227]">→</span>
                  </Link>
                  <Link
                    href="/video"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white hover:border-[#C9A227]/50 active:bg-[#111111] flex items-center justify-between min-h-[44px]"
                  >
                    <span>Video Desk & Shorts</span>
                    <span className="text-xs text-[#C9A227]">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1A1D1B] space-y-3 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
            <Link
              href="/research-request"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-3 text-center bg-[#C9A227] text-[#050505] font-semibold font-mono text-xs uppercase tracking-wider rounded-xl active:scale-98 transition-transform min-h-[44px] flex items-center justify-center"
            >
              REQUEST RESEARCH
            </Link>
            <p className="text-[10px] font-mono text-[#888888] text-center">
              Independent construction & real estate market intelligence · Documented Public Records
            </p>
          </div>
        </div>
      )}

      {/* Persistent Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0B0B]/95 backdrop-blur-lg border-t border-[#1C1F1D] px-2 py-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))]">
        <div className="grid grid-cols-5 gap-1 text-center">
          <Link
            href="/"
            className={`flex flex-col items-center justify-center py-1.5 rounded-lg transition-colors min-h-[48px] ${
              pathname === '/' ? 'text-[#C9A227] font-semibold' : 'text-[#888888] hover:text-white'
            }`}
          >
            <svg className="w-5 h-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-[9px] font-medium tracking-tight">Home</span>
          </Link>

          <Link
            href="/developers"
            className={`flex flex-col items-center justify-center py-1.5 rounded-lg transition-colors min-h-[48px] ${
              pathname.startsWith('/developers') ? 'text-[#C9A227] font-semibold' : 'text-[#888888] hover:text-white'
            }`}
          >
            <svg className="w-5 h-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4m-4 0H7" />
            </svg>
            <span className="text-[9px] font-medium tracking-tight">Devs</span>
          </Link>

          <Link
            href="/projects"
            className={`flex flex-col items-center justify-center py-1.5 rounded-lg transition-colors min-h-[48px] ${
              pathname.startsWith('/projects') ? 'text-[#C9A227] font-semibold' : 'text-[#888888] hover:text-white'
            }`}
          >
            <svg className="w-5 h-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4m-4 0H7" />
            </svg>
            <span className="text-[9px] font-medium tracking-tight">Projects</span>
          </Link>

          <Link
            href="/search"
            className={`flex flex-col items-center justify-center py-1.5 rounded-lg transition-colors min-h-[48px] ${
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
            className="flex flex-col items-center justify-center py-1.5 rounded-lg text-[#888888] hover:text-white transition-colors min-h-[48px]"
          >
            <svg className="w-5 h-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="text-[9px] font-medium tracking-tight">Menu</span>
          </button>
        </div>
      </div>
    </>
  );
}
