'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { realCompaniesDataset, realProjectsDataset } from '@/lib/real-romanian-data';

interface DealItem {
  id: string;
  entityType: 'company' | 'project';
  entitySlug: string;
  name: string;
  stage: 'WATCHING' | 'QUALIFYING' | 'RESEARCHING' | 'PRIORITY' | 'OUTREACH' | 'ENGAGED' | 'ACTIVE' | 'WON' | 'LOST' | 'ARCHIVED';
  note: string;
  nextAction: string;
  updatedAt: string;
}

const STAGES: DealItem['stage'][] = [
  'WATCHING',
  'QUALIFYING',
  'RESEARCHING',
  'PRIORITY',
  'OUTREACH',
  'ENGAGED',
  'ACTIVE',
  'WON',
  'LOST',
  'ARCHIVED'
];

export default function DealflowPage() {
  const [deals, setDeals] = useState<DealItem[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<string>('');
  const [selectedStage, setSelectedStage] = useState<DealItem['stage']>('QUALIFYING');
  const [note, setNote] = useState<string>('');
  const [nextAction, setNextAction] = useState<string>('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('romanian_dealflow_memory');
      if (saved) {
        setDeals(JSON.parse(saved));
      } else {
        // Initialize with default sample deal derived from verified data
        const initialDeals: DealItem[] = [
          {
            id: 'deal-1',
            entityType: 'company',
            entitySlug: 'one-united-properties',
            name: 'One United Properties',
            stage: 'PRIORITY',
            note: 'Multi-site residential and office expansion in Bucharest Sector 2.',
            nextAction: 'Review Q3 financial disclosures',
            updatedAt: new Date().toISOString()
          },
          {
            id: 'deal-2',
            entityType: 'project',
            entitySlug: 'cloud-9-residence-bucharest',
            name: 'Cloud 9 Residence Bucharest',
            stage: 'QUALIFYING',
            note: 'General contractor role unindexed in primary registry.',
            nextAction: 'Investigate subcontractor participation',
            updatedAt: new Date().toISOString()
          }
        ];
        setDeals(initialDeals);
        localStorage.setItem('romanian_dealflow_memory', JSON.stringify(initialDeals));
      }
    } catch {
      // client memory fallback
    }
  }, []);

  const saveDealsToMemory = (updated: DealItem[]) => {
    setDeals(updated);
    try {
      localStorage.setItem('romanian_dealflow_memory', JSON.stringify(updated));
    } catch {
      // client memory fallback
    }
  };

  const handleAddDeal = () => {
    if (!selectedEntity) return;
    const isCompany = realCompaniesDataset.some(c => c.slug === selectedEntity);
    const companyObj = realCompaniesDataset.find(c => c.slug === selectedEntity);
    const projectObj = realProjectsDataset.find(p => p.slug === selectedEntity);

    const name = companyObj ? companyObj.name : projectObj ? projectObj.name : selectedEntity;
    const entityType = isCompany ? 'company' : 'project';

    const newDeal: DealItem = {
      id: `deal-${Date.now()}`,
      entityType,
      entitySlug: selectedEntity,
      name,
      stage: selectedStage,
      note,
      nextAction: nextAction || 'Verify latest project disclosure',
      updatedAt: new Date().toISOString()
    };

    const updated = [newDeal, ...deals.filter(d => d.entitySlug !== selectedEntity)];
    saveDealsToMemory(updated);

    setSelectedEntity('');
    setNote('');
    setNextAction('');
  };

  const handleUpdateStage = (id: string, stage: DealItem['stage']) => {
    const updated = deals.map(d => (d.id === id ? { ...d, stage, updatedAt: new Date().toISOString() } : d));
    saveDealsToMemory(updated);
  };

  const handleRemoveDeal = (id: string) => {
    const updated = deals.filter(d => d.id !== id);
    saveDealsToMemory(updated);
  };

  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <SiteHeader />

      <main className="pt-20">
        <section className="py-10 md:py-16 border-b border-[#1A1D1B] bg-[#0B0B0B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block">
              Private Commercial Deal-Flow Workstation
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              DEAL-FLOW WORKSTATION
            </h1>
            <p className="text-sm md:text-base text-[#A0A0A0] max-w-2xl leading-relaxed">
              Track commercial opportunities, research status, private notes, and next actions stored securely in your isolated browser memory. Zero cross-user data leakage.
            </p>
          </div>
        </section>

        <section className="py-10 md:py-16">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-10">
            {/* Add Deal Form */}
            <div className="p-6 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-4">
              <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest block font-bold">
                + ADD ENTITY TO PRIVATE DEAL-FLOW
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-[#888888] block mb-1">SELECT ENTITY</label>
                  <select
                    value={selectedEntity}
                    onChange={e => setSelectedEntity(e.target.value)}
                    className="w-full bg-[#050505] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white focus:border-[#C9A227] outline-none"
                  >
                    <option value="">-- Choose Company or Project --</option>
                    <optgroup label="Companies">
                      {realCompaniesDataset.map(c => (
                        <option key={c.slug} value={c.slug}>
                          [Company] {c.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Projects">
                      {realProjectsDataset.map(p => (
                        <option key={p.slug} value={p.slug}>
                          [Project] {p.name}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-[#888888] block mb-1">DEAL STAGE</label>
                  <select
                    value={selectedStage}
                    onChange={e => setSelectedStage(e.target.value as DealItem['stage'])}
                    className="w-full bg-[#050505] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white focus:border-[#C9A227] outline-none"
                  >
                    {STAGES.map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-[#888888] block mb-1">NEXT ACTION</label>
                  <input
                    type="text"
                    value={nextAction}
                    onChange={e => setNextAction(e.target.value)}
                    placeholder="e.g. Schedule research call..."
                    className="w-full bg-[#050505] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white focus:border-[#C9A227] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-[#888888] block mb-1">PRIVATE RESEARCH NOTE</label>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Record private context or institutional observations..."
                  rows={2}
                  className="w-full bg-[#050505] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white focus:border-[#C9A227] outline-none resize-none"
                />
              </div>

              <button
                onClick={handleAddDeal}
                disabled={!selectedEntity}
                className="px-5 py-2.5 bg-[#C9A227] text-[#050505] font-mono font-bold text-xs rounded-lg disabled:opacity-50 hover:bg-[#E4C58F] transition-all"
              >
                SAVE TO PRIVATE DEAL-FLOW →
              </button>
            </div>

            {/* Pipeline Stage Columns / Cards */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#1A1D1B] pb-3">
                <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest">
                  ACTIVE OPPORTUNITIES PIPELINE ({deals.length})
                </span>
                <span className="text-[10px] font-mono text-[#888888]">100% PRIVATE CLIENT-SIDE MEMORY</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {deals.map(deal => (
                  <div key={deal.id} className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-[#C9A227]/10 text-[#C9A227] rounded text-[10px] font-mono font-bold">
                          {deal.stage}
                        </span>
                        <span className="text-[10px] font-mono text-[#888888]">
                          {deal.entityType.toUpperCase()}
                        </span>
                      </div>

                      <h2 className="text-base font-bold text-white">
                        <Link
                          href={`/${deal.entityType === 'company' ? 'companies' : 'projects'}/${deal.entitySlug}`}
                          className="hover:text-[#C9A227] transition-colors"
                        >
                          {deal.name}
                        </Link>
                      </h2>

                      {deal.note && (
                        <p className="text-xs text-[#A0A0A0] bg-[#050505] p-2.5 border border-[#1A1D1B] rounded italic">
                          &ldquo;{deal.note}&rdquo;
                        </p>
                      )}

                      <div className="text-xs font-mono space-y-1">
                        <span className="text-[#888888] block text-[10px] uppercase font-bold">NEXT ACTION:</span>
                        <span className="text-white block font-medium">⚡ {deal.nextAction}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#1A1D1B] flex items-center justify-between gap-2">
                      <select
                        value={deal.stage}
                        onChange={e => handleUpdateStage(deal.id, e.target.value as DealItem['stage'])}
                        className="bg-[#050505] border border-[#1A1D1B] text-[10px] font-mono text-[#C9A227] rounded px-2 py-1 outline-none"
                      >
                        {STAGES.map(s => (
                          <option key={s} value={s}>
                            STAGE: {s}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => handleRemoveDeal(deal.id)}
                        className="text-[10px] font-mono text-[#ef4444] hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
