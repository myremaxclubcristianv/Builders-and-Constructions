'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { realCompaniesDataset } from '@/lib/real-romanian-data';

interface ActionItem {
  id: string;
  type: 'REVIEW ACCOUNT' | 'REVIEW PROJECT' | 'VERIFY NEW SIGNAL' | 'PREPARE OUTREACH' | 'ADD TO WATCHLIST' | 'MOVE TO DEAL FLOW' | 'EXPORT RESEARCH BRIEF';
  entityName: string;
  entitySlug: string;
  dueDate: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  note: string;
}

export default function ActionsPage() {
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>('one-united-properties');
  const [actionType, setActionType] = useState<ActionItem['type']>('REVIEW ACCOUNT');
  const [dueDate, setDueDate] = useState<string>('2026-09-05');
  const [note, setNote] = useState<string>('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('romanian_actions_queue');
      if (saved) {
        setActions(JSON.parse(saved));
      } else {
        const initialActions: ActionItem[] = [
          {
            id: 'act-1',
            type: 'REVIEW ACCOUNT',
            entityName: 'One United Properties',
            entitySlug: 'one-united-properties',
            dueDate: '2026-09-02',
            status: 'PENDING',
            note: 'High relevance score 82/100. Review active site pipeline disclosures.'
          },
          {
            id: 'act-2',
            type: 'PREPARE OUTREACH',
            entityName: 'Construcții Erbașu',
            entitySlug: 'constructii-erbasu',
            dueDate: '2026-09-07',
            status: 'PENDING',
            note: 'Prepare executive outreach brief for active general contractor projects.'
          }
        ];
        setActions(initialActions);
        localStorage.setItem('romanian_actions_queue', JSON.stringify(initialActions));
      }
    } catch {
      // client memory fallback
    }
  }, []);

  const saveActions = (updated: ActionItem[]) => {
    setActions(updated);
    try {
      localStorage.setItem('romanian_actions_queue', JSON.stringify(updated));
    } catch {
      // client memory fallback
    }
  };

  const handleAddAction = () => {
    if (!selectedSlug) return;
    const company = realCompaniesDataset.find(c => c.slug === selectedSlug);
    const name = company ? company.name : selectedSlug;

    const newAction: ActionItem = {
      id: `act-${Date.now()}`,
      type: actionType,
      entityName: name,
      entitySlug: selectedSlug,
      dueDate,
      status: 'PENDING',
      note
    };

    const updated = [newAction, ...actions];
    saveActions(updated);
    setNote('');
  };

  const handleToggleStatus = (id: string) => {
    const updated = actions.map(a => {
      if (a.id === id) {
        const nextStatus: ActionItem['status'] = a.status === 'PENDING' ? 'IN_PROGRESS' : a.status === 'IN_PROGRESS' ? 'COMPLETED' : 'PENDING';
        return { ...a, status: nextStatus };
      }
      return a;
    });
    saveActions(updated);
  };

  const handleRemoveAction = (id: string) => {
    const updated = actions.filter(a => a.id !== id);
    saveActions(updated);
  };

  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <SiteHeader />

      <main className="pt-20">
        <section className="py-10 md:py-16 border-b border-[#1A1D1B] bg-[#0B0B0B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block">
              Private Institutional Action Queue
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              ACTION QUEUE
            </h1>
            <p className="text-sm md:text-base text-[#A0A0A0] max-w-2xl leading-relaxed">
              Transform evidence-backed decision classifications into concrete private workflow actions. 100% isolated browser memory storage.
            </p>
          </div>
        </section>

        <section className="py-10 md:py-16">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-10">
            {/* Create Action Form */}
            <div className="p-6 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-4">
              <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest block font-bold">
                + CREATE PRIVATE WORKFLOW ACTION
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-[#888888] block mb-1">TARGET ENTITY</label>
                  <select
                    value={selectedSlug}
                    onChange={e => setSelectedSlug(e.target.value)}
                    className="w-full bg-[#050505] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white focus:border-[#C9A227] outline-none"
                  >
                    {realCompaniesDataset.map(c => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-[#888888] block mb-1">ACTION TYPE</label>
                  <select
                    value={actionType}
                    onChange={e => setActionType(e.target.value as ActionItem['type'])}
                    className="w-full bg-[#050505] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white focus:border-[#C9A227] outline-none"
                  >
                    <option value="REVIEW ACCOUNT">REVIEW ACCOUNT</option>
                    <option value="REVIEW PROJECT">REVIEW PROJECT</option>
                    <option value="VERIFY NEW SIGNAL">VERIFY NEW SIGNAL</option>
                    <option value="PREPARE OUTREACH">PREPARE OUTREACH</option>
                    <option value="ADD TO WATCHLIST">ADD TO WATCHLIST</option>
                    <option value="MOVE TO DEAL FLOW">MOVE TO DEAL FLOW</option>
                    <option value="EXPORT RESEARCH BRIEF">EXPORT RESEARCH BRIEF</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-[#888888] block mb-1">DUE DATE</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full bg-[#050505] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white focus:border-[#C9A227] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-[#888888] block mb-1">ACTION NOTE</label>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Private action notes..."
                  rows={2}
                  className="w-full bg-[#050505] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white focus:border-[#C9A227] outline-none resize-none"
                />
              </div>

              <button
                onClick={handleAddAction}
                className="px-5 py-2.5 bg-[#C9A227] text-[#050505] font-mono font-bold text-xs rounded-lg hover:bg-[#E4C58F] transition-all"
              >
                SAVE ACTION ITEM →
              </button>
            </div>

            {/* Action List Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#1A1D1B] pb-3">
                <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest font-bold">
                  ACTIVE ACTION ITEMS ({actions.length})
                </span>
                <span className="text-[10px] font-mono text-[#888888]">100% PRIVATE CLIENT-SIDE MEMORY</span>
              </div>

              <div className="space-y-3">
                {actions.map(act => (
                  <div
                    key={act.id}
                    className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                      act.status === 'COMPLETED' ? 'bg-[#0A0A0A] border-[#1A1D1B] opacity-60' : 'bg-[#111111] border-[#1A1D1B]'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-[#C9A227]/10 text-[#C9A227] rounded text-[10px] font-mono font-bold">
                          {act.type}
                        </span>
                        <span className="text-[10px] font-mono text-[#38bdf8]">STATUS: {act.status}</span>
                        <span className="text-[10px] font-mono text-[#888888]">· DUE: {act.dueDate}</span>
                      </div>

                      <h2 className="text-base font-bold text-white">
                        <Link href={`/companies/${act.entitySlug}`} className="hover:text-[#C9A227]">
                          {act.entityName}
                        </Link>
                      </h2>

                      {act.note && <p className="text-xs text-[#A0A0A0] font-mono italic">&ldquo;{act.note}&rdquo;</p>}
                    </div>

                    <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#1A1D1B]">
                      <button
                        onClick={() => handleToggleStatus(act.id)}
                        className="px-3 py-1.5 bg-[#050505] border border-[#1A1D1B] text-xs font-mono text-[#C9A227] rounded hover:border-[#C9A227] transition-all"
                      >
                        {act.status === 'COMPLETED' ? 'Reopen' : act.status === 'PENDING' ? 'Start' : 'Complete'}
                      </button>

                      <button
                        onClick={() => handleRemoveAction(act.id)}
                        className="text-xs font-mono text-[#ef4444] hover:underline"
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
