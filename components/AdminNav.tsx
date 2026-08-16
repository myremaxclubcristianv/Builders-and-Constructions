import Link from 'next/link';
import { AdminIdentity } from '@/lib/admin-auth';

export function AdminNav({ identity }: { identity: AdminIdentity }) {
  const isAdmin = identity.role === 'admin';
  const sales = isAdmin || identity.role === 'sales';
  const editorial = isAdmin || identity.role === 'editor';

  return (
    <aside className="admin-nav">
      <Link className="brand" href="/admin">
        CONSTRUCTIONS
        <small>Admin · AiXLuxury</small>
      </Link>
      <div className="admin-role">{identity.role} · {identity.email}</div>
      <nav aria-label="Admin navigation">
        <Link href="/admin">Overview</Link>

        {/* 1. COMMAND CENTER */}
        {sales && (
          <div className="admin-nav-section" style={{ marginTop: '0.75rem' }}>
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', padding: '0.35rem 0.5rem', fontWeight: 700 }}>
              Command Center
            </div>
            <Link href="/admin/acquisition">Acquisition Hub</Link>
            <Link href="/admin/acquisition/today">Daily Queue</Link>
            <Link href="/admin/acquisition/radar">Opportunity Radar</Link>
            <Link href="/admin/acquisition/reality-test">Reality Test</Link>
          </div>
        )}

        {/* 2. MARKET INTELLIGENCE */}
        <div className="admin-nav-section" style={{ marginTop: '0.75rem' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', padding: '0.35rem 0.5rem', fontWeight: 700 }}>
            Market Intelligence
          </div>
          {editorial && <Link href="/admin/research">Research Queue</Link>}
          {editorial && <Link href="/admin/discovery">Discovery Ingestion</Link>}
          {sales && <Link href="/admin/market/activity">Activity Signals</Link>}
          {sales && <Link href="/admin/market/coverage">Market Coverage</Link>}
          {sales && <Link href="/admin/market/activation">Market Activation</Link>}
          {sales && <Link href="/admin/market/golden-dataset">Golden Dataset</Link>}
          {editorial && <Link href="/admin/sources">Source Registry</Link>}
        </div>

        {/* 3. CONTENT */}
        {editorial && (
          <div className="admin-nav-section" style={{ marginTop: '0.75rem' }}>
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', padding: '0.35rem 0.5rem', fontWeight: 700 }}>
              Content
            </div>
            <Link href="/admin/companies">Companies</Link>
            <Link href="/admin/projects">Projects</Link>
            <Link href="/admin/editorial">Editorial</Link>
            <Link href="/admin/import">CSV Import</Link>
          </div>
        )}

        {/* 4. SALES */}
        {sales && (
          <div className="admin-nav-section" style={{ marginTop: '0.75rem' }}>
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', padding: '0.35rem 0.5rem', fontWeight: 700 }}>
              Sales
            </div>
            <Link href="/admin/leads">Leads</Link>
            <Link href="/admin/opportunities">Opportunities</Link>
            <Link href="/admin/prospects">Prospects</Link>
            <Link href="/admin/prospects/activation">Activation</Link>
            <Link href="/admin/commercial">Commercial Overview</Link>
            <Link href="/admin/campaigns">Campaigns</Link>
          </div>
        )}

        {/* 5. QUALITY */}
        <div className="admin-nav-section" style={{ marginTop: '0.75rem' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', padding: '0.35rem 0.5rem', fontWeight: 700 }}>
            Quality
          </div>
          {editorial && <Link href="/admin/quality">Data Quality & Duplicates</Link>}
          {editorial && <Link href="/admin/market/golden-dataset/quality">Golden Dataset Quality</Link>}
          {sales && <Link href="/admin/claims">Profile Claims</Link>}
        </div>

        {/* 6. ANALYTICS */}
        {sales && (
          <div className="admin-nav-section" style={{ marginTop: '0.75rem' }}>
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', padding: '0.35rem 0.5rem', fontWeight: 700 }}>
              Analytics
            </div>
            <Link href="/admin/analytics">Commercial Analytics</Link>
            <Link href="/admin/market">Market Telemetry</Link>
          </div>
        )}

        {/* 7. SYSTEM */}
        {isAdmin && (
          <div className="admin-nav-section" style={{ marginTop: '0.75rem' }}>
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', padding: '0.35rem 0.5rem', fontWeight: 700 }}>
              System
            </div>
            <Link href="/admin/system">System Health</Link>
            <Link href="/admin/system/data">Data Subsystems</Link>
            <Link href="/admin/system/audit">Audit Logs</Link>
            <Link href="/admin/system/activation">Activation Logs</Link>
          </div>
        )}
      </nav>
      <Link href="/" className="admin-back">← Public platform</Link>
    </aside>
  );
}
