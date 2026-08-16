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

        {/* COMMAND CENTER */}
        {sales && (
          <div className="admin-nav-section" style={{ marginTop: '0.75rem' }}>
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', padding: '0.35rem 0.5rem', fontWeight: 700 }}>
              Command Center
            </div>
            <Link href="/admin/acquisition">Acquisition Hub</Link>
            <Link href="/admin/acquisition/today">Daily Queue</Link>
            <Link href="/admin/acquisition/radar">Opportunity Radar</Link>
            <Link href="/admin/commercial">Commercial Overview</Link>
          </div>
        )}

        {/* MARKET INTELLIGENCE */}
        <div className="admin-nav-section" style={{ marginTop: '0.75rem' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', padding: '0.35rem 0.5rem', fontWeight: 700 }}>
            Market Intelligence
          </div>
          {editorial && <Link href="/admin/research">Research Queue</Link>}
          {sales && (
            <>
              <Link href="/admin/prospects/activation">Prospect Activation</Link>
              <Link href="/admin/prospects">Prospects</Link>
              <Link href="/admin/campaigns">Campaigns</Link>
              <Link href="/admin/market">Market Intelligence</Link>
              <Link href="/admin/market/activity">Activity Feed</Link>
              <Link href="/admin/market/coverage">Coverage</Link>
            </>
          )}
          {editorial && <Link href="/admin/discovery">Discovery Ingestion</Link>}
        </div>

        {/* CONTENT */}
        {editorial && (
          <div className="admin-nav-section" style={{ marginTop: '0.75rem' }}>
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', padding: '0.35rem 0.5rem', fontWeight: 700 }}>
              Content
            </div>
            <Link href="/admin/companies">Companies</Link>
            <Link href="/admin/projects">Projects</Link>
            <Link href="/admin/editorial">Editorial</Link>
          </div>
        )}

        {/* SALES */}
        {sales && (
          <div className="admin-nav-section" style={{ marginTop: '0.75rem' }}>
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', padding: '0.35rem 0.5rem', fontWeight: 700 }}>
              Sales
            </div>
            <Link href="/admin/opportunities">Opportunities</Link>
            <Link href="/admin/leads">Leads</Link>
            <Link href="/admin/claims">Claims</Link>
          </div>
        )}

        {/* SYSTEM */}
        <div className="admin-nav-section" style={{ marginTop: '0.75rem' }}>
          <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', padding: '0.35rem 0.5rem', fontWeight: 700 }}>
            System
          </div>
          {sales && <Link href="/admin/analytics">Analytics</Link>}
          {editorial && (
            <>
              <Link href="/admin/quality">Data Quality</Link>
              <Link href="/admin/sources">Source Registry</Link>
              <Link href="/admin/import">CSV Import</Link>
            </>
          )}
          {isAdmin && <Link href="/admin/system">System Health</Link>}
        </div>
      </nav>
      <Link href="/" className="admin-back">← Public platform</Link>
    </aside>
  );
}
