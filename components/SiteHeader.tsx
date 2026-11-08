'use client';

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/language-context";
import { LiveRollingTicker } from "@/components/LiveRollingTicker";
import { QuickContactModal } from "@/components/QuickContactModal";
import { AlwaysOnFloatingContact } from "@/components/AlwaysOnFloatingContact";
import {
  ShieldIcon,
  SearchIcon,
  BriefcaseIcon,
  BookIcon,
  HardHatIcon,
  RulerIcon,
  LandmarkIcon,
  MegaphoneIcon,
  TruckIcon,
  DocumentCheckIcon,
  CreditCardIcon,
  BuildingIcon,
  TargetIcon,
  StarIcon
} from "@/components/icons/NavIcons";

export function SiteHeader() {
  const { language, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const pathname = usePathname();
  const headerRef = useRef<HTMLDivElement>(null);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 15) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // At top of page, always keep header visible
      if (currentScrollY < 30) {
        setVisible(true);
        lastScrollYRef.current = currentScrollY;
        return;
      }

      // Do not auto-hide when mobile drawer is open or dropdown is active
      if (mobileMenuOpen || activeDropdown !== null) {
        setVisible(true);
        lastScrollYRef.current = currentScrollY;
        return;
      }

      const diff = currentScrollY - lastScrollYRef.current;
      // Filter out micro-scroll fluctuations to eliminate flicker
      if (Math.abs(diff) < 8) return;

      if (diff > 0 && currentScrollY > 80) {
        // Scrolling down -> hide header
        setVisible(false);
      } else if (diff < 0) {
        // Scrolling up -> reveal header
        setVisible(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileMenuOpen, activeDropdown]);

  // Ensure keyboard accessibility: keep header visible when focus moves into it
  useEffect(() => {
    const handleFocusIn = () => {
      if (headerRef.current && headerRef.current.contains(document.activeElement)) {
        setVisible(true);
      }
    };
    document.addEventListener("focusin", handleFocusIn);
    return () => document.removeEventListener("focusin", handleFocusIn);
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
        className={`fixed top-0 left-0 right-0 z-40 w-full transition-transform duration-300 ease-out pt-[env(safe-area-inset-top)] ${
          visible ? "translate-y-0" : "-translate-y-full"
        } ${
          scrolled
            ? "bg-[#050505]/95 backdrop-blur-md border-b border-[#1A1D1B] py-2"
            : "bg-gradient-to-b from-[#050505]/95 via-[#050505]/85 to-transparent py-2.5 sm:py-3"
        }`}
      >
        <LiveRollingTicker />
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-3 lg:gap-4">
          {/* Brand Logo & Identity */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0 select-none">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1E221F] via-[#141715] to-[#0A0C0B] border border-[#C9A227]/40 flex items-center justify-center shadow-sm group-hover:border-[#C9A227] transition-all shrink-0">
              <span className="text-[#C9A227] font-extrabold text-sm tracking-wider font-mono">C</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-extrabold tracking-tight text-base sm:text-lg text-white group-hover:text-[#C9A227] transition-colors">
                  CONSTRUCTIONS
                </span>
              </div>
              <span className="text-[9px] font-mono tracking-widest text-[#A0A0A0] uppercase mt-0.5 group-hover:text-[#C9A227]/80 transition-colors">
                by AiXLuxury
              </span>
            </div>
          </Link>

          {/* Desktop Mega Navigation (>=1280px) */}
          <nav className="hidden xl:flex items-center gap-3.5 2xl:gap-5 text-[11px] 2xl:text-xs tracking-wider uppercase font-medium text-[#C5C5C5]">
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
                <span>CATALOG</span>
                <svg
                  className={`w-3 h-3 transition-transform duration-200 ${
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
                      ENTITĂȚI & PROIECTE DIN PIAȚĂ
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
                <span>NORMATIVE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] inline-block animate-pulse" title="Centru Actualizat Normative" />
                <svg
                  className={`w-3 h-3 transition-transform duration-200 ${
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
                      CUNOȘTINȚE TEHNICE & MATERIALE
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

            
            {/* SERVICES DROPDOWN (NEW) */}
            <div
              className="relative py-2"
              onMouseEnter={() => handleMouseEnter("services")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => toggleDropdown("services")}
                aria-expanded={activeDropdown === "services"}
                aria-haspopup="true"
                className={`flex items-center gap-1 hover:text-[#C9A227] transition-colors cursor-pointer py-1 ${
                  pathname.startsWith("/services") || pathname.startsWith("/contact")
                    ? "text-[#C9A227] font-bold border-b border-[#C9A227] pb-0.5"
                    : ""
                }`}
              >
                <span>SERVICES</span>
                <span className="text-[9px] font-mono text-[#C9A227] bg-[#C9A227]/15 px-1 py-0.2 rounded font-bold">
                  13
                </span>
                <svg
                  className={`w-3 h-3 transition-transform duration-200 ${
                    activeDropdown === "services" ? "rotate-180 text-[#C9A227]" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeDropdown === "services" && (
                <div
                  className="absolute left-0 top-full pt-1 w-96 z-50"
                  onMouseEnter={() => handleMouseEnter("services")}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl shadow-2xl p-4 space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between pb-2 border-b border-[#1A1D1B]">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] font-bold">
                        13 OFFICIAL DIVISIONS
                      </span>
                      <Link
                        href="/contact"
                        className="text-[10px] font-mono text-[#C9A227] hover:underline"
                      >
                        Inquiry Form →
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <Link
                        href="/services/calitate-constructii"
                        className="p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors flex items-center gap-1.5"
                      >
                        <ShieldIcon className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                        <span className="truncate">Calitate Construcții</span>
                      </Link>
                      <Link
                        href="/services/controlul-calitatii"
                        className="p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors flex items-center gap-1.5"
                      >
                        <SearchIcon className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                        <span className="truncate">Controlul Calității</span>
                      </Link>
                      <Link
                        href="/services/manager-calitate"
                        className="p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors flex items-center gap-1.5"
                      >
                        <BriefcaseIcon className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                        <span className="truncate">Manager Calitate</span>
                      </Link>
                      <Link
                        href="/services/cartea-tehnica"
                        className="p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors flex items-center gap-1.5"
                      >
                        <BookIcon className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                        <span className="truncate">Cartea Tehnică</span>
                      </Link>
                      <Link
                        href="/services/ssm"
                        className="p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors flex items-center gap-1.5"
                      >
                        <HardHatIcon className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                        <span className="truncate">Inspector SSM</span>
                      </Link>
                      <Link
                        href="/services/proiecte"
                        className="p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors flex items-center gap-1.5"
                      >
                        <RulerIcon className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                        <span className="truncate">Proiecte PT/DDE</span>
                      </Link>
                      <Link
                        href="/services/arhitecti"
                        className="p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors flex items-center gap-1.5"
                      >
                        <LandmarkIcon className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                        <span className="truncate">Arhitecți & PUZ</span>
                      </Link>
                      <Link
                        href="/services/publicitate"
                        className="p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors flex items-center gap-1.5"
                      >
                        <MegaphoneIcon className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                        <span className="truncate">Publicitate</span>
                      </Link>
                      <Link
                        href="/services/inchirieri-utilaje"
                        className="p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors flex items-center gap-1.5"
                      >
                        <TruckIcon className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                        <span className="truncate">Închirieri Utilaje</span>
                      </Link>
                      <Link
                        href="/services/asigurari"
                        className="p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors flex items-center gap-1.5"
                      >
                        <DocumentCheckIcon className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                        <span className="truncate">Intermediere Asigurări</span>
                      </Link>
                      <Link
                        href="/services/credite"
                        className="p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors flex items-center gap-1.5"
                      >
                        <CreditCardIcon className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                        <span className="truncate">Credite & Finanțare</span>
                      </Link>
                      <Link
                        href="/services/vanzari-real-estate"
                        className="p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors flex items-center gap-1.5"
                      >
                        <BuildingIcon className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
                        <span className="truncate">Vânzări Real Estate</span>
                      </Link>
                    </div>

                    <div className="pt-2 border-t border-[#1A1D1B] flex items-center justify-between">
                      <Link
                        href="/services/imobiliare"
                        className="text-xs text-[#C5C5C5] hover:text-[#C9A227] flex items-center gap-1"
                      >
                        <TargetIcon className="w-3.5 h-3.5 text-[#C9A227]" /> <span>Looking for property?</span>
                      </Link>
                      <Link
                        href="/services"
                        className="text-[11px] font-mono text-[#C9A227] font-bold hover:underline"
                      >
                        Catalog Servicii →
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
                <span>INTELIGENȚĂ</span>
                <svg
                  className={`w-3 h-3 transition-transform duration-200 ${
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
                      RADAR DE PIAȚĂ & ANALIZĂ
                    </span>
                    <div className="space-y-1 text-xs">
                      <Link
                        href="/intelligence"
                        className="block p-2 hover:bg-[#151515] rounded text-white hover:text-[#C9A227] transition-colors font-bold"
                      >
                        Birou Inteligență Piață
                      </Link>
                      <Link
                        href="/signals"
                        className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors"
                      >
                        Semnale Verificate din Piață
                      </Link>
                      <Link
                        href="/changes"
                        className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors"
                      >
                        Modificări Recente Documentate
                      </Link>
                      <Link
                        href="/search"
                        className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors"
                      >
                        Căutare Instituțională
                      </Link>
                      <Link
                        href="/compare"
                        className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors"
                      >
                        Comparare Entități
                      </Link>
                      <Link
                        href="/network"
                        className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors"
                      >
                        Grafic Relațional de Rețea
                      </Link>
                      <Link
                        href="/coverage"
                        className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors"
                      >
                        Matrice de Acoperire
                      </Link>
                      <Link
                        href="/watchlist"
                        className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors"
                      >
                        Monitorizare & Watchlist
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
                <span>CERCETARE</span>
                <svg
                  className={`w-3 h-3 transition-transform duration-200 ${
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
                      SERVICII DE CERCETARE
                    </span>
                    <div className="space-y-1 text-xs">
                      <Link
                        href="/research-request"
                        className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors"
                      >
                        Birou Solicitare Cercetare
                      </Link>
                      <Link
                        href="/methodology"
                        className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors"
                      >
                        Metodologia de Verificare
                      </Link>
                      <Link
                        href="/report-error"
                        className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors"
                      >
                        Raportează Eroare Profil
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
                <span>DESPRE</span>
                <svg
                  className={`w-3 h-3 transition-transform duration-200 ${
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
                  className="absolute right-0 top-full pt-1.5 w-72 z-50"
                  onMouseEnter={() => handleMouseEnter("about")}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl shadow-2xl p-4 space-y-2 animate-fadeIn">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block mb-2">
                      PROFILE INSTITUȚIONALE
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
                        Platforma AiXLuxury
                      </Link>
                      <Link
                        href="/work-with-us"
                        className="block p-2 hover:bg-[#151515] rounded text-[#C5C5C5] hover:text-[#C9A227] transition-colors border-t border-[#1A1D1B] pt-2 mt-1"
                      >
                        Parteneriate &amp; Colaborare
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Action CTAs (>=1280px) */}
          <div className="hidden xl:flex items-center gap-2 2xl:gap-2.5 shrink-0">
            {/* Search */}
            <Link
              href="/search"
              aria-label="Search"
              className="w-8 h-8 rounded-lg bg-[#111111] hover:bg-[#1A1A1A] border border-[#1A1D1B] hover:border-[#C9A227]/40 flex items-center justify-center text-[#888888] hover:text-[#C9A227] transition-all"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>

            {/* Watchlist */}
            <Link
              href="/watchlist"
              className="h-8 px-2.5 2xl:px-3 bg-[#111111] hover:bg-[#1A1A1A] border border-[#1A1D1B] hover:border-[#C9A227]/40 text-[#C5C5C5] hover:text-[#C9A227] text-[11px] font-mono rounded-lg transition-all flex items-center gap-1.5"
            >
              <StarIcon className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
              <span className="hidden 2xl:inline">MONITORIZARE</span>
            </Link>

            {/* Quick Always-On Contact Trigger (visible on large desktops, floating button on laptops) */}
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("open-quick-contact", { detail: { interest: "general-contact" } }));
                }
              }}
              className="h-8 px-2.5 2xl:px-3 bg-[#141715] hover:bg-[#1C1F1D] border border-[#C9A227]/40 hover:border-[#C9A227] text-[#C9A227] text-[11px] font-mono font-medium rounded-lg transition-all hidden 2xl:flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Deschide biroul de contact rapid"
            >
              <svg className="w-3.5 h-3.5 text-[#C9A227]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>Contact</span>
            </button>

            {/* Main Intake CTA */}
            <Link
              href="/contact"
              className="h-8 px-3.5 bg-[#C9A227] hover:bg-[#d8b135] text-black text-[11px] font-mono font-bold rounded-lg transition-all flex items-center gap-1 shadow-sm shrink-0 whitespace-nowrap"
            >
              <span>Solicitare</span>
              <span>→</span>
            </Link>
          </div>

          {/* Mobile & Tablet Controls (<1280px) */}
          <div className="flex items-center gap-1 sm:gap-2 xl:hidden shrink-0">
            {/* Search (Tablet >=640px; on mobile phones <640px, Search is in the bottom bar and drawer) */}
            <Link
              href="/search"
              aria-label="Căutare"
              className="w-9 h-9 sm:w-10 sm:h-10 hidden sm:flex items-center justify-center rounded-lg bg-[#111111] border border-[#1A1D1B] text-[#888888] hover:text-[#C9A227] active:scale-95 transition-transform"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>

            {/* Quick Contact Desk Trigger */}
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("open-quick-contact", { detail: { interest: "general-contact" } }));
                }
              }}
              aria-label="Open Contact Desk"
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-[#141715] border border-[#C9A227]/40 text-[#C9A227] active:scale-95 transition-transform cursor-pointer"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </button>

            {/* Mobile Drawer Toggle (>=44px touch target) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-lg bg-[#111111] border border-[#1A1D1B] text-[#C9A227] active:scale-95 transition-transform cursor-pointer"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

      {/* Always-On Quick Contact Modal */}
      <QuickContactModal />
      <AlwaysOnFloatingContact visible={visible} />

      {/* Mobile Drawer (100% Mobile Parity with all sections) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 xl:hidden flex">
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

              {/* 0. OFFICIAL SERVICES (13 DIVISIONS) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227]">
                    DIVIZII OFICIALE CONSTRUCȚII
                  </h4>
                  <span className="text-[9px] font-mono bg-[#C9A227]/20 text-[#C9A227] px-1.5 py-0.5 rounded font-bold">
                    13 DIVIZII
                  </span>
                </div>
                <div className="space-y-1.5">
                  <Link
                    href="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#C9A227] text-black rounded-xl text-xs font-mono font-bold flex items-center justify-between min-h-[44px]"
                  >
                    <span>Lansează o Solicitare</span>
                    <span>→</span>
                  </Link>
                  <Link
                    href="/services"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0E0F0E] border border-[#C9A227]/40 rounded-xl text-xs font-bold text-[#C9A227] flex items-center justify-between min-h-[44px]"
                  >
                    <span>Catalogul Complet de Servicii</span>
                    <span className="text-[10px] font-mono text-[#888888]">INDEX</span>
                  </Link>
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <Link
                      href="/services/calitate-constructii"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 bg-[#0B0B0B] border border-[#1A1D1B] rounded-lg text-[11px] text-[#C5C5C5] hover:text-[#C9A227] flex items-center gap-1 min-h-[44px]"
                    >
                      <ShieldIcon className="w-3.5 h-3.5 text-[#C9A227] shrink-0" /> <span className="truncate">Asigurarea Calității</span>
                    </Link>
                    <Link
                      href="/services/controlul-calitatii"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 bg-[#0B0B0B] border border-[#1A1D1B] rounded-lg text-[11px] text-[#C5C5C5] hover:text-[#C9A227] flex items-center gap-1 min-h-[44px]"
                    >
                      <SearchIcon className="w-3.5 h-3.5 text-[#C9A227] shrink-0" /> <span className="truncate">Controlul Calității</span>
                    </Link>
                    <Link
                      href="/services/manager-calitate"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 bg-[#0B0B0B] border border-[#1A1D1B] rounded-lg text-[11px] text-[#C5C5C5] hover:text-[#C9A227] flex items-center gap-1 min-h-[44px]"
                    >
                      <BriefcaseIcon className="w-3.5 h-3.5 text-[#C9A227] shrink-0" /> <span className="truncate">Managementul Calității</span>
                    </Link>
                    <Link
                      href="/services/cartea-tehnica"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 bg-[#0B0B0B] border border-[#1A1D1B] rounded-lg text-[11px] text-[#C5C5C5] hover:text-[#C9A227] flex items-center gap-1 min-h-[44px]"
                    >
                      <BookIcon className="w-3.5 h-3.5 text-[#C9A227] shrink-0" /> <span className="truncate">Cartea Tehnică</span>
                    </Link>
                    <Link
                      href="/services/ssm"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 bg-[#0B0B0B] border border-[#1A1D1B] rounded-lg text-[11px] text-[#C5C5C5] hover:text-[#C9A227] flex items-center gap-1 min-h-[44px]"
                    >
                      <HardHatIcon className="w-3.5 h-3.5 text-[#C9A227] shrink-0" /> <span className="truncate">Securitate SSM</span>
                    </Link>
                    <Link
                      href="/services/proiecte"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 bg-[#0B0B0B] border border-[#1A1D1B] rounded-lg text-[11px] text-[#C5C5C5] hover:text-[#C9A227] flex items-center gap-1 min-h-[44px]"
                    >
                      <RulerIcon className="w-3.5 h-3.5 text-[#C9A227] shrink-0" /> <span className="truncate">Proiectare Tehnică</span>
                    </Link>
                    <Link
                      href="/services/inchirieri-utilaje"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 bg-[#0B0B0B] border border-[#1A1D1B] rounded-lg text-[11px] text-[#C5C5C5] hover:text-[#C9A227] flex items-center gap-1 min-h-[44px]"
                    >
                      <TruckIcon className="w-3.5 h-3.5 text-[#C9A227] shrink-0" /> <span className="truncate">Utilaje Grele</span>
                    </Link>
                    <Link
                      href="/services/asigurari"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 bg-[#0B0B0B] border border-[#1A1D1B] rounded-lg text-[11px] text-[#C5C5C5] hover:text-[#C9A227] flex items-center gap-1 min-h-[44px]"
                    >
                      <DocumentCheckIcon className="w-3.5 h-3.5 text-[#C9A227] shrink-0" /> <span className="truncate">Asigurări CAR</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* 1. CONSTRUCTION KNOWLEDGE BASE (NEW) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227]">
                    BAZĂ DE CUNOȘTINȚE TEHNICE
                  </h4>
                  <span className="text-[9px] font-mono bg-[#C9A227]/20 text-[#C9A227] px-1.5 py-0.5 rounded">
                    NORMATIVE
                  </span>
                </div>
                <div className="space-y-1.5">
                  <Link
                    href="/knowledge"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0E0F0E] border border-[#C9A227]/40 rounded-xl text-xs font-bold text-[#C9A227] flex items-center justify-between min-h-[44px]"
                  >
                    <span>Centrul Principal de Normative</span>
                    <span>→</span>
                  </Link>
                  <Link
                    href="/knowledge/materials"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Catalog Materiale (12 Familii)</span>
                    <span className="text-[10px] font-mono text-[#888888]">SPECS</span>
                  </Link>
                  <Link
                    href="/knowledge/concrete"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Ghid Beton &amp; Ciment</span>
                    <span className="text-[10px] font-mono text-[#10B981]">SR EN 206</span>
                  </Link>
                  <Link
                    href="/knowledge/systems"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Sisteme Structurale &amp; P100-1</span>
                    <span className="text-[10px] font-mono text-[#888888]">SEISMIC</span>
                  </Link>
                  <Link
                    href="/knowledge/infrastructure"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Infrastructură Civilă &amp; Drumuri</span>
                    <span className="text-[10px] font-mono text-[#888888]">DRUMURI</span>
                  </Link>
                  <Link
                    href="/knowledge/engineering"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Fizica Construcțiilor &amp; Securitate Incendiu</span>
                    <span className="text-[10px] font-mono text-[#888888]">FIZICĂ</span>
                  </Link>
                  <Link
                    href="/knowledge/processes"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Ciclul de Execuție în 15 Etape</span>
                    <span className="text-[10px] font-mono text-[#888888]">PVLA</span>
                  </Link>
                  <Link
                    href="/knowledge/standards"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Eurocoduri (EN 1990-1999) &amp; CPR</span>
                    <span className="text-[10px] font-mono text-[#888888]">NORME</span>
                  </Link>
                  <Link
                    href="/knowledge/glossary"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Glosar Tehnic (POT, CUT, Coeficienți)</span>
                    <span className="text-[10px] font-mono text-[#888888]">TERMENI</span>
                  </Link>
                  <Link
                    href="/knowledge/compare"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Matrice Comparativă Materiale</span>
                    <span className="text-[10px] font-mono text-[#C9A227]">MATRICE</span>
                  </Link>
                </div>
              </div>

              {/* 2. DISCOVER SECTION */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227]">
                  CATALOG ENTITĂȚI &amp; PIAȚĂ
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/developers"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Dezvoltatori</span>
                    <span className="text-[10px] font-mono text-[#C9A227]">50</span>
                  </Link>
                  <Link
                    href="/projects"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Proiecte</span>
                    <span className="text-[10px] font-mono text-[#C9A227]">76</span>
                  </Link>
                  <Link
                    href="/contractors"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Constructori</span>
                    <span className="text-[10px] font-mono text-[#C9A227]">30</span>
                  </Link>
                  <Link
                    href="/architects"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Arhitecți</span>
                    <span className="text-[10px] font-mono text-[#C9A227]">21</span>
                  </Link>
                  <Link
                    href="/engineers"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Ingineri</span>
                    <span className="text-[10px] font-mono text-[#C9A227]">25</span>
                  </Link>
                  <Link
                    href="/agencies"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Agenții Imobiliare</span>
                    <span className="text-[10px] font-mono text-[#C9A227]">20</span>
                  </Link>
                </div>
                <Link
                  href="/cities"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px] block"
                >
                  <span>Acoperire Geografică &amp; Orașe</span>
                  <span className="text-[10px] font-mono text-[#C9A227]">36 REGIUNI</span>
                </Link>
              </div>

              {/* 3. INTELLIGENCE SECTION */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227]">
                  INTELIGENȚĂ &amp; ANALIZĂ PIAȚĂ
                </h4>
                <div className="space-y-1.5">
                  <Link
                    href="/intelligence"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Centru de Comandă Inteligență</span>
                    <span className="text-xs text-[#C9A227]">→</span>
                  </Link>
                  <Link
                    href="/signals"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Semnale Verificate din Piață</span>
                    <span className="text-xs text-[#C9A227]">→</span>
                  </Link>
                  <Link
                    href="/changes"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Modificări Recente Documentate</span>
                    <span className="text-xs text-[#C9A227]">→</span>
                  </Link>
                  <Link
                    href="/compare"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Stație de Comparare Entități</span>
                    <span className="text-xs text-[#C9A227]">→</span>
                  </Link>
                  <Link
                    href="/watchlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-[#C9A227] flex items-center justify-between min-h-[44px]"
                  >
                    <span className="flex items-center gap-1.5"><StarIcon className="w-3.5 h-3.5 text-[#C9A227]" /><span>Monitorizare &amp; Watchlist</span></span>
                    <span className="text-xs text-[#C9A227]">→</span>
                  </Link>
                </div>
              </div>

              {/* 4. RESEARCH & PROFILES */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227]">
                  CERCETARE &amp; INSTITUȚIONAL
                </h4>
                <div className="space-y-1.5">
                  <Link
                    href="/research-request"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Birou Solicitare Cercetare</span>
                    <span className="text-xs text-[#C9A227]">→</span>
                  </Link>
                  <Link
                    href="/about/cristian-vaduva"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Despre Cristian Văduva</span>
                    <span className="text-xs text-[#C9A227]">→</span>
                  </Link>
                  <Link
                    href="/about/aixluxury"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Despre Platforma AiXLuxury</span>
                    <span className="text-xs text-[#C9A227]">→</span>
                  </Link>
                  <Link
                    href="/work-with-us"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-xs font-medium text-white flex items-center justify-between min-h-[44px]"
                  >
                    <span>Parteneriate &amp; Colaborare</span>
                    <span className="text-xs text-[#C9A227]">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Fixed 5-Button Bottom Nav Bar (≥48px touch targets, safe area bottom) */}
      <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-[#070807]/95 backdrop-blur-lg border-t border-[#1A1D1B] px-3 py-1 pb-[calc(0.25rem+env(safe-area-inset-bottom))]">
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
            <span className="text-[9px] font-medium tracking-tight">Acasă</span>
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
            <span className="text-[9px] font-medium tracking-tight">Proiecte</span>
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
            <span className="text-[9px] font-medium tracking-tight">Normative</span>
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
            <span className="text-[9px] font-medium tracking-tight">Căutare</span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Deschide meniul de navigare"
            className="flex flex-col items-center justify-center py-1.5 rounded-lg text-[#888888] active:text-white transition-colors min-h-[48px]"
          >
            <svg className="w-5 h-5 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="text-[9px] font-medium tracking-tight">Meniu</span>
          </button>
        </div>
      </div>
    </>
  );
}
