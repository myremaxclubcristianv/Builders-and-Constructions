'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AdminIdentity } from '@/lib/admin-auth';

export function AdminNav({ identity }: { identity: AdminIdentity }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isAdmin = identity.role === 'admin';
  const sales = isAdmin || identity.role === 'sales';
  const editorial = isAdmin || identity.role === 'editor';

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname === href || pathname.startsWith(href + '/');
  };

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* 1. Mobile Executive Header (Sticky Command Hardware, <= 800px) */}
      <header className="mobile-admin-header">
        <Link className="mobile-brand" href="/admin/executive" onClick={() => setMobileMenuOpen(false)}>
          CONSTRUCTIONS
          <span className="mobile-brand-sub">EXECUTIVE COMMAND</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="status-pill verified" style={{ fontSize: '0.58rem', padding: '3px 7px', letterSpacing: '0.08em' }}>
            PRODUCTION TRUTH
          </span>
          <button
            type="button"
            className="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Executive Command Navigation Drawer"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? 'CLOSE' : 'MENU'}
          </button>
        </div>
      </header>

      {/* 2. Desktop Sidebar & Mobile Slide-Out Command Drawer */}
      <aside className={`admin-nav ${mobileMenuOpen ? 'mobile-open' : ''}`} aria-label="Executive Navigation">
        <div className="admin-nav-header">
          <Link className="brand" href="/admin">
            CONSTRUCTIONS
            <small style={{ color: '#c7a675', display: 'block', fontSize: '0.65rem', marginTop: 2 }}>
              EXECUTIVE INTELLIGENCE · AiXLuxury
            </small>
          </Link>
          <div className="admin-role" style={{ marginTop: 10, fontSize: '0.62rem' }}>
            {identity.role.toUpperCase()} · {identity.email}
          </div>
        </div>

        <nav aria-label="Command Navigation Drawer" onClick={() => setMobileMenuOpen(false)}>
          {/* GROUP 1: COMMAND */}
          {sales && (
            <div className="admin-nav-section">
              <div className="admin-nav-section-title" style={{ color: '#c7a675', letterSpacing: '0.12em' }}>
                COMMAND
              </div>
              <Link className={isActive('/admin/executive') ? 'active' : ''} href="/admin/executive">Executive Briefing</Link>
              <Link className={isActive('/admin/acquisition/today') ? 'active' : ''} href="/admin/acquisition/today">Daily Action Queue</Link>
              <Link className={isActive('/admin/opportunities') ? 'active' : ''} href="/admin/opportunities">Opportunities</Link>
              <Link className={isActive('/admin/acquisition/radar') ? 'active' : ''} href="/admin/acquisition/radar">Opportunity Radar</Link>
              <Link className={isActive('/admin/acquisition/reality-test') ? 'active' : ''} href="/admin/acquisition/reality-test">Reality Test</Link>
            </div>
          )}

          {/* GROUP 2: MARKET */}
          <div className="admin-nav-section">
            <div className="admin-nav-section-title" style={{ color: '#38bdf8', letterSpacing: '0.12em' }}>
              MARKET
            </div>
            {sales && <Link className={isActive('/admin/market/changes') ? 'active' : ''} href="/admin/market/changes">Market Changes</Link>}
            {sales && <Link className={isActive('/admin/market/activity') ? 'active' : ''} href="/admin/market/activity">Signals & Activity</Link>}
            {sales && <Link className={isActive('/admin/intelligence/ingestion') ? 'active' : ''} href="/admin/intelligence/ingestion">Ingestion Subsystem</Link>}
            {sales && <Link className={isActive('/admin/intelligence/coverage') ? 'active' : ''} href="/admin/intelligence/coverage">Market Coverage</Link>}
            {sales && <Link className={isActive('/admin/market/activation') ? 'active' : ''} href="/admin/market/activation">Market Activation</Link>}
            {sales && <Link className={isActive('/admin/market/golden-dataset') ? 'active' : ''} href="/admin/market/golden-dataset">Golden Dataset</Link>}
            {editorial && <Link className={isActive('/admin/sources') ? 'active' : ''} href="/admin/sources">Source Registry</Link>}
          </div>

          {/* GROUP 3: COMMERCIAL */}
          {sales && (
            <div className="admin-nav-section">
              <div className="admin-nav-section-title" style={{ color: '#22c55e', letterSpacing: '0.12em' }}>
                COMMERCIAL
              </div>
              <Link className={isActive('/admin/revenue') ? 'active' : ''} href="/admin/revenue">Revenue Command</Link>
              <Link className={isActive('/admin/acquisition') ? 'active' : ''} href="/admin/acquisition">Pipeline Overview</Link>
              <Link className={isActive('/admin/prospects/activation') ? 'active' : ''} href="/admin/prospects/activation">Outreach Activation</Link>
              <Link className={isActive('/admin/proposals') ? 'active' : ''} href="/admin/proposals">Proposals Execution</Link>
              <Link className={isActive('/admin/analytics/revenue') ? 'active' : ''} href="/admin/analytics/revenue">Revenue Attribution</Link>
              <Link className={isActive('/admin/commercial') ? 'active' : ''} href="/admin/commercial">Commercial Command</Link>
            </div>
          )}

          {/* GROUP 4: INTELLIGENCE */}
          <div className="admin-nav-section">
            <div className="admin-nav-section-title" style={{ color: '#a855f7', letterSpacing: '0.12em' }}>
              INTELLIGENCE
            </div>
            {editorial && <Link className={isActive('/admin/companies') ? 'active' : ''} href="/admin/companies">Companies Dossier</Link>}
            {editorial && <Link className={isActive('/admin/projects') ? 'active' : ''} href="/admin/projects">Projects Dossier</Link>}
            {sales && <Link className={isActive('/admin/acquisition/contact-intelligence') ? 'active' : ''} href="/admin/acquisition/contact-intelligence">Decision Makers</Link>}
            {sales && <Link className={isActive('/admin/intelligence/timeline') ? 'active' : ''} href="/admin/intelligence/timeline">Relationship Timeline</Link>}
            {editorial && <Link className={isActive('/admin/research') ? 'active' : ''} href="/admin/research">Research Queue</Link>}
          </div>

          {/* GROUP 5: SYSTEM */}
          <div className="admin-nav-section">
            <div className="admin-nav-section-title" style={{ color: '#88857c', letterSpacing: '0.12em' }}>
              SYSTEM
            </div>
            {editorial && <Link className={isActive('/admin/quality') ? 'active' : ''} href="/admin/quality">Data Quality & Audit</Link>}
            {sales && <Link className={isActive('/admin/claims') ? 'active' : ''} href="/admin/claims">Claim Firewall</Link>}
            {isAdmin && <Link className={isActive('/admin/system/production-audit') ? 'active' : ''} href="/admin/system/production-audit">Production Audit</Link>}
            {isAdmin && <Link className={isActive('/admin/system') ? 'active' : ''} href="/admin/system">System Health</Link>}
          </div>
        </nav>

        <Link href="/" className="admin-back">← Public Platform</Link>
      </aside>

      {/* 3. Mobile Backdrop overlay when drawer is open */}
      {mobileMenuOpen && (
        <div
          className="mobile-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* 4. Mobile Executive Bottom Navigation Hardware Bar (<= 800px) */}
      <nav className="mobile-bottom-bar" aria-label="Executive Mobile Navigation">
        <Link
          href="/admin/executive"
          className={`mobile-tab-item ${isActive('/admin/executive') ? 'active' : ''}`}
        >
          <span className="mobile-tab-label">BRIEF</span>
        </Link>
        <Link
          href="/admin/acquisition/today"
          className={`mobile-tab-item ${isActive('/admin/acquisition/today') ? 'active' : ''}`}
        >
          <span className="mobile-tab-label">TODAY</span>
        </Link>
        <Link
          href="/admin/market/changes"
          className={`mobile-tab-item ${isActive('/admin/market/changes') ? 'active' : ''}`}
        >
          <span className="mobile-tab-label">FEED</span>
        </Link>
        <Link
          href="/admin/acquisition"
          className={`mobile-tab-item ${isActive('/admin/acquisition') ? 'active' : ''}`}
        >
          <span className="mobile-tab-label">PIPELINE</span>
        </Link>
        <button
          type="button"
          className={`mobile-tab-item ${mobileMenuOpen ? 'active' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
        >
          <span className="mobile-tab-label">{mobileMenuOpen ? 'CLOSE' : 'MENU'}</span>
        </button>
      </nav>
    </>
  );
}

