'use client';

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileMenuOpen]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard accessibility: Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveDropdown(null);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (menu: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

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
            ? "bg-[#050505]/95 backdrop-blur-md border-b border-[#1A1D1B] py-3"
            : "bg-gradient-to-b from-[#050505]/90 via-[#050505]/60 to-transparent py-4"
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
            <div
              className="relative py-2"
              onMouseEnter={() => handleMouseEnter("discover")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => toggleDropdown("discover")}
                aria-expanded={activeDropdown === "discover"}
                aria-haspopup="true"
                className={`flex items-center gap-1 hover:text-[#C9A227] transition-colors cursor-pointer py-1 ${
                  pathname.startsWith("/developers") ||
                  pathname.startsWith("/projects") ||
                  pathname.startsWith("/contractors") ||
                  pathname.startsWith("/architects") ||
                  pathname.startsWith("/engineers") ||
                  pathname.startsWith("/agencies") ||
                  pathname.startsWith("/cities") ||
                  pathname.startsWith("/companies")
                    ? "text-[#C9A227] font-bold border-b border-[#C9A227] pb-0.5"
                    : ""
                }`}
              >
                <span>DISCOVER</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === "discover" ? "rotate-180 text-[#C9A227]" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeDropdown === "discover" && (
                <div
                  className="absolute left-0 top-full pt-1 w-72 z-50"
                  onMouseEnter={() => handleMouseEnter("discover")}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl shadow-2xl p-4 space-y-2 animate-fadeIn">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block mb-2">
                      MARKET ENTITIES & PROJECTS
                    </span>
                    <div className="space-y-1 text-xs">
                      <Link
                        href="/developers"
                        className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors flex items-center justify-between"
                      >
                        <span>Real Estate Developers</span>
                        <span className="text-[10px] font-mono text-[#888888]">50</span>
                      </Link>
                      <Link
                        href="/projects"
                        className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors flex items-center justify-between"
                      >
                        <span>Construction Projects</span>
                        <span className="text-[10px] font-mono text-[#888888]">76</span>
                      </Link>
                      <Link
                        href="/contractors"
                        className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors flex items-center justify-between"
                      >
                        <span>Contractors & Builders</span>
                        <span className="text-[10px] font-mono text-[#888888]">30</span>
                      </Link>
                      <Link
                        href="/architects"
                        className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors flex items-center justify-between"
                      >
                        <span>Architects & Planners</span>
                        <span className="text-[10px] font-mono text-[#888888]">21</span>
                      </Link>
                      <Link
                        href="/engineers"
                        className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors flex items-center justify-between"
                      >
                        <span>Engineering Consultants</span>
                        <span className="text-[10px] font-mono text-[#888888]">25</span>
                      </Link>
                      <Link
                        href="/agencies"
                        className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors flex items-center justify-between"
                      >
                        <span>Real Estate Agencies</span>
                        <span className="text-[10px] font-mono text-[#888888]">20</span>
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
                </div>
              )}
            </div>

            {/* KNOWLEDGE DROPDOWN (NEW) */}
            <div
              className="relative py-2"
              onMouseEnter={() => handleMouseEnter("knowledge")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => toggleDropdown("knowledge")}
                aria-expanded={activeDropdown === "knowledge"}
                aria-haspopup="true"
                className={`flex items-center gap-1 hover:text-[#C9A227] transition-colors cursor-pointer py-1 ${
                  pathname.startsWith("/knowledge")
                    ? "text-[#C9A227] font-bold border-b border-[#C9A227] pb-0.5"
                    : ""
                }`}
              >
                <span>KNOWLEDGE</span>
                <span className="px-1.5 py-0.2 text-[9px] bg-[#C9A227]/20 text-[#C9A227] rounded font-mono font-bold">
                  NEW
                </span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === "knowledge" ? "rotate-180 text-[#C9A227]" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeDropdown === "knowledge" && (
                <div
                  className="absolute left-0 top-full pt-1 w-80 z-50"
                  onMouseEnter={() => handleMouseEnter("knowledge")}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl shadow-2xl p-4 space-y-2 animate-fadeIn">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block mb-2">
                      TECHNICAL KNOWLEDGE & MATERIALS
                    </span>
                    <div className="space-y-1 text-xs">
                      <Link
                        href="/knowledge"
                        className="block p-2 hover:bg-[#151515] rounded text-white hover:text-[#C9A227] transition-colors font-bold flex items-center justify-between"
                      >
                        <span>Knowledge Hub Overview</span>
                        <span className="text-[10px] font-mono text-[#C9A227]">INDEX</span>
                      </Link>
                      <Link
                        href="/knowledge/materials"
                        className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors flex items-center justify-between"
                      >
                        <span>Materials & Products Catalog</span>
                        <span className="text-[10px] font-mono text-[#888888]">12 FAMILIES</span>
                      </Link>
                      <Link
                        href="/knowledge/concrete"
                        className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors flex items-center justify-between"
                      >
                        <span>Concrete & Cement Intelligence</span>
                        <span className="text-[10px] font-mono text-[#10B981]">SR EN 206</span>
                      </Link>
                      <Link
                        href="/knowledge/systems"
                        className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors flex items-center justify-between"
                      >
                        <span>Structural Systems & P100-1</span>
                        <span className="text-[10px] font-mono text-[#888888]">SEISMIC</span>
                      </Link>
                      <Link
                        href="/knowledge/infrastructure"
                        className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors flex items-center justify-between"
                      >
                        <span>Civil Infrastructure & Roads</span>
                        <span className="text-[10px] font-mono text-[#888888]">HIGHWAYS</span>
                      </Link>
                      <Link
                        href="/knowledge/engineering"
                        className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors flex items-center justify-between"
                      >
                        <span>Building Physics & Fire</span>
                        <span className="text-[10px] font-mono text-[#888888]">PHYSICS</span>
                      </Link>
                      <Link
                        href="/knowledge/processes"
                        className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors flex items-center justify-between"
                      >
                        <span>15-Stage Execution Guide</span>
                        <span className="text-[10px] font-mono text-[#888888]">PVLA</span>
                      </Link>
                      <Link
                        href="/knowledge/standards"
                        className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors flex items-center justify-between"
                      >
                        <span>Eurocodes & CPR 2024</span>
                        <span className="text-[10px] font-mono text-[#888888]">REGISTRY</span>
                      </Link>
                      <Link
                        href="/knowledge/glossary"
                        className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors flex items-center justify-between"
                      >
                        <span>Technical Glossary (POT, CUT)</span>
                        <span className="text-[10px] font-mono text-[#888888]">TERMS</span>
                      </Link>
                      <Link
                        href="/knowledge/compare"
                        className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors flex items-center justify-between border-t border-[#1A1D1B] pt-2"
                      >
                        <span>Material Comparison Matrix</span>
                        <span className="text-[10px] font-mono text-[#C9A227]">MATRIX</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* INTELLIGENCE DROPDOWN */}
            <div
              className="relative py-2"
              onMouseEnter={() => handleMouseEnter("intelligence")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => toggleDropdown("intelligence")}
                aria-expanded={activeDropdown === "intelligence"}
                aria-haspopup="true"
                className={`flex items-center gap-1 hover:text-[#C9A227] transition-colors cursor-pointer py-1 ${
                  pathname.startsWith("/intelligence") ||
                  pathname.startsWith("/signals") ||
                  pathname.startsWith("/changes") ||
                  pathname.startsWith("/compare") ||
                  pathname.startsWith("/network") ||
                  pathname.startsWith("/coverage") ||
                  pathname.startsWith("/watchlist")
                    ? "text-[#C9A227] font-bold border-b border-[#C9A227] pb-0.5"
                    : ""
                }`}
              >
                <span>INTELLIGENCE</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === "intelligence" ? "rotate-180 text-[#C9A227]" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeDropdown === "intelligence" && (
                <div
                  className="absolute left-0 top-full pt-1 w-72 z-50"
                  onMouseEnter={() => handleMouseEnter("intelligence")}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl shadow-2xl p-4 space-y-2 animate-fadeIn">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block mb-2">
                      MARKET RADAR & ANALYTICS
                    </span>
                    <div className="space-y-1 text-xs">
                      <Link
                        href="/intelligence"
                        className="block p-2 hover:bg-[#151515] rounded text-white hover:text-[#C9A227] transition-colors font-bold"
                      >
                        Market Intelligence Desk
                      </Link>
                      <Link
                        href="/signals"
                        className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors"
                      >
                        Live Construction Signals
                      </Link>
                      <Link
                        href="/changes"
                        className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors"
                      >
                        Recent Documented Changes
                      </Link>
                      <Link
                        href="/search"
                        className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors"
                      >
                        Institutional Search
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
                        href="/watchlist"
                        className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors"
                      >
                        Market Watchlist & Monitoring
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* RESEARCH DROPDOWN */}
            <div
              className="relative py-2"
              onMouseEnter={() => handleMouseEnter("research")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => toggleDropdown("research")}
                aria-expanded={activeDropdown === "research"}
                aria-haspopup="true"
                className={`flex items-center gap-1 hover:text-[#C9A227] transition-colors cursor-pointer py-1 ${
                  pathname === "/research-request" ||
                  pathname === "/methodology" ||
                  pathname === "/report-error"
                    ? "text-[#C9A227] font-bold border-b border-[#C9A227] pb-0.5"
                    : ""
                }`}
              >
                <span>RESEARCH</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === "research" ? "rotate-180 text-[#C9A227]" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeDropdown === "research" && (
                <div
                  className="absolute left-0 top-full pt-1 w-72 z-50"
                  onMouseEnter={() => handleMouseEnter("research")}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl shadow-2xl p-4 space-y-2 animate-fadeIn">
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
                </div>
              )}
            </div>

            {/* MEDIA */}
            <Link
              href="/video"
              className={`hover:text-[#C9A227] transition-colors py-1 ${
                pathname === "/video" ? "text-[#C9A227] font-bold border-b border-[#C9A227] pb-0.5" : ""
              }`}
            >
              MEDIA
            </Link>

            {/* ABOUT DROPDOWN */}
            <div
              className="relative py-2"
              onMouseEnter={() => handleMouseEnter("about")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => toggleDropdown("about")}
                aria-expanded={activeDropdown === "about"}
                aria-haspopup="true"
                className={`flex items-center gap-1 hover:text-[#C9A227] transition-colors cursor-pointer py-1 ${
                  pathname === "/about/cristian-vaduva" ||
                  pathname === "/about/aixluxury" ||
                  pathname === "/work-with-us"
                    ? "text-[#C9A227] font-bold border-b border-[#C9A227] pb-0.5"
                    : ""
                }`}
              >
                <span>ABOUT</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeDropdown === "about" ? "rotate-180 text-[#C9A227]" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeDropdown === "about" && (
                <div
                  className="absolute left-0 top-full pt-1 w-72 z-50"
                  onMouseEnter={() => handleMouseEnter("about")}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl shadow-2xl p-4 space-y-2 animate-fadeIn">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block mb-2">
                      INSTITUTIONAL PROFILES
                    </span>
                    <div className="space-y-1 text-xs">
                      <Link
                        href="/about/cristian-vaduva"
                        className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors font-bold"
                      >
                        Cristian Văduva
                      </Link>
                      <Link
                        href="/about/aixluxury"
                        className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors font-bold"
                      >
                        AiXLuxury Platform
                      </Link>
                      <Link
                        href="/work-with-us"
                        className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors border-t border-[#1A1D1B] pt-2 mt-1"
                      >
                        Work With Us
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Action CTAs: Search & Watchlist */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/search"
              aria-label="Search"
              className="p-2 text-[#888888] hover:text-[#C9A227] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>

            <Link
              href="/watchlist"
              className="px-3 py-1.5 bg-[#111111] hover:bg-[#1A1A1A] border border-[#1A1D1B] hover:border-[#C9A227]/40 text-[#C5C5C5] hover:text-[#C9A227] text-xs font-mono rounded-lg transition-all flex items-center gap-1.5"
            >
              <span>★</span>
              <span>WATCHLIST</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button (≥44px target) */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/search"
              aria-label="Search"
              className="w-11 h-11 flex items-center justify-center text-[#C5C5C5] active:text-[#C9A227] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              className="w-11 h-11 flex items-center justify-center rounded-lg bg-[#111111] border border-[#1A1D1B] text-[#C9A227] active:scale-95 transition-transform"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer (100% Mobile Parity with all sections) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-fadeIn"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-[340px] sm:max-w-[380px] bg-[#070807] border-r border-[#1A1D1B] h-full flex flex-col z-10 overflow-y-auto animate-slideRight">
            {/* Header in Drawer */}
            <div className="p-4 border-b border-[#1A1D1B] flex items-center justify-between sticky top-0 bg-[#070807]/95 backdrop-blur z-20">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex flex-col">
                <span className="font-extrabold text-base text-white">CONSTRUCTIONS</span>
                <span className="text-[9px] font-mono text-[#C9A227]">by AiXLuxury</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-11 h-11 flex items-center justify-center rounded-lg bg-[#111111] border border-[#1A1D1B] text-[#C9A227] active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Navigation List */}
            <div className="p-4 space-y-6 pb-28">
              {/* 1. CONSTRUCTION KNOWLEDGE BASE (NEW) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227]">
                    CONSTRUCTION KNOWLEDGE BASE
                  </h4>
                  <span className="text-[9px] font-mono bg-[#C9A227]/20 text-[#C9A227] px-1.5 py-0.5 rounded">
                    EXPANDED
                  </span>
                </div>
                <div className="space-y-1.5">
                  <Link
                    href="/knowledge"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0E0F0E] border border-[#C9A227]/40 rounded-xl text-xs font-bold text-[#C9A227] flex items-center justify-between min-h-[44px]"
                  >
                    <span>Knowledge Hub Main</span>
                    <span>→</span>
                  </Link>
                  <Link
                    href="/knowledge/materials"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Materials Catalog (12 Families)</span>
                    <span className="text-[10px] font-mono text-[#888888]">SPECS</span>
                  </Link>
                  <Link
                    href="/knowledge/concrete"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Concrete & Cement Intelligence</span>
                    <span className="text-[10px] font-mono text-[#10B981]">SR EN 206</span>
                  </Link>
                  <Link
                    href="/knowledge/systems"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Structural Systems & P100-1</span>
                    <span className="text-[10px] font-mono text-[#888888]">SEISMIC</span>
                  </Link>
                  <Link
                    href="/knowledge/infrastructure"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Civil Infrastructure & Roads</span>
                    <span className="text-[10px] font-mono text-[#888888]">HIGHWAYS</span>
                  </Link>
                  <Link
                    href="/knowledge/engineering"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Building Physics & Fire Safety</span>
                    <span className="text-[10px] font-mono text-[#888888]">PHYSICS</span>
                  </Link>
                  <Link
                    href="/knowledge/processes"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>15-Stage Execution Lifecycle</span>
                    <span className="text-[10px] font-mono text-[#888888]">PVLA</span>
                  </Link>
                  <Link
                    href="/knowledge/standards"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Eurocodes (EN 1990-1999) & CPR</span>
                    <span className="text-[10px] font-mono text-[#888888]">NORMS</span>
                  </Link>
                  <Link
                    href="/knowledge/glossary"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Glossary (POT, CUT, U-value)</span>
                    <span className="text-[10px] font-mono text-[#888888]">TERMS</span>
                  </Link>
                  <Link
                    href="/knowledge/compare"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Material Comparison Matrix</span>
                    <span className="text-[10px] font-mono text-[#C9A227]">MATRIX</span>
                  </Link>
                </div>
              </div>

              {/* 2. DISCOVER SECTION */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227]">
                  DISCOVER MARKET TAXONOMY
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/developers"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Developers</span>
                    <span className="text-[10px] font-mono text-[#C9A227]">50</span>
                  </Link>
                  <Link
                    href="/projects"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Projects</span>
                    <span className="text-[10px] font-mono text-[#C9A227]">76</span>
                  </Link>
                  <Link
                    href="/contractors"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Contractors</span>
                    <span className="text-[10px] font-mono text-[#C9A227]">30</span>
                  </Link>
                  <Link
                    href="/architects"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Architects</span>
                    <span className="text-[10px] font-mono text-[#C9A227]">21</span>
                  </Link>
                  <Link
                    href="/engineers"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Engineers</span>
                    <span className="text-[10px] font-mono text-[#C9A227]">25</span>
                  </Link>
                  <Link
                    href="/agencies"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Agencies</span>
                    <span className="text-[10px] font-mono text-[#C9A227]">20</span>
                  </Link>
                </div>
                <Link
                  href="/cities"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px] block"
                >
                  <span>Geographic Locations & Cities</span>
                  <span className="text-[10px] font-mono text-[#C9A227]">36 REGIONS</span>
                </Link>
              </div>

              {/* 3. INTELLIGENCE SECTION */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227]">
                  INTELLIGENCE & RESEARCH
                </h4>
                <div className="space-y-1.5">
                  <Link
                    href="/intelligence"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Market Intelligence Command Center</span>
                    <span className="text-xs text-[#C9A227]">→</span>
                  </Link>
                  <Link
                    href="/signals"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Live Signals Radar</span>
                    <span className="text-xs text-[#C9A227]">→</span>
                  </Link>
                  <Link
                    href="/changes"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Documented Market Changes</span>
                    <span className="text-xs text-[#C9A227]">→</span>
                  </Link>
                  <Link
                    href="/compare"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Entity Comparison Workstation</span>
                    <span className="text-xs text-[#C9A227]">→</span>
                  </Link>
                  <Link
                    href="/watchlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-[#C9A227] flex items-center justify-between min-h-[44px]"
                  >
                    <span>★ My Watchlist</span>
                    <span className="text-xs text-[#C9A227]">→</span>
                  </Link>
                </div>
              </div>

              {/* 4. RESEARCH & PROFILES */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227]">
                  RESEARCH & INSTITUTIONAL
                </h4>
                <div className="space-y-1.5">
                  <Link
                    href="/research-request"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Research Request Desk</span>
                    <span className="text-xs text-[#C9A227]">→</span>
                  </Link>
                  <Link
                    href="/about/cristian-vaduva"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>About Cristian Văduva</span>
                    <span className="text-xs text-[#C9A227]">→</span>
                  </Link>
                  <Link
                    href="/about/aixluxury"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>About AiXLuxury</span>
                    <span className="text-xs text-[#C9A227]">→</span>
                  </Link>
                  <Link
                    href="/work-with-us"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Work With Us</span>
                    <span className="text-xs text-[#C9A227]">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Fixed 5-Button Bottom Nav Bar (≥48px touch targets, safe area bottom) */}
      <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-[#070807]/95 backdrop-blur-lg border-t border-[#1A1D1B] px-3 py-1 pb-[calc(0.25rem+env(safe-area-inset-bottom))]">
        <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
          <Link
            href="/"
            className={`flex flex-col items-center justify-center py-1.5 rounded-lg transition-colors min-h-[48px] ${
              pathname === "/" ? "text-[#C9A227] font-semibold" : "text-[#888888] active:text-white"
            }`}
          >
            <svg className="w-5 h-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-[9px] font-medium tracking-tight">Home</span>
          </Link>

          <Link
            href="/projects"
            className={`flex flex-col items-center justify-center py-1.5 rounded-lg transition-colors min-h-[48px] ${
              pathname.startsWith("/projects") ? "text-[#C9A227] font-semibold" : "text-[#888888] active:text-white"
            }`}
          >
            <svg className="w-5 h-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4m-4 0H7" />
            </svg>
            <span className="text-[9px] font-medium tracking-tight">Projects</span>
          </Link>

          <Link
            href="/knowledge"
            className={`flex flex-col items-center justify-center py-1.5 rounded-lg transition-colors min-h-[48px] ${
              pathname.startsWith("/knowledge") ? "text-[#C9A227] font-semibold" : "text-[#888888] active:text-white"
            }`}
          >
            <svg className="w-5 h-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-[9px] font-medium tracking-tight">Knowledge</span>
          </Link>

          <Link
            href="/search"
            className={`flex flex-col items-center justify-center py-1.5 rounded-lg transition-colors min-h-[48px] ${
              pathname === "/search" ? "text-[#C9A227] font-semibold" : "text-[#888888] active:text-white"
            }`}
          >
            <svg className="w-5 h-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-[9px] font-medium tracking-tight">Search</span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            className="flex flex-col items-center justify-center py-1.5 rounded-lg text-[#888888] active:text-white transition-colors min-h-[48px]"
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
