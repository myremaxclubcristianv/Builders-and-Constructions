'use client';

import React from 'react';

export interface FinancialTrendData {
  year: number;
  revenue_eur?: number;
  net_profit_eur?: number;
  employees?: number;
  status?: string;
}

export function FinancialTrendChart({ timeline }: { timeline: FinancialTrendData[] }) {
  if (!timeline || timeline.length === 0) return null;

  // Filter valid revenues
  const validData = timeline.filter(t => t.revenue_eur && t.revenue_eur > 0);
  if (validData.length === 0) return null;

  const maxRevenue = Math.max(...validData.map(d => d.revenue_eur || 0));

  return (
    <div
      style={{
        background: '#141715',
        border: '1px solid #262927',
        borderRadius: 6,
        padding: 20,
        marginTop: 20
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#c7a675', letterSpacing: '0.08em' }}>
          REVENUE TREND (EUR)
        </div>
        <div style={{ fontSize: 10, color: '#888' }}>ANNUAL DISCLOSURES</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, height: 120, paddingTop: 10 }}>
        {timeline.map(t => {
          const rev = t.revenue_eur || 0;
          const heightPct = maxRevenue > 0 ? Math.max((rev / maxRevenue) * 100, 10) : 0;
          const formattedRev = rev > 0 ? `€${(rev / 1000000).toFixed(1)}M` : 'N/A';

          return (
            <div key={t.year} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: rev > 0 ? '#fff' : '#666', marginBottom: 6 }}>
                {formattedRev}
              </div>
              <div
                style={{
                  width: '100%',
                  maxWidth: 48,
                  height: `${heightPct}%`,
                  background: rev > 0 ? 'linear-gradient(180deg, #c7a675 0%, #8a7048 100%)' : '#222',
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 0.3s ease'
                }}
              />
              <div style={{ fontSize: 11, fontWeight: 700, color: '#888', marginTop: 8 }}>
                {t.year}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
