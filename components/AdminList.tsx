import Link from 'next/link';

export function AdminList({
  title,
  rows,
  columns,
  newHref,
  itemHref,
  itemAction = 'Edit →',
  itemSuffix = ''
}: {
  title: string;
  rows: Record<string, unknown>[];
  columns: { key: string; label: string }[];
  newHref?: string;
  itemHref?: string;
  itemAction?: string;
  itemSuffix?: string;
}) {
  return (
    <>
      <div className="eyebrow">Management</div>
      <div className="admin-toolbar">
        <h1 className="admin-title">{title}</h1>
        {newHref && (
          <Link className="btn fill" href={newHref}>
            + Add New
          </Link>
        )}
      </div>
      <section className="admin-panel">
        {rows.length ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  {columns.map(c => (
                    <th key={c.key}>{c.label}</th>
                  ))}
                  {itemHref && <th style={{ textAlign: 'right' }}>Action</th>}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={String(row.id || row.company_id || i)}>
                    {columns.map(c => {
                      const val = row[c.key];
                      let display: React.ReactNode = '—';
                      if (typeof val === 'boolean') {
                        display = val ? 'Yes' : 'No';
                      } else if (Array.isArray(val)) {
                        display = val.join(', ') || '—';
                      } else if (val !== null && val !== undefined && val !== '') {
                        display = String(val);
                      }
                      return <td key={c.key}>{display}</td>;
                    })}
                    {itemHref && (
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <Link
                          className="link-arrow"
                          href={`${itemHref}/${row.id || row.company_id}${itemSuffix}`}
                          style={{ fontSize: 13 }}
                        >
                          {itemAction}
                        </Link>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="empty">No records found.</p>
        )}
      </section>
    </>
  );
}
