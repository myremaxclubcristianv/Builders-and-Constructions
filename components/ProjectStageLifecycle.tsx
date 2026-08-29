'use client';

import React from 'react';

const STAGES = [
  { id: 'planning', label: 'Planning' },
  { id: 'permits', label: 'Permits' },
  { id: 'foundation', label: 'Foundation' },
  { id: 'structure', label: 'Structure' },
  { id: 'facade', label: 'Facade' },
  { id: 'mep', label: 'MEP' },
  { id: 'finishing', label: 'Finishing' },
  { id: 'delivered', label: 'Delivered' }
];

export function ProjectStageLifecycle({
  currentStage,
  progressPercent,
  statusDisplay
}: {
  currentStage?: string;
  progressPercent?: number;
  statusDisplay?: string;
}) {
  const normStage = (currentStage || 'planning').toLowerCase();
  const currentIdx = STAGES.findIndex(s => s.id === normStage);
  const activeIdx = currentIdx >= 0 ? currentIdx : 0;

  return (
    <div
      style={{
        background: '#141715',
        border: '1px solid #262927',
        borderRadius: 6,
        padding: 20,
        margin: '24px 0'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#c7a675', letterSpacing: '0.08em' }}>
          CONSTRUCTION LIFECYCLE STAGE INTELLIGENCE
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: '#888' }}>
            STATUS: <strong style={{ color: '#fff' }}>{statusDisplay || 'ACTIVE'}</strong>
          </span>
          <span style={{ fontSize: 11, background: '#1c221e', border: '1px solid #38bdf8', color: '#38bdf8', padding: '2px 8px', borderRadius: 2, fontWeight: 800 }}>
            {progressPercent !== undefined ? `${progressPercent}% COMPLETED` : `${Math.round(((activeIdx + 1) / STAGES.length) * 100)}% TRACKED`}
          </span>
        </div>
      </div>

      {/* Progress Line & Nodes */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', overflowX: 'auto', padding: '10px 0' }}>
        {STAGES.map((s, idx) => {
          const isPassed = idx <= activeIdx;
          const isCurrent = idx === activeIdx;

          return (
            <div key={s.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, minWidth: 60, position: 'relative', zIndex: 2 }}>
              <div
                style={{
                  width: isCurrent ? 24 : 16,
                  height: isCurrent ? 24 : 16,
                  borderRadius: '50%',
                  background: isCurrent ? '#c7a675' : isPassed ? '#38bdf8' : '#222',
                  border: isCurrent ? '3px solid #fff' : isPassed ? '2px solid #38bdf8' : '2px solid #444',
                  boxShadow: isCurrent ? '0 0 12px rgba(199,166,117,0.8)' : 'none',
                  transition: 'all 0.2s ease',
                  marginBottom: 8
                }}
              />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: isCurrent ? 800 : isPassed ? 700 : 500,
                  color: isCurrent ? '#c7a675' : isPassed ? '#fff' : '#666',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
