'use client';

import {ChangeEvent, FormEvent, useState} from 'react';

export type MediaItem = {
  id: string;
  storage_key: string;
  filename?: string | null;
  file_type?: string | null;
  file_size?: number | null;
  media_type: string;
  alt_text?: string | null;
  caption?: string | null;
  credit?: string | null;
  source?: string | null;
  is_hero: boolean;
  sort_order: number;
  created_at: string;
};

export function getPublicStorageUrl(storageKey: string): string {
  if (!storageKey) return '';
  if (storageKey.startsWith('http')) return storageKey;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  if (!supabaseUrl) return '';
  const parts = storageKey.split('/');
  const bucket = parts[0];
  const path = parts.slice(1).join('/');
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}

export function MediaManager({
  entityType,
  entityId,
  initialMedia = []
}: {
  entityType: 'companies' | 'projects' | 'editorial';
  entityId: string;
  initialMedia: MediaItem[];
}) {
  const [items, setItems] = useState<MediaItem[]>(initialMedia);
  const [notice, setNotice] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; msg: string }>({
    type: 'idle',
    msg: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isHeroCheck, setIsHeroCheck] = useState(false);
  const [altText, setAltText] = useState('');
  const [caption, setCaption] = useState('');
  const [credit, setCredit] = useState('');
  const [source, setSource] = useState('');
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'application/pdf'];
  const maxSizeBytes = 15 * 1024 * 1024;

  function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      setNotice({ type: 'error', msg: 'Unsupported file type. Please upload JPEG, PNG, WEBP, AVIF, or PDF.' });
      e.target.value = '';
      setSelectedFile(null);
      return;
    }

    if (file.size > maxSizeBytes) {
      setNotice({ type: 'error', msg: 'File exceeds 15MB limit.' });
      e.target.value = '';
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setNotice({ type: 'idle', msg: '' });
  }

  async function handleUpload(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedFile) {
      setNotice({ type: 'error', msg: 'Please select a file to upload.' });
      return;
    }

    setNotice({ type: 'loading', msg: 'Uploading and processing media…' });

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('entityType', entityType);
    formData.append('entityId', entityId);
    formData.append('altText', altText);
    formData.append('caption', caption);
    formData.append('credit', credit);
    formData.append('source', source);
    formData.append('isHero', String(isHeroCheck));

    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice({ type: 'error', msg: data.error || 'Upload failed.' });
        return;
      }

      let updatedList = [...items];
      if (isHeroCheck) {
        updatedList = updatedList.map(item => ({ ...item, is_hero: false }));
      }
      updatedList.push(data);
      updatedList.sort((a, b) => (b.is_hero ? 1 : 0) - (a.is_hero ? 1 : 0) || a.sort_order - b.sort_order);

      setItems(updatedList);
      setNotice({ type: 'success', msg: 'Media uploaded and linked successfully.' });
      setSelectedFile(null);
      setAltText('');
      setCaption('');
      setCredit('');
      setSource('');
      setIsHeroCheck(false);
      e.currentTarget.reset();
    } catch {
      setNotice({ type: 'error', msg: 'Network error occurred during upload.' });
    }
  }

  async function setAsHero(targetItem: MediaItem) {
    setNotice({ type: 'loading', msg: 'Setting primary hero image…' });
    try {
      const res = await fetch('/api/admin/media', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: targetItem.id,
          isHero: true,
          entityType,
          entityId
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice({ type: 'error', msg: data.error || 'Failed to set hero.' });
        return;
      }

      setItems(
        items.map(item => ({
          ...item,
          is_hero: item.id === targetItem.id
        }))
      );
      setNotice({ type: 'success', msg: 'Hero image updated atomically.' });
    } catch {
      setNotice({ type: 'error', msg: 'Error setting hero image.' });
    }
  }

  async function moveItem(index: number, direction: 'up' | 'down') {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const newItems = [...items];
    const current = newItems[index];
    const adjacent = newItems[targetIndex];

    const currentOrder = current.sort_order;
    const adjacentOrder = adjacent.sort_order;

    current.sort_order = adjacentOrder;
    adjacent.sort_order = currentOrder;

    newItems[index] = adjacent;
    newItems[targetIndex] = current;

    setItems(newItems);

    try {
      await Promise.all([
        fetch('/api/admin/media', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: current.id, sortOrder: current.sort_order })
        }),
        fetch('/api/admin/media', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: adjacent.id, sortOrder: adjacent.sort_order })
        })
      ]);
    } catch {
      setNotice({ type: 'error', msg: 'Failed to persist media ordering.' });
    }
  }

  async function saveMetadata(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingItem) return;

    setNotice({ type: 'loading', msg: 'Updating metadata…' });
    try {
      const res = await fetch('/api/admin/media', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingItem.id,
          altText: editingItem.alt_text,
          caption: editingItem.caption,
          credit: editingItem.credit,
          source: editingItem.source
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice({ type: 'error', msg: data.error || 'Failed to update metadata.' });
        return;
      }

      setItems(items.map(item => (item.id === editingItem.id ? { ...item, ...editingItem } : item)));
      setEditingItem(null);
      setNotice({ type: 'success', msg: 'Media metadata updated.' });
    } catch {
      setNotice({ type: 'error', msg: 'Failed to update metadata.' });
    }
  }

  async function deleteMedia(item: MediaItem) {
    if (!window.confirm(`Are you sure you want to delete this media item (${item.filename || 'file'})?`)) {
      return;
    }

    setNotice({ type: 'loading', msg: 'Deleting media item…' });
    try {
      const res = await fetch(`/api/admin/media?id=${item.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        setNotice({ type: 'error', msg: data.error || 'Failed to delete media.' });
        return;
      }

      setItems(items.filter(x => x.id !== item.id));
      setNotice({ type: 'success', msg: 'Media item removed.' });
    } catch {
      setNotice({ type: 'error', msg: 'Network error deleting media.' });
    }
  }

  return (
    <section className="admin-panel" style={{ marginTop: 24 }}>
      <div className="section-head">
        <div>
          <div className="eyebrow">Visual Assets</div>
          <h2 style={{ marginTop: 6 }}>MEDIA MANAGEMENT</h2>
        </div>
      </div>

      {notice.msg && (
        <div
          style={{
            padding: '10px 14px',
            marginBottom: 16,
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

      {/* Media Grid / Gallery List */}
      {items.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
            marginBottom: 24
          }}
        >
          {items.map((item, idx) => {
            const url = getPublicStorageUrl(item.storage_key);
            const isImage = item.media_type === 'image';
            return (
              <div
                key={item.id}
                style={{
                  background: '#141715',
                  border: item.is_hero ? '1px solid #d4af37' : '1px solid #262927',
                  borderRadius: 6,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div
                  style={{
                    height: 160,
                    background: '#0a0c0b',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {isImage && url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={url}
                      alt={item.alt_text || 'Media preview'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ textAlign: 'center', padding: 16, color: '#aaa9a1' }}>
                      <span style={{ fontSize: 24, display: 'block', marginBottom: 4 }}>📄</span>
                      <span style={{ fontSize: 12 }}>{item.filename || 'Document'}</span>
                    </div>
                  )}
                  {item.is_hero && (
                    <span
                      style={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        background: '#d4af37',
                        color: '#000',
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 3,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}
                    >
                      Primary Hero
                    </span>
                  )}
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      background: 'rgba(0,0,0,0.7)',
                      color: '#fff',
                      fontSize: 11,
                      padding: '2px 6px',
                      borderRadius: 3
                    }}
                  >
                    #{idx + 1}
                  </span>
                </div>

                <div style={{ padding: 14, flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', wordBreak: 'break-all' }}>
                    {item.filename || item.storage_key.split('/').pop()}
                  </div>
                  {item.caption && <p style={{ fontSize: 12, color: '#b9b6ae', margin: 0 }}>Caption: {item.caption}</p>}
                  {item.credit && <p style={{ fontSize: 11, color: '#888', margin: 0 }}>Credit: {item.credit}</p>}
                  {item.source && <p style={{ fontSize: 11, color: '#888', margin: 0 }}>Source: {item.source}</p>}

                  <div style={{ marginTop: 'auto', paddingTop: 10, borderTop: '1px solid #222', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {!item.is_hero && (
                      <button
                        type="button"
                        className="btn"
                        style={{ padding: '3px 8px', fontSize: 11 }}
                        onClick={() => setAsHero(item)}
                      >
                        Set as hero
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn"
                      style={{ padding: '3px 8px', fontSize: 11 }}
                      disabled={idx === 0}
                      onClick={() => moveItem(idx, 'up')}
                    >
                      ↑ Up
                    </button>
                    <button
                      type="button"
                      className="btn"
                      style={{ padding: '3px 8px', fontSize: 11 }}
                      disabled={idx === items.length - 1}
                      onClick={() => moveItem(idx, 'down')}
                    >
                      ↓ Down
                    </button>
                    <button
                      type="button"
                      className="btn"
                      style={{ padding: '3px 8px', fontSize: 11 }}
                      onClick={() => setEditingItem(item)}
                    >
                      Edit info
                    </button>
                    <button
                      type="button"
                      className="btn"
                      style={{ padding: '3px 8px', fontSize: 11, color: '#fca5a5' }}
                      onClick={() => deleteMedia(item)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="empty" style={{ padding: '16px 0' }}>
          No visual media uploaded yet for this {entityType.replace(/s$/, '')}.
        </p>
      )}

      {/* Edit Metadata Modal */}
      {editingItem && (
        <div
          style={{
            background: '#1a1d1b',
            border: '1px solid #333',
            borderRadius: 6,
            padding: 20,
            marginBottom: 24
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h4 style={{ margin: 0, fontSize: 15, color: '#fff' }}>Edit Media Information</h4>
            <button
              type="button"
              className="btn"
              style={{ padding: '2px 8px', fontSize: 11 }}
              onClick={() => setEditingItem(null)}
            >
              Close
            </button>
          </div>
          <form onSubmit={saveMetadata} className="form-grid">
            <label>
              <span className="form-label">Alt Text (Accessibility)</span>
              <input
                value={editingItem.alt_text || ''}
                onChange={e => setEditingItem({ ...editingItem, alt_text: e.target.value })}
                placeholder="Descriptive text of the image"
              />
            </label>
            <label>
              <span className="form-label">Caption</span>
              <input
                value={editingItem.caption || ''}
                onChange={e => setEditingItem({ ...editingItem, caption: e.target.value })}
                placeholder="Editorial caption"
              />
            </label>
            <label>
              <span className="form-label">Photo / Video Credit</span>
              <input
                value={editingItem.credit || ''}
                onChange={e => setEditingItem({ ...editingItem, credit: e.target.value })}
                placeholder="Photographer or agency"
              />
            </label>
            <label>
              <span className="form-label">Verified Source</span>
              <input
                value={editingItem.source || ''}
                onChange={e => setEditingItem({ ...editingItem, source: e.target.value })}
                placeholder="Official press release or portfolio URL"
              />
            </label>
            <div className="full" style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button type="submit" className="btn fill" disabled={notice.type === 'loading'}>
                Save Metadata
              </button>
              <button type="button" className="btn" onClick={() => setEditingItem(null)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Upload Form */}
      <form onSubmit={handleUpload} className="form-grid" style={{ borderTop: '1px solid #222', paddingTop: 20 }}>
        <div className="full">
          <h3 style={{ fontSize: 14, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 12, color: '#e5e5e5' }}>
            Upload Media Asset
          </h3>
        </div>
        <label className="full">
          <span className="form-label">Select File (JPEG, PNG, WEBP, AVIF, PDF - Max 15MB)</span>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.avif,.pdf"
            onChange={handleFileSelect}
            style={{ padding: '8px 0' }}
          />
        </label>
        <label>
          <span className="form-label">Alt Text</span>
          <input
            value={altText}
            onChange={e => setAltText(e.target.value)}
            placeholder="Accessibility description"
          />
        </label>
        <label>
          <span className="form-label">Caption</span>
          <input
            value={caption}
            onChange={e => setCaption(e.target.value)}
            placeholder="Display caption"
          />
        </label>
        <label>
          <span className="form-label">Credit</span>
          <input
            value={credit}
            onChange={e => setCredit(e.target.value)}
            placeholder="Photo / video credit"
          />
        </label>
        <label>
          <span className="form-label">Source URL</span>
          <input
            value={source}
            onChange={e => setSource(e.target.value)}
            placeholder="Source link or origin"
          />
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 24 }}>
          <input
            type="checkbox"
            checked={isHeroCheck}
            onChange={e => setIsHeroCheck(e.target.checked)}
          />
          <span className="form-label" style={{ margin: 0 }}>
            Set as Primary Hero Image
          </span>
        </label>
        <div className="full" style={{ marginTop: 8 }}>
          <button
            type="submit"
            className="btn fill"
            disabled={!selectedFile || notice.type === 'loading'}
          >
            {notice.type === 'loading' ? 'Uploading…' : 'Upload Asset'}
          </button>
        </div>
      </form>
    </section>
  );
}
