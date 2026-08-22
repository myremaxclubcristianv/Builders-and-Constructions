'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export type CompanyPreviewData = {
  name: string;
  slug: string;
  type?: string;
  location?: string;
  verification_level?: string;
  active_projects_count?: number | null;
  market_signals_count?: number | null;
  last_activity_date?: string | null;
  latest_signal?: string | null;
  signal_freshness?: 'FRESH' | 'RECENT' | 'AGING' | 'STALE' | null;
};

export function CompanyIntelligencePreview({
  company,
  children,
  className = ''
}: {
  company: CompanyPreviewData;
  children: React.ReactNode;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseEnter = () => {
    if (isMobile) return;
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setIsOpen(true);
    }, 150);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isMobile) {
      e.preventDefault();
      e.stopPropagation();
      setIsOpen(true);
    }
  };

  const formattedProjects = company.active_projects_count !== undefined && company.active_projects_count !== null
    ? `${company.active_projects_count} ACTIVE`
    : 'NOT AVAILABLE';

  const formattedSignals = company.market_signals_count !== undefined && company.market_signals_count !== null
    ? `${company.market_signals_count} SIGNALS`
    : 'NOT AVAILABLE';

  const formattedDate = company.last_activity_date
    ? new Date(company.last_activity_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()
    : 'NOT AVAILABLE';

  const freshnessColor = company.signal_freshness === 'FRESH' ? '#38bdf8' : company.signal_freshness === 'RECENT' ? '#c7a675' : '#888';

  return (
    <span
      ref={containerRef}
      className={`company-intelligence-trigger ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}
    >
      {children}

      {/* Desktop Popover */}
      {isOpen && !isMobile && (
        <div
          tabIndex={-1}
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%) translateY(-8px)',
            width: 320,
            padding: 16,
            background: '#0d100f',
            border: '1px solid #2a2e2b',
            borderRadius: 6,
            boxShadow: '0 20px 40px rgba(0,0,0,0.85)',
            zIndex: 9999,
            color: '#f3f1eb',
            pointerEvents: 'auto',
            textAlign: 'left'
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 10, letterSpacing: '0.12em', color: '#c7a675', fontWeight: 700 }}>
              COMPANY INTELLIGENCE PREVIEW
            </span>
            <span
              style={{
                fontSize: 9,
                fontWeight: 800,
                padding: '2px 6px',
                borderRadius: 2,
                border: `1px solid ${freshnessColor}`,
                color: freshnessColor
              }}
            >
              {company.signal_freshness || company.verification_level || 'VERIFIED'}
            </span>
          </div>

          <h4 style={{ fontSize: 16, fontWeight: 800, color: '#fff', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
            {company.name}
          </h4>

          <div style={{ fontSize: 12, color: 'rgba(243,241,235,0.7)', marginBottom: 12 }}>
            {company.type || 'Company'} {company.location ? `· ${company.location}` : ''}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: '8px 10px', background: '#141715', borderRadius: 4, marginBottom: 12, fontSize: 11 }}>
            <div>
              <div style={{ color: '#888', fontSize: 9 }}>PROJECTS</div>
              <strong style={{ color: '#fff' }}>{formattedProjects}</strong>
            </div>
            <div>
              <div style={{ color: '#888', fontSize: 9 }}>MARKET SIGNALS</div>
              <strong style={{ color: '#c7a675' }}>{formattedSignals}</strong>
            </div>
          </div>

          {company.latest_signal && (
            <div style={{ fontSize: 11, color: '#ccc', fontStyle: 'italic', marginBottom: 12, lineHeight: 1.4 }}>
              &quot;{company.latest_signal}&quot;
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, borderTop: '1px solid #1a1e1c', paddingTop: 10 }}>
            <span style={{ color: '#777', fontSize: 10 }}>ACTIVITY: {formattedDate}</span>
            <Link
              href={`/companies/${company.slug}`}
              style={{ color: '#c7a675', fontWeight: 700, textDecoration: 'none' }}
              onClick={(e) => e.stopPropagation()}
            >
              OPEN DOSSIER →
            </Link>
          </div>
        </div>
      )}

      {/* Mobile Bottom Sheet Modal */}
      {isOpen && isMobile && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center'
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxHeight: '85vh',
              background: '#0d100f',
              borderTop: '1px solid #2a2e2b',
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              padding: '16px 20px 32px 20px',
              color: '#f3f1eb',
              boxShadow: '0 -10px 40px rgba(0,0,0,0.9)',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ width: 40, height: 4, background: '#333', borderRadius: 2, margin: '0 auto 16px auto' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 10, letterSpacing: '0.12em', color: '#c7a675', fontWeight: 800 }}>
                COMPANY INTELLIGENCE
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#aaa',
                  fontSize: 20,
                  cursor: 'pointer',
                  padding: '4px 8px',
                  minHeight: 44,
                  minWidth: 44
                }}
              >
                ✕
              </button>
            </div>

            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 0 4px 0' }}>
              {company.name}
            </h3>

            <p style={{ fontSize: 13, color: 'rgba(243,241,235,0.7)', margin: '0 0 16px 0' }}>
              {company.type || 'Company'} {company.location ? `· ${company.location}` : ''}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: 12, background: '#141715', borderRadius: 6, marginBottom: 16 }}>
              <div>
                <div style={{ color: '#888', fontSize: 10, fontWeight: 700 }}>ACTIVE PROJECTS</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginTop: 2 }}>{formattedProjects}</div>
              </div>
              <div>
                <div style={{ color: '#888', fontSize: 10, fontWeight: 700 }}>MARKET SIGNALS</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#c7a675', marginTop: 2 }}>{formattedSignals}</div>
              </div>
            </div>

            {company.latest_signal && (
              <div style={{ fontSize: 13, color: '#ccc', fontStyle: 'italic', marginBottom: 16, padding: '10px 12px', background: '#111413', borderLeft: '2px solid #c7a675' }}>
                &quot;{company.latest_signal}&quot;
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, fontSize: 12, color: '#777' }}>
              <span>LAST ACTIVITY: {formattedDate}</span>
              <span style={{ color: freshnessColor, fontWeight: 700 }}>{company.signal_freshness || 'VERIFIED'}</span>
            </div>

            <Link
              href={`/companies/${company.slug}`}
              className="btn fill"
              style={{ display: 'block', textAlign: 'center', width: '100%', minHeight: 48, lineHeight: '48px', fontSize: 14, fontWeight: 800 }}
              onClick={() => setIsOpen(false)}
            >
              OPEN DOSSIER →
            </Link>
          </div>
        </div>
      )}
    </span>
  );
}
