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
        return <span className="status-pill verified" style={{ fontSize: '0.65rem' }}>PRIMARY TIER (OFFICIAL)</span>;
      case 'SECONDARY':
        return <span className="status-pill" style={{ color: '#38bdf8', borderColor: '#38bdf8', fontSize: '0.65rem' }}>SECONDARY TIER</span>;
      default:
        return <span className="status-pill secondary" style={{ fontSize: '0.65rem' }}>TERTIARY DISCOVERY</span>;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#141715',
          border: '1px solid var(--line)',
          borderRadius: 8,
          maxWidth: 720,
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: 24
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#d4af37', textTransform: 'uppercase', fontWeight: 700 }}>
              DATA INTEGRITY FIREWALL · PROVENANCE PROOF
            </div>
            <h2 style={{ fontSize: '1.4rem', margin: '4px 0 0 0', color: '#fff', fontWeight: 800 }}>
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#888', fontSize: '1.2rem', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {evidenceList.length > 0 ? (
            evidenceList.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 6,
                  padding: 16
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: '#888', textTransform: 'uppercase' }}>Factual Statement:</div>
                    <strong style={{ color: '#fff', fontSize: '0.92rem', display: 'block', marginTop: 2 }}>
                      {item.fact}
                    </strong>
                  </div>
                  {getTierBadge(item.sourceTier)}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8, fontSize: '0.75rem', background: 'rgba(255,255,255,0.02)', padding: 10, borderRadius: 4, margin: '10px 0' }}>
                  <div>
                    <span style={{ color: '#888', display: 'block', fontSize: '0.65rem' }}>SOURCE:</span>
                    <strong style={{ color: '#cbd5e1' }}>{item.sourceTitle}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#888', display: 'block', fontSize: '0.65rem' }}>TYPE:</span>
                    <span style={{ color: '#38bdf8' }}>{item.sourceType}</span>
                  </div>
                  <div>
                    <span style={{ color: '#888', display: 'block', fontSize: '0.65rem' }}>VERIFIED DATE:</span>
                    <span style={{ color: '#22c55e' }}>{item.date || 'Authoritative'}</span>
                  </div>
                  {item.relationshipType && (
                    <div>
                      <span style={{ color: '#888', display: 'block', fontSize: '0.65rem' }}>ROLE:</span>
                      <span style={{ color: '#d4af37' }}>{item.relationshipType}</span>
                    </div>
                  )}
                </div>

                {item.notes && (
                  <p style={{ fontSize: '0.78rem', color: '#aaa', margin: '0 0 10px 0', lineHeight: 1.4 }}>
                    {item.notes}
                  </p>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10 }}>
                  <button
                    type="button"
                    onClick={() => handleCopy(item, idx)}
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: copiedIdx === idx ? '#22c55e' : '#cbd5e1',
                      padding: '4px 10px',
                      borderRadius: 3,
                      fontSize: '0.72rem',
                      cursor: 'pointer'
                    }}
                  >
                    {copiedIdx === idx ? '✓ Copied to Clipboard' : '📋 Copy Evidence'}
                  </button>

                  {item.sourceUrl && (
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: '0.75rem', color: '#38bdf8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      View Primary Source ↗
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '32px', color: '#888' }}>
              No primary evidence records attached to this claim.
            </div>
          )}
        </div>

        <div style={{ marginTop: 24, textAlign: 'right' }}>
          <button
            type="button"
            onClick={onClose}
            className="action-btn secondary"
            style={{ fontSize: '0.75rem' }}
          >
            Close Provenance Viewer
          </button>
        </div>
      </div>
    </div>
  );
}
