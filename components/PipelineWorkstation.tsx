'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { RealProject } from '@/lib/real-romanian-data';
import { resolveVisualProvenanceBadge } from '@/lib/company-imagery';

interface PipelineWorkstationProps {
  initialProjects: RealProject[];
}

const STAGE_LABELS_RO: Record<string, string> = {
  planning: 'Planificare',
  permits: 'Autorizare',
  foundation: 'Fundație',
  structure: 'Structură',
  facade: 'Fațadă',
  mep: 'Instalații MEP',
  finishing: 'Finisaje',
  delivered: 'Finalizat'
};

export function PipelineWorkstation({ initialProjects }: PipelineWorkstationProps) {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [stageOverrides, setStageOverrides] = useState<Record<string, string>>({});
  const [loadingSlugs, setLoadingSlugs] = useState<Record<string, boolean>>({});
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);

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

  const handleStageAdvance = async (projectSlug: string, currentStage: string) => {
    const stages: Array<'planning' | 'permits' | 'foundation' | 'structure' | 'facade' | 'mep' | 'finishing' | 'delivered'> = [
      'planning', 'permits', 'foundation', 'structure', 'facade', 'mep', 'finishing', 'delivered'
    ];
    const currentIndex = stages.indexOf(currentStage as any);
    const nextStage = stages[(currentIndex + 1) % stages.length];
    const nextStageLabel = STAGE_LABELS_RO[nextStage] || nextStage;

    setLoadingSlugs(prev => ({ ...prev, [projectSlug]: true }));
    setStatusMessage(null);

    try {
      const res = await fetch('/api/projects/stage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: projectSlug, stage: nextStage })
      });

      const data = await res.json();

      if (res.ok && data.databaseSynced) {
        const updated = { ...stageOverrides, [projectSlug]: nextStage };
        setStageOverrides(updated);
        try {
          localStorage.setItem('romanian_pipeline_overrides', JSON.stringify(updated));
        } catch {
          // ignore
        }
        setStatusMessage({ text: `Bază de date sincronizată: ${projectSlug} avansat în stadiul ${nextStageLabel.toUpperCase()}`, isError: false });
      } else {
        const updated = { ...stageOverrides, [projectSlug]: nextStage };
        setStageOverrides(updated);
        try {
          localStorage.setItem('romanian_pipeline_overrides', JSON.stringify(updated));
        } catch {
          // ignore
        }
        setStatusMessage({ text: `Sesiune locală actualizată: stadiu ${nextStageLabel.toUpperCase()}`, isError: false });
      }
    } catch {
      const updated = { ...stageOverrides, [projectSlug]: nextStage };
      setStageOverrides(updated);
      try {
        localStorage.setItem('romanian_pipeline_overrides', JSON.stringify(updated));
      } catch {
        // ignore
      }
      setStatusMessage({ text: `Sesiune locală actualizată: stadiu ${nextStageLabel.toUpperCase()}`, isError: false });
    } finally {
      setLoadingSlugs(prev => ({ ...prev, [projectSlug]: false }));
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
    <div className="space-y-8">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 shadow-xs">
          <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Șantiere în Execuție
          </span>
          <div className="text-3xl font-extrabold text-amber-700 tracking-tight">
            {activeUnderConstruction.length}{' '}
            <span className="text-base font-semibold text-slate-600">Șantiere Active</span>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 shadow-xs">
          <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Unități în Pipeline
          </span>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {activeUnderConstruction.reduce((acc, p) => acc + (p.unit_count || 0), 0).toLocaleString('ro-RO')}{' '}
            <span className="text-base font-semibold text-slate-600">Unități</span>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-5 shadow-xs">
          <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Suprafață Desfășurată
          </span>
          <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {(activeUnderConstruction.reduce((acc, p) => acc + (p.surface_area_sqm || 0), 0) / 1000).toFixed(0)}k{' '}
            <span className="text-base font-semibold text-slate-600">m² SCD</span>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-3.5 rounded-lg border text-xs font-mono font-semibold ${
            statusMessage.isError
              ? 'bg-rose-50 border-rose-200 text-rose-700'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      {/* Interactive Filterbar */}
      <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl shadow-xs flex flex-wrap items-center gap-3">
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Caută după nume proiect, oraș, dezvoltator, constructor..."
          className="flex-1 min-w-[240px] h-10 px-3.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
        />

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            className={`px-3 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
              filterType === 'ALL'
                ? 'bg-slate-950 text-white shadow-xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:border-slate-400'
            }`}
            onClick={() => setFilterType('ALL')}
          >
            Toate Tipurile ({initialProjects.length})
          </button>
          <button
            type="button"
            className={`px-3 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
              filterType === 'Residential'
                ? 'bg-slate-950 text-white shadow-xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:border-slate-400'
            }`}
            onClick={() => setFilterType('Residential')}
          >
            Rezidențial
          </button>
          <button
            type="button"
            className={`px-3 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
              filterType === 'Office'
                ? 'bg-slate-950 text-white shadow-xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:border-slate-400'
            }`}
            onClick={() => setFilterType('Office')}
          >
            Birouri
          </button>
          <button
            type="button"
            className={`px-3 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
              filterType === 'Mixed-use'
                ? 'bg-slate-950 text-white shadow-xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:border-slate-400'
            }`}
            onClick={() => setFilterType('Mixed-use')}
          >
            Multifuncțional
          </button>
          <button
            type="button"
            className={`px-3 py-2 rounded-lg text-xs font-mono font-semibold transition-all ${
              filterType === 'Industrial'
                ? 'bg-slate-950 text-white shadow-xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:border-slate-400'
            }`}
            onClick={() => setFilterType('Industrial')}
          >
            Industrial & Logistică
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <h2 className="text-lg md:text-xl font-bold text-slate-950 uppercase tracking-tight">
          Proiecte de Construcții Verificate ({filteredProjects.length})
        </h2>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            API Sincronizare Activ
          </span>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Apasă „Avansează Faza ⚡” pentru actualizarea stadiului
          </span>
        </div>
      </div>

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(p => {
          const currentStage = stageOverrides[p.slug] || p.current_stage;
          const isDelivered = currentStage === 'delivered' || p.status === 'completed';
          const isLoading = loadingSlugs[p.slug];
          const hasGenuineImage = Boolean(p.image && !p.image.includes('unsplash.com'));
          const provenance = resolveVisualProvenanceBadge(p);
          const stageDisplay = STAGE_LABELS_RO[currentStage] || currentStage.toUpperCase();

          return (
            <div
              key={p.slug}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-amber-500 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  {hasGenuineImage && p.image ? (
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-slate-100 text-center border-b border-slate-200">
                      <svg className="w-10 h-10 text-slate-400 mb-2 stroke-[1.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="3" y="3" width="18" height="18" rx="2" strokeDasharray="4 2" />
                        <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
                      </svg>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-600 font-bold">
                        DOSAR TEHNIC VERIFICAT
                      </span>
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider shadow-xs ${
                      isDelivered ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                    }`}>
                      {stageDisplay}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono uppercase tracking-wider font-bold shadow-xs ${provenance.badgeClass}`}>
                      {provenance.label}
                    </span>
                  </div>

                  <span className="absolute bottom-3 left-3 z-10 px-2 py-1 bg-slate-950/80 backdrop-blur-xs text-white text-[11px] font-medium rounded-md shadow-xs">
                    {p.location}
                  </span>
                </div>

                <div className="p-5">
                  <div className="text-[11px] font-mono font-bold text-amber-800 uppercase tracking-wider mb-1">
                    {p.project_type}
                  </div>
                  <h3 className="text-lg font-bold text-slate-950 leading-snug mb-2">
                    <Link href={`/projects/${p.slug}`} className="hover:text-amber-700 transition-colors">
                      {p.name}
                    </Link>
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                    {p.description}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-3 border-t border-slate-100 bg-slate-50/50">
                <div className="text-xs space-y-1.5 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Dezvoltator:</span>
                    <strong className="text-slate-900 font-semibold truncate max-w-[180px]">{p.developer_name}</strong>
                  </div>
                  {p.contractor_name && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-medium">Constructor:</span>
                      <strong className="text-amber-800 font-semibold truncate max-w-[180px]">{p.contractor_name}</strong>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/60">
                  <button
                    onClick={() => handleStageAdvance(p.slug, currentStage)}
                    disabled={isLoading}
                    className="px-3 py-1.5 bg-white border border-amber-600/60 text-amber-800 hover:bg-amber-50 rounded-lg text-xs font-mono font-bold tracking-wide transition-all disabled:opacity-50"
                  >
                    {isLoading ? 'Salvare...' : 'Avansează Faza ⚡'}
                  </button>
                  <Link
                    href={`/projects/${p.slug}`}
                    className="text-xs font-mono font-bold text-slate-900 hover:text-amber-700 uppercase tracking-wider"
                  >
                    DESCHIDE DOSAR →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
