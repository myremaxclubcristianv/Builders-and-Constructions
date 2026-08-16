'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';

type Campaign = {
  id: string;
  name: string;
  description?: string | null;
  target_type?: string | null;
  target_city?: string | null;
  matched_companies_count: number;
  contacted_count: number;
  proposal_count: number;
  won_count: number;
};

export function CampaignsDashboardView({ campaigns: initialCampaigns }: { campaigns: Campaign[] }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetType, setTargetType] = useState('Construction Company');
  const [targetCity, setTargetCity] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  async function handleCreateCampaign(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    const res = await fetch('/api/admin/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.trim(),
        description: description.trim() || null,
        target_type: targetType,
        target_city: targetCity.trim() || null
      })
    });

    if (res.ok) {
      const newCamp = await res.json();
      setCampaigns([
        {
          ...newCamp,
          matched_companies_count: 5,
          contacted_count: 0,
          proposal_count: 0,
          won_count: 0
        },
        ...campaigns
      ]);
      setName('');
      setDescription('');
      setShowCreate(false);
    }
  }

  async function handleDeleteCampaign(id: string) {
    if (!window.confirm('Delete this target campaign?')) return;
    await fetch(`/api/admin/campaigns?id=${id}`, { method: 'DELETE' });
    setCampaigns(campaigns.filter(c => c.id !== id));
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <div>
          <div className="eyebrow" style={{ color: '#d4af37' }}>
            Niche Targeting & Segment Intelligence
          </div>
          <h1 className="admin-title" style={{ margin: '4px 0 0 0' }}>
            TARGET CAMPAIGNS & SEGMENTS
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            type="button"
            className="btn fill"
            onClick={() => setShowCreate(!showCreate)}
          >
            {showCreate ? 'Cancel' : '+ Create Target Campaign'}
          </button>
        </div>
      </div>

      {showCreate && (
        <form onSubmit={handleCreateCampaign} className="form-grid admin-panel" style={{ marginBottom: 28, background: '#141715', border: '1px solid #d4af37' }}>
          <div className="full">
            <span className="form-label">Campaign Name *</span>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Cluj General Contractors — Weak SEO & Missing Video" required />
          </div>

          <label>
            <span className="form-label">Target Company Classification</span>
            <select value={targetType} onChange={e => setTargetType(e.target.value)}>
              <option value="Construction Company">Construction Company</option>
              <option value="Developer">Developer</option>
              <option value="General Contractor">General Contractor</option>
              <option value="Engineering">Engineering</option>
              <option value="Architecture">Architecture</option>
              <option value="Specialist Contractor">Specialist Contractor</option>
            </select>
          </label>

          <label>
            <span className="form-label">Target City / Region</span>
            <input value={targetCity} onChange={e => setTargetCity(e.target.value)} placeholder="e.g. Bucharest, Cluj, Timișoara" />
          </label>

          <label className="full">
            <span className="form-label">Strategic Pitch Objective</span>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} placeholder="Focus on presenting their active construction developments directly to institutional developers…" />
          </label>

          <div className="full">
            <button type="submit" className="btn fill">
              Save Target Campaign
            </button>
          </div>
        </form>
      )}

      {/* Campaigns Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
        {campaigns.map(camp => (
          <div
            key={camp.id}
            style={{
              background: '#141715',
              border: '1px solid #262927',
              borderRadius: 8,
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="eyebrow" style={{ color: '#d4af37' }}>
                  {camp.target_type || 'Industry Segment'} {camp.target_city ? `· ${camp.target_city}` : ''}
                </span>
                <button
                  type="button"
                  className="btn"
                  style={{ padding: '2px 6px', fontSize: 10, color: '#888' }}
                  onClick={() => handleDeleteCampaign(camp.id)}
                >
                  ✕
                </button>
              </div>

              <h3 style={{ fontSize: 18, color: '#fff', margin: '8px 0 6px 0' }}>{camp.name}</h3>
              {camp.description && <p style={{ fontSize: 13, color: '#aaa9a1', lineHeight: 1.5, marginBottom: 16 }}>{camp.description}</p>}

              {/* Pipeline Progress Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 16, background: '#0d0f0e', padding: 12, borderRadius: 6, textAlign: 'center' }}>
                <div>
                  <span className="eyebrow" style={{ fontSize: 9 }}>MATCHED</span>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{camp.matched_companies_count}</div>
                </div>
                <div>
                  <span className="eyebrow" style={{ fontSize: 9 }}>CONTACTED</span>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#d4af37' }}>{camp.contacted_count}</div>
                </div>
                <div>
                  <span className="eyebrow" style={{ fontSize: 9 }}>PROPOSALS</span>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#fde047' }}>{camp.proposal_count}</div>
                </div>
                <div>
                  <span className="eyebrow" style={{ fontSize: 9, color: '#86efac' }}>WON</span>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#86efac' }}>{camp.won_count}</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <Link href="/admin/prospects" className="btn fill" style={{ width: '100%', textAlign: 'center', fontSize: 12 }}>
                View Matched Prospects →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
