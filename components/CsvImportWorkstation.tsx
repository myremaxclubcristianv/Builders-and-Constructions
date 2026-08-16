'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';

type ValidatedRow = {
  rowIndex: number;
  name: string;
  slug: string;
  type: string;
  location: string;
  website: string;
  description: string;
  status: string;
  rowStatus: 'valid' | 'warning' | 'error' | 'duplicate';
  errors: string[];
  warnings: string[];
  duplicateMatch?: { id: string; name: string } | null;
};

const SAMPLE_COMPANY_CSV = `name,type,location,website,description
Bog'Art,General Contractor,Bucharest,https://bogart.ro,Leading Romanian general contractor specializing in institutional and commercial developments.
Erbașu Construcții,Construction Company,Bucharest,https://erbasu.ro,Pioneering engineering and civil construction practice founded in 1990.
Strabag Romania,General Contractor,Bucharest,https://strabag.ro,European technology group for construction services.`;

const SAMPLE_PROJECT_CSV = `name,type,location,status,description
One Floreasca Towers,Mixed-Use,Bucharest,Under construction,Iconic residential and commercial masterplan development in Floreasca.
Atelier Residence,Residential,Cluj-Napoca,Completed,Bespoke modern architectural residence delivered to high sustainability standards.`;

export function CsvImportWorkstation() {
  const [entityType, setEntityType] = useState<'company' | 'project'>('company');
  const [rawCsv, setRawCsv] = useState(SAMPLE_COMPANY_CSV);
  const [previewRows, setPreviewRows] = useState<ValidatedRow[]>([]);
  const [summary, setSummary] = useState<{ total: number; validCount: number; warningCount: number; duplicateCount: number; errorCount: number } | null>(null);

  const [notice, setNotice] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; msg: string }>({
    type: 'idle',
    msg: ''
  });

  function parseCsvString(text: string) {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
    return lines.slice(1).map(line => {
      const vals = line.split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => {
        obj[h] = vals[i] || '';
      });
      return obj;
    });
  }

  async function handlePreview(e: FormEvent) {
    e.preventDefault();
    const rows = parseCsvString(rawCsv);
    if (rows.length === 0) {
      setNotice({ type: 'error', msg: 'CSV text must contain headers and at least one data row.' });
      return;
    }

    setNotice({ type: 'loading', msg: 'Parsing and running duplicate detection algorithms…' });
    try {
      const res = await fetch('/api/admin/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityType,
          rawRows: rows,
          action: 'preview'
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setNotice({ type: 'error', msg: data.error || 'Failed to preview CSV.' });
        return;
      }

      setPreviewRows(data.rows || []);
      setSummary({
        total: data.total,
        validCount: data.validCount,
        warningCount: data.warningCount,
        duplicateCount: data.duplicateCount,
        errorCount: data.errorCount
      });
      setNotice({ type: 'success', msg: `Validated ${data.total} records. Ready for import.` });
    } catch {
      setNotice({ type: 'error', msg: 'Network error parsing CSV.' });
    }
  }

  async function handleConfirmImport() {
    const rows = parseCsvString(rawCsv);
    setNotice({ type: 'loading', msg: 'Importing validated records as Draft & Unverified…' });

    try {
      const res = await fetch('/api/admin/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityType,
          rawRows: rows,
          action: 'confirm'
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setNotice({ type: 'error', msg: data.error || 'Failed to import records.' });
        return;
      }

      setNotice({ type: 'success', msg: `Successfully imported ${data.importedCount} ${entityType} records!` });
      setPreviewRows([]);
      setSummary(null);
    } catch {
      setNotice({ type: 'error', msg: 'Network error confirming import.' });
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
        <div>
          <div className="eyebrow" style={{ color: '#d4af37' }}>
            Data Ingestion & Integrity Engine
          </div>
          <h1 className="admin-title" style={{ margin: '4px 0 0 0' }}>
            REAL DATA CSV IMPORT & DUPLICATE DETECTION
          </h1>
        </div>
        <Link href="/admin/research" className="btn">
          ← Back to Research Queue
        </Link>
      </div>

      {notice.msg && (
        <div
          style={{
            padding: '10px 14px',
            marginBottom: 20,
            fontSize: 13,
            borderRadius: 4,
            background: notice.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            color: notice.type === 'error' ? '#fca5a5' : '#86efac',
            border: `1px solid ${notice.type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
          }}
        >
          {notice.msg}
        </div>
      )}

      {/* Entity Selector */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button
          type="button"
          className="btn"
          style={{ background: entityType === 'company' ? '#d4af37' : '#141715', color: entityType === 'company' ? '#000' : '#fff', fontWeight: 700 }}
          onClick={() => {
            setEntityType('company');
            setRawCsv(SAMPLE_COMPANY_CSV);
            setPreviewRows([]);
            setSummary(null);
          }}
        >
          Import Companies CSV
        </button>
        <button
          type="button"
          className="btn"
          style={{ background: entityType === 'project' ? '#d4af37' : '#141715', color: entityType === 'project' ? '#000' : '#fff', fontWeight: 700 }}
          onClick={() => {
            setEntityType('project');
            setRawCsv(SAMPLE_PROJECT_CSV);
            setPreviewRows([]);
            setSummary(null);
          }}
        >
          Import Projects CSV
        </button>
      </div>

      <form onSubmit={handlePreview} className="form-grid admin-panel" style={{ marginBottom: 24 }}>
        <div className="full">
          <span className="form-label">Paste CSV Content or Sample Data</span>
          <textarea
            rows={8}
            value={rawCsv}
            onChange={e => setRawCsv(e.target.value)}
            style={{ fontFamily: 'monospace', fontSize: 12 }}
            required
          />
        </div>

        <div className="full">
          <button type="submit" className="btn fill" disabled={notice.type === 'loading'}>
            Run Validation & Duplicate Check →
          </button>
        </div>
      </form>

      {/* Validation Summary & Preview */}
      {summary && (
        <section className="admin-panel" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
            <div>
              <div className="eyebrow">Ingestion Gatekeeper</div>
              <h2 style={{ fontSize: 18, margin: '4px 0 0 0' }}>IMPORT PREVIEW & VALIDATION SUMMARY</h2>
            </div>
            <button
              type="button"
              className="btn fill"
              style={{ background: '#86efac', color: '#000', fontWeight: 800 }}
              onClick={handleConfirmImport}
              disabled={notice.type === 'loading'}
            >
              ✓ Confirm & Import Validated Records
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 20 }}>
            <div className="metric">
              <span className="eyebrow">TOTAL ROWS</span>
              <strong>{summary.total}</strong>
            </div>
            <div className="metric" style={{ borderColor: '#86efac' }}>
              <span className="eyebrow" style={{ color: '#86efac' }}>VALID</span>
              <strong style={{ color: '#86efac' }}>{summary.validCount}</strong>
            </div>
            <div className="metric" style={{ borderColor: '#fde047' }}>
              <span className="eyebrow" style={{ color: '#fde047' }}>POSSIBLE DUPLICATES</span>
              <strong style={{ color: '#fde047' }}>{summary.duplicateCount}</strong>
            </div>
            <div className="metric" style={{ borderColor: '#ef4444' }}>
              <span className="eyebrow" style={{ color: '#fca5a5' }}>ERRORS</span>
              <strong style={{ color: '#fca5a5' }}>{summary.errorCount}</strong>
            </div>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Type</th>
                <th>Location</th>
                <th>Validation Status</th>
                <th>Notes / Duplicates</th>
              </tr>
            </thead>
            <tbody>
              {previewRows.map(r => (
                <tr key={r.rowIndex}>
                  <td>{r.rowIndex}</td>
                  <td>
                    <strong>{r.name}</strong>
                    {r.website && <div style={{ fontSize: 11, color: '#888' }}>{r.website}</div>}
                  </td>
                  <td>{r.type}</td>
                  <td>{r.location}</td>
                  <td>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '2px 6px',
                        borderRadius: 3,
                        background:
                          r.rowStatus === 'valid'
                            ? 'rgba(16,185,129,0.2)'
                            : r.rowStatus === 'duplicate'
                            ? 'rgba(253,224,71,0.2)'
                            : 'rgba(239,68,68,0.2)',
                        color:
                          r.rowStatus === 'valid'
                            ? '#86efac'
                            : r.rowStatus === 'duplicate'
                            ? '#fde047'
                            : '#fca5a5'
                      }}
                    >
                      {r.rowStatus}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: '#ccc' }}>
                    {r.warnings.join(', ') || r.errors.join(', ') || 'Ready for draft creation'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
