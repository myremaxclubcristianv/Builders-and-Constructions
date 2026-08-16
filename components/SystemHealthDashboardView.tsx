'use client';

import React, { useState } from 'react';

type ServiceHealthItem = {
  status: 'HEALTHY' | 'WARNING' | 'ERROR' | 'NOT CONFIGURED';
  message: string;
  latencyMs?: number;
};

type SystemHealthData = {
  environment: 'PRODUCTION' | 'STAGING' | 'DEVELOPMENT';
  lastCheckedAt: string;
  overallStatus: 'HEALTHY' | 'WARNING' | 'ERROR' | 'NOT CONFIGURED';
  services: Record<string, ServiceHealthItem>;
};

export function SystemHealthDashboardView({ initialData }: { initialData: SystemHealthData }) {
  const [data, setData] = useState<SystemHealthData>(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>(initialData.lastCheckedAt);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/admin/system-health');
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setLastRefreshed(json.lastCheckedAt);
      }
    } catch (e) {
      console.error('Failed to probe system health:', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'HEALTHY':
        return <span className="status-pill verified">● OPERATIONAL</span>;
      case 'WARNING':
        return <span className="status-pill" style={{ color: '#d97706', borderColor: '#d97706' }}>▲ WARNING</span>;
      case 'ERROR':
        return <span className="status-pill unverified" style={{ color: '#dc2626', borderColor: '#dc2626' }}>✕ ERROR</span>;
      default:
        return <span className="status-pill secondary">○ NOT CONFIGURED</span>;
    }
  };

  const getEnvBadge = (env: string) => {
    if (env === 'PRODUCTION') {
      return <span className="status-pill verified" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>PRODUCTION ENVIRONMENT</span>;
    }
    if (env === 'STAGING') {
      return <span className="status-pill" style={{ color: '#3b82f6', borderColor: '#3b82f6' }}>STAGING ENVIRONMENT</span>;
    }
    return <span className="status-pill secondary">DEVELOPMENT ENVIRONMENT</span>;
  };

  return (
    <div className="admin-container">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <h1 style={{ margin: 0 }}>SYSTEM DIAGNOSTICS & HEALTH</h1>
            {getEnvBadge(data.environment)}
          </div>
          <p className="admin-subtitle">
            Real-time infrastructure probes, Supabase production connectivity, and subsystem integrity.
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="action-btn primary"
            style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}
          >
            {isRefreshing ? 'Running Diagnostics...' : '↻ Probe Subsystems Now'}
          </button>
          <div style={{ fontSize: '0.72rem', color: '#666', marginTop: '0.35rem' }}>
            Last checked: {new Date(lastRefreshed).toLocaleTimeString()} · {new Date(lastRefreshed).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Overall Health Banner */}
      <div
        className="admin-card"
        style={{
          marginBottom: '1.5rem',
          borderLeft: `4px solid ${
            data.overallStatus === 'HEALTHY'
              ? '#16a34a'
              : data.overallStatus === 'WARNING'
              ? '#d97706'
              : '#dc2626'
          }`
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888' }}>
              Overall Infrastructure Status
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 600, marginTop: '0.25rem' }}>
              {data.overallStatus === 'HEALTHY'
                ? 'All Core Systems Operational & Authoritative'
                : data.overallStatus === 'WARNING'
                ? 'System Operational with Degradation or Fallback'
                : 'Action Required — Subsystem Error Detected'}
            </div>
          </div>
          <div>{getStatusBadge(data.overallStatus)}</div>
        </div>
      </div>

      {/* Grid of Subsystems */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {Object.entries(data.services).map(([serviceName, info]) => (
          <div key={serviceName} className="admin-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ fontWeight: 700, letterSpacing: '0.05em', fontSize: '0.95rem' }}>
                  {serviceName}
                </div>
                {getStatusBadge(info.status)}
              </div>
              <p style={{ fontSize: '0.85rem', color: '#aaa', margin: '0 0 1rem 0', lineHeight: 1.4 }}>
                {info.message}
              </p>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.6rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#666' }}>
              <span>Target: Supabase Cloud</span>
              <span>{info.latencyMs !== undefined ? `${info.latencyMs}ms latency` : 'Active probe'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Production Contract Notice */}
      <div className="admin-card" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <h3 style={{ fontSize: '0.95rem', margin: '0 0 0.5rem 0', letterSpacing: '0.05em' }}>PRODUCTION DATA INTEGRITY POLICY</h3>
        <p style={{ fontSize: '0.82rem', color: '#888', margin: 0, lineHeight: 1.5 }}>
          In accordance with Phase 10 guidelines, production and staging pages strictly query live PostgreSQL database records.
          Demo fallback is prohibited in production to prevent simulated data leakage. Public endpoints serve verified, published records exclusively.
        </p>
      </div>
    </div>
  );
}
