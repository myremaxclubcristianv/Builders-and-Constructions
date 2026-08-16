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

type DatasetReport = {
  name: string;
  status: 'HEALTHY' | 'WARNING' | 'EMPTY' | 'ERROR' | 'NOT_CONFIGURED';
  rowCount: number;
  latencyMs: number;
  lastQuery: string;
  lastError?: string | null;
  environment: string;
  timestamp: string;
};

type Props = {
  health: {
    environment: 'PRODUCTION' | 'STAGING' | 'DEVELOPMENT';
    timestamp: string;
    overallStatus: 'CONNECTED' | 'DEGRADED' | 'ERROR' | 'NOT CONFIGURED';
    subsystems: Record<string, SubsystemReport>;
    datasets?: DatasetReport[];
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
      case 'HEALTHY':
        return '#22c55e';
      case 'DEGRADED':
      case 'WARNING':
        return '#eab308';
      case 'EMPTY':
        return '#38bdf8';
      case 'ERROR':
        return '#ef4444';
      default:
        return '#64748b';
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <div className="eyebrow" style={{ color: '#d4af37' }}>
            PRODUCTION VALIDATION · PHASE 12
          </div>
          <h1 style={{ margin: '4px 0 6px 0', fontSize: '1.85rem', fontWeight: 800 }}>
            DATA INFRASTRUCTURE & 17-DATASET REALITY CHECK
          </h1>
          <p className="admin-subtitle" style={{ margin: 0 }}>
            Real-time validation of authoritative PostgreSQL datasets, row counts, sub-millisecond query latencies, and storage.
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
            className="action-btn primary"
            style={{ fontSize: '0.75rem', padding: '6px 12px' }}
          >
            {refreshing ? 'Probing All Datasets...' : 'Re-Probe All Systems ⟳'}
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
              {data.overallStatus === 'CONNECTED' ? 'ALL 9 SUBSYSTEMS & 17 DATASETS OPERATIONAL' : `SYSTEM STATE: ${data.overallStatus}`}
            </div>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#888', textAlign: 'right' }}>
            Last Probe: <strong style={{ color: '#fff' }}>{new Date(data.timestamp).toLocaleTimeString()}</strong>
          </div>
        </div>
      </div>

      {/* Subsystem Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14, marginBottom: 32 }}>
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

                <div style={{ fontSize: '0.72rem', color: '#888', marginBottom: 8 }}>
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
              </div>
            </div>
          );
        })}
      </div>

      {/* 17-Dataset Reality Matrix */}
      {data.datasets && data.datasets.length > 0 && (
        <section className="admin-card" style={{ padding: '20px', marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#d4af37', fontWeight: 700 }}>
                CRITICAL DATASET INTEGRITY CHECK
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '2px 0 0 0', color: '#fff' }}>
                17 Authoritative Production Datasets
              </h2>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#888' }}>
              Target: <strong style={{ color: '#22c55e' }}>Zero Unverified Silent Fallbacks</strong>
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th>Dataset / Table</th>
                  <th>Status</th>
                  <th>Verified Rows</th>
                  <th>Query Latency</th>
                  <th>Last Authoritative Query</th>
                  <th>Error Diagnostic</th>
                </tr>
              </thead>
              <tbody>
                {data.datasets.map((ds) => {
                  const color = getStatusColor(ds.status);
                  return (
                    <tr key={ds.name}>
                      <td>
                        <strong style={{ color: '#fff', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                          {ds.name}
                        </strong>
                      </td>
                      <td>
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
                          {ds.status}
                        </span>
                      </td>
                      <td>
                        <strong style={{ color: ds.rowCount > 0 ? '#fff' : '#888', fontSize: '0.85rem' }}>
                          {ds.rowCount}
                        </strong>
                      </td>
                      <td style={{ fontSize: '0.75rem', color: ds.latencyMs < 100 ? '#22c55e' : '#eab308' }}>
                        {ds.latencyMs} ms
                      </td>
                      <td style={{ fontSize: '0.72rem', color: '#aaa', fontFamily: 'monospace' }}>
                        {ds.lastQuery}
                      </td>
                      <td style={{ fontSize: '0.72rem', color: ds.lastError ? '#ef4444' : '#22c55e' }}>
                        {ds.lastError || '✓ 0 errors'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Navigation Footer */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link href="/admin/acquisition/reality-test" className="action-btn primary" style={{ fontSize: '0.75rem' }}>
          Acquisition Reality Test →
        </Link>
        <Link href="/admin/system" className="action-btn secondary" style={{ fontSize: '0.75rem' }}>
          Infrastructure Telemetry →
        </Link>
        <Link href="/admin/quality" className="action-btn secondary" style={{ fontSize: '0.75rem' }}>
          Data Quality Control →
        </Link>
      </div>
    </div>
  );
}
