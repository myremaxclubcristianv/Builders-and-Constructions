'use client';

import React, { useState } from 'react';

export type EvidenceItem = {
  fact: string;
  sourceTitle: string;
  sourceType: string;
  sourceTier: 'PRIMARY' | 'SECONDARY' | 'TERTIARY';
  sourceUrl?: string | null;
  date?: string | null;
  verificationState: string;
  entityName?: string;
  relationshipType?: string;
  notes?: string | null;
};

type Props = {
  evidenceList: EvidenceItem[];
  isOpen: boolean;
  onClose: () => void;
  title?: string;
};

export function EvidenceViewer({ evidenceList, isOpen, onClose, title = 'Verifiable Evidence Chain' }: Props) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleCopy = (item: EvidenceItem, idx: number) => {
    const text = `[EVIDENCE] ${item.fact} | Source: ${item.sourceTitle} (${item.sourceType} - ${item.sourceTier}) | URL: ${item.sourceUrl || 'N/A'} | Date: ${item.date || 'N/A'}`;
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2500);
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'PRIMARY':
        return <span className="status-pill verified" style={{ fontSize: '0.62rem' }}>PRIMARY TIER (OFFICIAL)</span>;
      case 'SECONDARY':
        return <span className="status-pill" style={{ color: '#38bdf8', borderColor: 'rgba(56,189,248,0.4)', background: 'rgba(56,189,248,0.08)', fontSize: '0.62rem' }}>SECONDARY TIER</span>;
      default:
        return <span className="status-pill unknown" style={{ fontSize: '0.62rem' }}>TERTIARY DISCOVERY</span>;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 0
      }}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        style={{
          background: '#0d100f',
          border: '1px solid rgba(199, 166, 117, 0.2)',
          borderBottom: 'none',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          maxWidth: 720,
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.8)',
          paddingBottom: 'max(16px, env(safe-area-inset-bottom))'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Mobile Sheet Drag Handle Indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10, paddingBottom: 6 }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(244,242,235,0.2)' }} />
        </div>

        {/* Sticky Sheet Header */}
        <div style={{ padding: '12px 20px 16px 20px', borderBottom: '1px solid rgba(244,242,235,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '0.62rem', color: '#c7a675', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.12em' }}>
              DATA INTEGRITY FIREWALL · PROVENANCE PROOF
            </div>
            <h2 style={{ fontSize: '1.25rem', margin: '3px 0 0 0', color: '#f3f1eb', fontWeight: 800 }}>
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#f3f1eb',
              fontSize: '1.1rem',
              cursor: 'pointer',
              minWidth: 36,
              minHeight: 36,
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Close evidence sheet"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Evidence Content */}
        <div style={{ padding: 20, overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {evidenceList.length > 0 ? (
            evidenceList.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(0,0,0,0.35)',
                  border: '1px solid rgba(244,242,235,0.08)',
                  borderRadius: 8,
                  padding: 16
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <div style={{ fontSize: '0.62rem', color: 'rgba(243,241,235,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Factual Record:</div>
                    <strong style={{ color: '#f3f1eb', fontSize: '0.92rem', display: 'block', marginTop: 2, fontWeight: 700 }}>
                      {item.fact}
                    </strong>
                  </div>
                  {getTierBadge(item.sourceTier)}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, fontSize: '0.75rem', background: 'rgba(244,242,235,0.02)', padding: 10, borderRadius: 4, margin: '10px 0', border: '1px solid rgba(244,242,235,0.04)' }}>
                  <div>
                    <span style={{ color: 'rgba(243,241,235,0.45)', display: 'block', fontSize: '0.62rem' }}>SOURCE:</span>
                    <strong style={{ color: '#f3f1eb' }}>{item.sourceTitle}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'rgba(243,241,235,0.45)', display: 'block', fontSize: '0.62rem' }}>TYPE:</span>
                    <span style={{ color: '#38bdf8', fontWeight: 600 }}>{item.sourceType}</span>
                  </div>
                  <div>
                    <span style={{ color: 'rgba(243,241,235,0.45)', display: 'block', fontSize: '0.62rem' }}>VERIFIED DATE:</span>
                    <span style={{ color: '#22c55e', fontWeight: 600 }}>{item.date || 'Authoritative'}</span>
                  </div>
                  {item.relationshipType && (
                    <div>
                      <span style={{ color: 'rgba(243,241,235,0.45)', display: 'block', fontSize: '0.62rem' }}>ROLE:</span>
                      <span style={{ color: '#c7a675', fontWeight: 600 }}>{item.relationshipType}</span>
                    </div>
                  )}
                </div>

                {item.notes && (
                  <p style={{ fontSize: '0.78rem', color: 'rgba(243,241,235,0.7)', margin: '0 0 10px 0', lineHeight: 1.45 }}>
                    {item.notes}
                  </p>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(244,242,235,0.06)', paddingTop: 10, flexWrap: 'wrap', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => handleCopy(item, idx)}
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(244,242,235,0.15)',
                      color: copiedIdx === idx ? '#22c55e' : '#f3f1eb',
                      padding: '6px 12px',
                      borderRadius: 4,
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      minHeight: 36,
                      display: 'inline-flex',
                      alignItems: 'center'
                    }}
                  >
                    {copiedIdx === idx ? '✓ Copied to Clipboard' : 'Copy Evidence Citation'}
                  </button>

                  {item.sourceUrl && (
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: '0.75rem', color: '#38bdf8', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 600, minHeight: 36 }}
                    >
                      View Official Source ↗
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '32px', color: 'rgba(243,241,235,0.5)', fontSize: '0.85rem' }}>
              No primary evidence records attached to this claim.
            </div>
          )}
        </div>

        {/* Sticky Sheet Footer Action Bar */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(244,242,235,0.08)', textAlign: 'right' }}>
          <button
            type="button"
            onClick={onClose}
            className="action-btn secondary"
            style={{ fontSize: '0.78rem', minHeight: 44, padding: '8px 20px', width: '100%', maxWidth: 200 }}
          >
            Close Sheet
          </button>
        </div>
      </div>
    </div>
  );
}

