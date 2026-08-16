'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AdminIdentity } from '@/lib/admin-auth';

export function AdminNav({ identity }: { identity: AdminIdentity }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isAdmin = identity.role === 'admin';
  const sales = isAdmin || identity.role === 'sales';
  const editorial = isAdmin || identity.role === 'editor';

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* 1. Mobile Executive Header (Terminal Style, <= 800px) */}
      <header className="mobile-admin-header">
        <Link className="mobile-brand" href="/admin/executive" onClick={() => setMobileMenuOpen(false)}>
          CONSTRUCTIONS
          <span className="mobile-brand-sub">Executive Command</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="status-pill verified" style={{ fontSize: '0.62rem', padding: '2px 6px' }}>
            PRODUCTION TRUTH
          </span>
          <button
            type="button"
            className="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Command Navigation Menu"
          >
            {mobileMenuOpen ? 'CLOSE' : 'MENU'}
          </button>
        </div>
      </header>

      {/* 2. Desktop Sidebar & Mobile Slide-Out Drawer */}
      <aside className={`admin-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="admin-nav-header">
          <Link className="brand" href="/admin">
            CONSTRUCTIONS
            <small>Admin · AiXLuxury</small>
          </Link>
          <div className="admin-role">{identity.role} · {identity.email}</div>
        </div>

        <nav aria-label="Admin navigation" onClick={() => setMobileMenuOpen(false)}>
          <Link className={isActive('/admin') ? 'active' : ''} href="/admin">Overview</Link>

          {/* 1. COMMAND CENTER */}
          {sales && (
            <div className="admin-nav-section">
              <div className="admin-nav-section-title">
                Command Center
              </div>
              <Link className={isActive('/admin/executive') ? 'active' : ''} href="/admin/executive">Executive Briefing</Link>
              <Link className={isActive('/admin/acquisition') ? 'active' : ''} href="/admin/acquisition">Acquisition Hub</Link>
              <Link className={isActive('/admin/acquisition/today') ? 'active' : ''} href="/admin/acquisition/today">Daily Action Queue</Link>
              <Link className={isActive('/admin/acquisition/contact-intelligence') ? 'active' : ''} href="/admin/acquisition/contact-intelligence">Contact Intelligence</Link>
              <Link className={isActive('/admin/acquisition/radar') ? 'active' : ''} href="/admin/acquisition/radar">Opportunity Radar</Link>
              <Link className={isActive('/admin/acquisition/score-history') ? 'active' : ''} href="/admin/acquisition/score-history">Score Evolution</Link>
              <Link className={isActive('/admin/acquisition/reality-test') ? 'active' : ''} href="/admin/acquisition/reality-test">Reality Test</Link>
            </div>
          )}

          {/* 2. MARKET INTELLIGENCE */}
          <div className="admin-nav-section">
            <div className="admin-nav-section-title">
              Market Intelligence
            </div>
            {sales && <Link className={isActive('/admin/intelligence/ingestion') ? 'active' : ''} href="/admin/intelligence/ingestion">Market Ingestion</Link>}
            {sales && <Link className={isActive('/admin/market/changes') ? 'active' : ''} href="/admin/market/changes">Market Changes</Link>}
            {sales && <Link className={isActive('/admin/intelligence/timeline') ? 'active' : ''} href="/admin/intelligence/timeline">Intelligence Timeline</Link>}
            {sales && <Link className={isActive('/admin/market/entity-resolution') ? 'active' : ''} href="/admin/market/entity-resolution">Entity Resolution</Link>}
            {editorial && <Link className={isActive('/admin/research') ? 'active' : ''} href="/admin/research">Research Queue</Link>}
            {editorial && <Link className={isActive('/admin/discovery') ? 'active' : ''} href="/admin/discovery">Discovery Ingestion</Link>}
            {sales && <Link className={isActive('/admin/market/activity') ? 'active' : ''} href="/admin/market/activity">Activity Signals</Link>}
            {sales && <Link className={isActive('/admin/intelligence/coverage') ? 'active' : ''} href="/admin/intelligence/coverage">Market Coverage</Link>}
            {sales && <Link className={isActive('/admin/market/activation') ? 'active' : ''} href="/admin/market/activation">Market Activation</Link>}
            {sales && <Link className={isActive('/admin/market/live-activation') ? 'active' : ''} href="/admin/market/live-activation">Live Activation</Link>}
            {sales && <Link className={isActive('/admin/market/live-discovery') ? 'active' : ''} href="/admin/market/live-discovery">Live Discovery</Link>}
            {sales && <Link className={isActive('/admin/market/golden-dataset') ? 'active' : ''} href="/admin/market/golden-dataset">Golden Dataset</Link>}
            {sales && <Link className={isActive('/admin/market/golden-dataset/execution') ? 'active' : ''} href="/admin/market/golden-dataset/execution">Golden Execution</Link>}
            {editorial && <Link className={isActive('/admin/sources') ? 'active' : ''} href="/admin/sources">Source Registry</Link>}
          </div>

          {/* 3. CONTENT */}
          {editorial && (
            <div className="admin-nav-section">
              <div className="admin-nav-section-title">
                Content
              </div>
              <Link className={isActive('/admin/companies') ? 'active' : ''} href="/admin/companies">Companies</Link>
              <Link className={isActive('/admin/projects') ? 'active' : ''} href="/admin/projects">Projects</Link>
              <Link className={isActive('/admin/editorial') ? 'active' : ''} href="/admin/editorial">Editorial</Link>
              <Link className={isActive('/admin/import') ? 'active' : ''} href="/admin/import">CSV Import</Link>
            </div>
          )}

          {/* 4. SALES */}
          {sales && (
            <div className="admin-nav-section">
              <div className="admin-nav-section-title">
                Sales
              </div>
              <Link className={isActive('/admin/leads') ? 'active' : ''} href="/admin/leads">Leads</Link>
              <Link className={isActive('/admin/opportunities') ? 'active' : ''} href="/admin/opportunities">Opportunities</Link>
              <Link className={isActive('/admin/proposals') ? 'active' : ''} href="/admin/proposals">Proposals</Link>
              <Link className={isActive('/admin/prospects') ? 'active' : ''} href="/admin/prospects">Prospects</Link>
              <Link className={isActive('/admin/prospects/activation') ? 'active' : ''} href="/admin/prospects/activation">Activation</Link>
              <Link className={isActive('/admin/commercial') ? 'active' : ''} href="/admin/commercial">Commercial Overview</Link>
              <Link className={isActive('/admin/campaigns') ? 'active' : ''} href="/admin/campaigns">Campaigns</Link>
            </div>
          )}

          {/* 5. QUALITY */}
          <div className="admin-nav-section">
            <div className="admin-nav-section-title">
              Quality
            </div>
            {editorial && <Link className={isActive('/admin/quality') ? 'active' : ''} href="/admin/quality">Data Quality & Duplicates</Link>}
            {editorial && <Link className={isActive('/admin/market/golden-dataset/quality') ? 'active' : ''} href="/admin/market/golden-dataset/quality">Golden Dataset Quality</Link>}
            {sales && <Link className={isActive('/admin/claims') ? 'active' : ''} href="/admin/claims">Profile Claims</Link>}
          </div>

          {/* 6. ANALYTICS */}
          {sales && (
            <div className="admin-nav-section">
              <div className="admin-nav-section-title">
                Analytics
              </div>
              <Link className={isActive('/admin/analytics/commercial') ? 'active' : ''} href="/admin/analytics/commercial">Commercial Funnel</Link>
              <Link className={isActive('/admin/analytics') ? 'active' : ''} href="/admin/analytics">Commercial Analytics</Link>
              <Link className={isActive('/admin/analytics/revenue') ? 'active' : ''} href="/admin/analytics/revenue">Revenue Attribution</Link>
              <Link className={isActive('/admin/analytics/attribution') ? 'active' : ''} href="/admin/analytics/attribution">Attribution Chains</Link>
              <Link className={isActive('/admin/market') ? 'active' : ''} href="/admin/market">Market Telemetry</Link>
            </div>
          )}

          {/* 7. SYSTEM */}
          {isAdmin && (
            <div className="admin-nav-section">
              <div className="admin-nav-section-title">
                System
              </div>
              <Link className={isActive('/admin/system') ? 'active' : ''} href="/admin/system">System Health</Link>
              <Link className={isActive('/admin/system/production-audit') ? 'active' : ''} href="/admin/system/production-audit">Production Audit</Link>
              <Link className={isActive('/admin/system/data') ? 'active' : ''} href="/admin/system/data">Data Subsystems</Link>
              <Link className={isActive('/admin/system/audit') ? 'active' : ''} href="/admin/system/audit">Audit Logs</Link>
              <Link className={isActive('/admin/system/activation') ? 'active' : ''} href="/admin/system/activation">Activation Logs</Link>
              <Link className={isActive('/admin/export') ? 'active' : ''} href="/admin/export">Data Export</Link>
            </div>
          )}
        </nav>
        <Link href="/" className="admin-back">← Public platform</Link>
      </aside>

      {/* 3. Mobile Backdrop overlay when drawer is open */}
      {mobileMenuOpen && (
        <div
          className="mobile-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* 4. Mobile Executive Bottom Tab Bar (Fixed thumb reach, <= 800px) */}
      <nav className="mobile-bottom-bar" aria-label="Quick mobile navigation">
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
        >
          <span className="mobile-tab-label">{mobileMenuOpen ? 'CLOSE' : 'MENU'}</span>
        </button>
      </nav>
    </>
  );
}
