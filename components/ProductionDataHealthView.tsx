'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type SubsystemReport = {
  status: 'CONNECTED' | 'DEGRADED' | 'ERROR' | 'NOT CONFIGURED';
  latencyMs: number;
  lastSuccessfulQuery: string;
  affectedSubsystem: string;
  errorClassification?: string | null;
  message: string;
};

type Props = {
  health: {
    environment: 'PRODUCTION' | 'STAGING' | 'DEVELOPMENT';
    timestamp: string;
    overallStatus: 'CONNECTED' | 'DEGRADED' | 'ERROR' | 'NOT CONFIGURED';
    subsystems: Record<string, SubsystemReport>;
  };
};

export function ProductionDataHealthView({ health }: Props) {
  const [data, setData] = useState(health);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch('/api/admin/system-health?type=data');
      if (res.ok) {
        const fresh = await res.json();
        if (fresh.subsystems) {
          setData(fresh);
        }
      }
    } catch {
      // Keep existing state on transient network error
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusColor = (st: string) => {
    switch (st) {
      case 'CONNECTED':
        return '#22c55e';
      case 'DEGRADED':
        return '#eab308';
      case 'ERROR':
        return '#ef4444';
      default:
        return '#64748b';
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div className="eyebrow" style={{ color: '#d4af37' }}>
            PRODUCTION DATA ACTIVATION · PHASE 11
          </div>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: '1.85rem', fontWeight: 800 }}>
            DATA INFRASTRUCTURE & SUBSYSTEM DIAGNOSTICS
          </h1>
          <p className="admin-subtitle" style={{ margin: 0 }}>
            Continuous real-time telemetry across core PostgreSQL, public presentation, private intelligence, discovery, and search.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 800,
              padding: '4px 8px',
              borderRadius: 3,
              letterSpacing: '0.08em',
              background: data.environment === 'PRODUCTION' ? '#22c55e22' : '#eab30822',
              color: data.environment === 'PRODUCTION' ? '#22c55e' : '#eab308',
              border: `1px solid ${data.environment === 'PRODUCTION' ? '#22c55e66' : '#eab30866'}`
            }}
          >
            ENV: {data.environment}
          </span>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="action-btn secondary"
            style={{ fontSize: '0.75rem', padding: '6px 12px' }}
          >
            {refreshing ? 'Probing...' : 'Run Diagnostics ⟳'}
          </button>
        </div>
      </div>

      {/* Overall Health Banner */}
      <div
        className="admin-card"
        style={{
          marginBottom: 24,
          padding: '16px 20px',
          borderColor: getStatusColor(data.overallStatus),
          background: `${getStatusColor(data.overallStatus)}08`
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888' }}>
              Subsystem Composite Health
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: getStatusColor(data.overallStatus), marginTop: 2 }}>
              {data.overallStatus === 'CONNECTED' ? 'ALL 9 SUBSYSTEMS LIVE & AUTHORITATIVE' : `SUBSYSTEM STATUS: ${data.overallStatus}`}
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#888', textAlign: 'right' }}>
            Last Probe: <strong style={{ color: '#fff' }}>{new Date(data.timestamp).toLocaleTimeString()}</strong>
          </div>
        </div>
      </div>

      {/* Subsystem Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
        {Object.entries(data.subsystems).map(([name, probe]) => {
          const color = getStatusColor(probe.status);
          return (
            <div
              key={name}
              className="admin-card"
              style={{
                padding: '16px 18px',
                borderLeft: `4px solid ${color}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.04em', color: '#fff' }}>
                    {name}
                  </span>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: 3,
                      color,
                      background: `${color}15`,
                      border: `1px solid ${color}44`
                    }}
                  >
                    {probe.status}
                  </span>
                </div>

                <div style={{ fontSize: '0.72rem', color: '#888', marginBottom: 12 }}>
                  Subsystem: <strong style={{ color: '#ccc' }}>{probe.affectedSubsystem}</strong>
                </div>

                <p style={{ fontSize: '0.78rem', color: '#e2e8f0', margin: '0 0 12px 0', lineHeight: 1.5 }}>
                  {probe.message}
                </p>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10, fontSize: '0.7rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', marginBottom: 4 }}>
                  <span>Latency:</span>
                  <strong style={{ color: probe.latencyMs < 100 ? '#22c55e' : probe.latencyMs < 300 ? '#eab308' : '#ef4444' }}>
                    {probe.latencyMs} ms
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', marginBottom: 4 }}>
                  <span>Last Probe:</span>
                  <span style={{ color: '#bbb', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {probe.lastSuccessfulQuery}
                  </span>
                </div>
                {probe.errorClassification && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ef4444' }}>
                    <span>Classification:</span>
                    <strong>{probe.errorClassification}</strong>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Footer */}
      <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
        <Link href="/admin/system" className="action-btn secondary" style={{ fontSize: '0.75rem' }}>
          ← Infrastructure System Health
        </Link>
        <Link href="/admin/quality" className="action-btn secondary" style={{ fontSize: '0.75rem' }}>
          Data Quality Control →
        </Link>
      </div>
    </div>
  );
}
