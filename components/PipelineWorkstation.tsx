'use client';

/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { RealProject } from '@/lib/real-romanian-data';

interface PipelineWorkstationProps {
  initialProjects: RealProject[];
}

export function PipelineWorkstation({ initialProjects }: PipelineWorkstationProps) {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [stageOverrides, setStageOverrides] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem('romanian_pipeline_overrides');
      if (saved) {
        setStageOverrides(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleStageAdvance = (projectSlug: string, currentStage: string) => {
    const stages: Array<'planning' | 'permits' | 'foundation' | 'structure' | 'facade' | 'mep' | 'finishing' | 'delivered'> = [
      'planning', 'permits', 'foundation', 'structure', 'facade', 'mep', 'finishing', 'delivered'
    ];
    const currentIndex = stages.indexOf(currentStage as any);
    const nextStage = stages[(currentIndex + 1) % stages.length];
    
    const updated = { ...stageOverrides, [projectSlug]: nextStage };
    setStageOverrides(updated);
    try {
      localStorage.setItem('romanian_pipeline_overrides', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const filteredProjects = initialProjects.filter(p => {
    const activeStage = stageOverrides[p.slug] || p.current_stage;
    if (filterType !== 'ALL' && !p.project_type.toLowerCase().includes(filterType.toLowerCase())) return false;
    if (filterStatus === 'under_construction' && p.status !== 'under_construction') return false;
    if (filterStatus === 'completed' && p.status !== 'completed' && activeStage !== 'delivered') return false;
    if (searchQuery && !`${p.name} ${p.location} ${p.developer_name} ${p.contractor_name}`.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const activeUnderConstruction = initialProjects.filter(p => p.status === 'under_construction');

  return (
    <div>
      {/* Metrics Row */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
        <div style={{ background: '#141715', padding: '12px 20px', border: '1px solid #262927', borderRadius: 4, flex: '1 1 200px' }}>
          <span style={{ fontSize: 11, color: '#888', fontWeight: 700 }}>UNDER CONSTRUCTION</span>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#c7a675' }}>{activeUnderConstruction.length} Sites</div>
        </div>
        <div style={{ background: '#141715', padding: '12px 20px', border: '1px solid #262927', borderRadius: 4, flex: '1 1 200px' }}>
          <span style={{ fontSize: 11, color: '#888', fontWeight: 700 }}>TRACKED UNITS PIPELINE</span>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>
            {activeUnderConstruction.reduce((acc, p) => acc + (p.unit_count || 0), 0).toLocaleString()} Units
          </div>
        </div>
        <div style={{ background: '#141715', padding: '12px 20px', border: '1px solid #262927', borderRadius: 4, flex: '1 1 200px' }}>
          <span style={{ fontSize: 11, color: '#888', fontWeight: 700 }}>GROSS SURFACE AREA</span>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>
            {(activeUnderConstruction.reduce((acc, p) => acc + (p.surface_area_sqm || 0), 0) / 1000).toFixed(0)}k sqm
          </div>
        </div>
      </div>

      {/* Interactive Filterbar */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          padding: 16,
          background: '#141715',
          border: '1px solid #262927',
          borderRadius: 6,
          marginBottom: 32,
          flexWrap: 'wrap',
          alignItems: 'center'
        }}
      >
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Filter by project name, developer, contractor..."
          style={{
            background: '#0e110f',
            border: '1px solid #333',
            color: '#fff',
            padding: '8px 14px',
            borderRadius: 4,
            fontSize: 13,
            flex: '1 1 220px'
          }}
        />

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button
            className={`btn ${filterType === 'ALL' ? 'fill' : ''}`}
            onClick={() => setFilterType('ALL')}
            style={{ fontSize: 11, padding: '6px 12px' }}
          >
            All Types ({initialProjects.length})
          </button>
          <button
            className={`btn ${filterType === 'Residential' ? 'fill' : ''}`}
            onClick={() => setFilterType('Residential')}
            style={{ fontSize: 11, padding: '6px 12px' }}
          >
            Residential
          </button>
          <button
            className={`btn ${filterType === 'Office' ? 'fill' : ''}`}
            onClick={() => setFilterType('Office')}
            style={{ fontSize: 11, padding: '6px 12px' }}
          >
            Office
          </button>
          <button
            className={`btn ${filterType === 'Mixed-use' ? 'fill' : ''}`}
            onClick={() => setFilterType('Mixed-use')}
            style={{ fontSize: 11, padding: '6px 12px' }}
          >
            Mixed-use
          </button>
          <button
            className={`btn ${filterType === 'Industrial' ? 'fill' : ''}`}
            onClick={() => setFilterType('Industrial')}
            style={{ fontSize: 11, padding: '6px 12px' }}
          >
            Industrial & Logistics
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#fff' }}>
          VERIFIED CONSTRUCTION PROJECTS ({filteredProjects.length})
        </h2>
        <span style={{ fontSize: 12, color: '#888' }}>
          Click &quot;Advance Stage &quot; to simulate live site progress updates
        </span>
      </div>

      {/* Grid of Projects */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
        {filteredProjects.map(p => {
          const currentStage = stageOverrides[p.slug] || p.current_stage;
          const isDelivered = currentStage === 'delivered' || p.status === 'completed';

          return (
            <div
              key={p.slug}
              style={{
                background: '#141715',
                border: '1px solid #262927',
                borderRadius: 6,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ position: 'relative', height: 170, overflow: 'hidden' }}>
                <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    background: isDelivered ? '#22c55e' : '#c7a675',
                    color: isDelivered ? '#fff' : '#000',
                    fontSize: 10,
                    fontWeight: 800,
                    padding: '4px 10px',
                    borderRadius: 3,
                    textTransform: 'uppercase'
                  }}
                >
                  STAGE: {currentStage.toUpperCase()}
                </span>
                <span
                  style={{
                    position: 'absolute',
                    bottom: 12,
                    left: 12,
                    background: 'rgba(0,0,0,0.75)',
                    color: '#fff',
                    fontSize: 11,
                    padding: '3px 8px',
                    borderRadius: 3
                  }}
                >
                  {p.location}
                </span>
              </div>

              <div style={{ padding: 20, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 11, color: '#c7a675', fontWeight: 700 }}>{p.project_type.toUpperCase()}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, margin: '4px 0 8px', color: '#fff' }}>
                    <Link href={`/projects/${p.slug}`} style={{ color: '#fff', textDecoration: 'none' }}>{p.name}</Link>
                  </h3>
                  <p style={{ fontSize: 13, color: '#aaa', lineHeight: 1.4, marginBottom: 16 }}>{p.description}</p>
                </div>

                <div style={{ borderTop: '1px solid #222523', paddingTop: 12, fontSize: 11, color: '#888' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span>Developer:</span>
                    <strong style={{ color: '#fff' }}>{p.developer_name}</strong>
                  </div>
                  {p.contractor_name && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>Contractor:</span>
                      <strong style={{ color: '#c7a675' }}>{p.contractor_name}</strong>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                    <button
                      onClick={() => handleStageAdvance(p.slug, currentStage)}
                      className="btn"
                      style={{ fontSize: 10, padding: '4px 10px', borderColor: '#c7a675', color: '#c7a675' }}
                    >
                      Advance Stage ⚡
                    </button>
                    <Link href={`/projects/${p.slug}`} style={{ color: '#fff', fontSize: 11, fontWeight: 700, textDecoration: 'none' }}>
                      DOSSIER →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
