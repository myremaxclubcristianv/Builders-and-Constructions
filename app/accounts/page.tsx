'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { realCompaniesDataset, realProjectsDataset } from '@/lib/real-romanian-data';

interface TrackedAccount {
  id: string;
  slug: string;
  name: string;
  location: string;
  type: string;
  status: 'PROSPECT' | 'QUALIFIED' | 'RESEARCHING' | 'PRIORITY' | 'OUTREACH READY' | 'CONTACTED' | 'ENGAGED' | 'OPPORTUNITY' | 'CLIENT' | 'DISQUALIFIED' | 'ARCHIVED';
  privateNote: string;
  nextFollowUp: string;
  updatedAt: string;
}

const ACCOUNT_STATES: TrackedAccount['status'][] = [
  'PROSPECT',
  'QUALIFIED',
  'RESEARCHING',
  'PRIORITY',
  'OUTREACH READY',
  'CONTACTED',
  'ENGAGED',
  'OPPORTUNITY',
  'CLIENT',
  'DISQUALIFIED',
  'ARCHIVED'
];

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<TrackedAccount[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<TrackedAccount['status']>('PROSPECT');
  const [privateNote, setPrivateNote] = useState<string>('');
  const [nextFollowUp, setNextFollowUp] = useState<string>('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('romanian_accounts_memory');
      if (saved) {
        setAccounts(JSON.parse(saved));
      } else {
        const initialAccounts: TrackedAccount[] = [
          {
            id: 'acc-1',
            slug: 'one-united-properties',
            name: 'One United Properties',
            location: 'Bucharest',
            type: 'developer',
            status: 'PRIORITY',
            privateNote: 'Major residential and commercial developer active across 4 primary sites.',
            nextFollowUp: '2026-09-05',
            updatedAt: new Date().toISOString()
          },
          {
            id: 'acc-2',
            slug: 'constructii-erbasu',
            name: 'Construcții Erbașu',
            location: 'Bucharest',
            type: 'general_contractor',
            status: 'QUALIFIED',
            privateNote: 'Leading general contractor with active infrastructure and building projects.',
            nextFollowUp: '2026-09-10',
            updatedAt: new Date().toISOString()
          }
        ];
        setAccounts(initialAccounts);
        localStorage.setItem('romanian_accounts_memory', JSON.stringify(initialAccounts));
      }
    } catch {
      // client memory fallback
    }
  }, []);

  const saveAccountsToMemory = (updated: TrackedAccount[]) => {
    setAccounts(updated);
    try {
      localStorage.setItem('romanian_accounts_memory', JSON.stringify(updated));
    } catch {
      // client memory fallback
    }
  };

  const handleAddAccount = () => {
    if (!selectedSlug) return;
    const company = realCompaniesDataset.find(c => c.slug === selectedSlug);
    if (!company) return;

    const newAccount: TrackedAccount = {
      id: `acc-${Date.now()}`,
      slug: company.slug,
      name: company.name,
      location: company.location,
      type: company.type,
      status: selectedStatus,
      privateNote,
      nextFollowUp: nextFollowUp || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      updatedAt: new Date().toISOString()
    };

    const updated = [newAccount, ...accounts.filter(a => a.slug !== selectedSlug)];
    saveAccountsToMemory(updated);

    setSelectedSlug('');
    setPrivateNote('');
    setNextFollowUp('');
  };

  const handleUpdateStatus = (id: string, status: TrackedAccount['status']) => {
    const updated = accounts.map(a => (a.id === id ? { ...a, status, updatedAt: new Date().toISOString() } : a));
    saveAccountsToMemory(updated);
  };

  const handleRemoveAccount = (id: string) => {
    const updated = accounts.filter(a => a.id !== id);
    saveAccountsToMemory(updated);
  };

  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <SiteHeader />

      <main className="pt-20">
        <section className="py-10 md:py-16 border-b border-[#1A1D1B] bg-[#0B0B0B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block">
              Commercial Account 360 Intelligence
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              ACCOUNT 360 WORKSTATION
            </h1>
            <p className="text-sm md:text-base text-[#A0A0A0] max-w-2xl leading-relaxed">
              Unified 360° commercial account workstation connecting verified development portfolios, active sites, surface area scale, professional network relationships, and browser-isolated private notes.
            </p>
          </div>
        </section>

        <section className="py-10 md:py-16">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-10">
            {/* Track Account Form */}
            <div className="p-6 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-4">
              <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest block font-bold">
                + TRACK CORPORATE ACCOUNT (ACCOUNT 360)
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-[#888888] block mb-1">SELECT CORPORATE DOSSIER</label>
                  <select
                    value={selectedSlug}
                    onChange={e => setSelectedSlug(e.target.value)}
                    className="w-full bg-[#050505] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white focus:border-[#C9A227] outline-none"
                  >
                    <option value="">-- Choose Company --</option>
                    {realCompaniesDataset.map(c => (
                      <option key={c.slug} value={c.slug}>
                        {c.name} ({c.location} · {c.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-[#888888] block mb-1">ACCOUNT WORKFLOW STATUS</label>
                  <select
                    value={selectedStatus}
                    onChange={e => setSelectedStatus(e.target.value as TrackedAccount['status'])}
                    className="w-full bg-[#050505] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white focus:border-[#C9A227] outline-none"
                  >
                    {ACCOUNT_STATES.map(st => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-[#888888] block mb-1">NEXT FOLLOW-UP DATE</label>
                  <input
                    type="date"
                    value={nextFollowUp}
                    onChange={e => setNextFollowUp(e.target.value)}
                    className="w-full bg-[#050505] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white focus:border-[#C9A227] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-[#888888] block mb-1">PRIVATE RESEARCH NOTE (CLIENT-SIDE ONLY)</label>
                <textarea
                  value={privateNote}
                  onChange={e => setPrivateNote(e.target.value)}
                  placeholder="Record private account observations or strategic research hypotheses..."
                  rows={2}
                  className="w-full bg-[#050505] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white focus:border-[#C9A227] outline-none resize-none"
                />
              </div>

              <button
                onClick={handleAddAccount}
                disabled={!selectedSlug}
                className="px-5 py-2.5 bg-[#C9A227] text-[#050505] font-mono font-bold text-xs rounded-lg disabled:opacity-50 hover:bg-[#E4C58F] transition-all"
              >
                SAVE TARGET ACCOUNT 360 →
              </button>
            </div>

            {/* Account List Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#1A1D1B] pb-3">
                <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest font-bold">
                  TRACKED TARGET ACCOUNTS ({accounts.length})
                </span>
                <span className="text-[10px] font-mono text-[#888888]">100% PRIVATE CLIENT-SIDE ISOLATED MEMORY</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {accounts.map(acc => {
                  const companyObj = realCompaniesDataset.find(c => c.slug === acc.slug);
                  const connectedSites = realProjectsDataset.filter(p => p.developer_slug === acc.slug || p.contractor_slug === acc.slug);
                  const activeSites = connectedSites.filter(p => p.status === 'under_construction').length;
                  const totalArea = connectedSites.reduce((acc, p) => acc + (p.built_area_sqm || 0), 0);

                  return (
                    <div key={acc.id} className="p-6 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/30 rounded text-[10px] font-mono font-bold">
                            COMMERCIAL STATUS: {acc.status}
                          </span>
                          <span className="text-[10px] font-mono text-[#888888]">
                            TYPE: {acc.type.toUpperCase()}
                          </span>
                        </div>

                        <div>
                          <h2 className="text-xl font-bold text-white">
                            <Link href={`/companies/${acc.slug}`} className="hover:text-[#C9A227] transition-colors">
                              {acc.name}
                            </Link>
                          </h2>
                          <p className="text-xs font-mono text-[#888888]">
                            <strong className="text-white">VERIFIED FACT:</strong> HQ in {acc.location}
                          </p>
                        </div>

                        {/* Provenance & Metrics Grid */}
                        <div className="grid grid-cols-2 gap-2 p-3 bg-[#050505] border border-[#1A1D1B] rounded text-xs font-mono">
                          <div>
                            <span className="text-[#888888] text-[10px] block">DERIVED METRIC:</span>
                            <span className="text-white font-bold">{connectedSites.length} Projects ({activeSites} Active)</span>
                          </div>
                          <div>
                            <span className="text-[#888888] text-[10px] block">DOCUMENTED AREA:</span>
                            <span className="text-[#C9A227] font-bold">
                              {totalArea > 0 ? `${totalArea.toLocaleString()} m²` : 'NOT DISCLOSED'}
                            </span>
                          </div>
                        </div>

                        {/* Connected Projects */}
                        {connectedSites.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono text-[#888888] uppercase block font-bold">
                              VERIFIED PROJECTS:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {connectedSites.map(p => (
                                <Link
                                  key={p.slug}
                                  href={`/projects/${p.slug}`}
                                  className="px-2 py-0.5 bg-[#050505] border border-[#1A1D1B] text-[10px] font-mono text-[#A0A0A0] rounded hover:border-[#C9A227] hover:text-white"
                                >
                                  {p.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}

                        {acc.privateNote && (
                          <div className="p-3 bg-[#050505] border border-[#1A1D1B] rounded text-xs font-mono space-y-1">
                            <span className="text-[#888888] text-[10px] uppercase font-bold block">PRIVATE USER NOTE:</span>
                            <p className="text-[#F3F1EB] italic">&ldquo;{acc.privateNote}&rdquo;</p>
                          </div>
                        )}

                        <div className="text-xs font-mono">
                          <span className="text-[#888888] text-[10px] uppercase block font-bold">NEXT USER ACTION:</span>
                          <span className="text-[#38bdf8] font-medium">📅 Follow-up scheduled for {acc.nextFollowUp || 'NOT SCHEDULED'}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#1A1D1B] flex items-center justify-between gap-2">
                        <select
                          value={acc.status}
                          onChange={e => handleUpdateStatus(acc.id, e.target.value as TrackedAccount['status'])}
                          className="bg-[#050505] border border-[#1A1D1B] text-[10px] font-mono text-[#C9A227] rounded px-2.5 py-1.5 outline-none"
                        >
                          {ACCOUNT_STATES.map(s => (
                            <option key={s} value={s}>
                              STATUS: {s}
                            </option>
                          ))}
                        </select>

                        <div className="flex items-center gap-3">
                          <Link href={`/outreach`} className="text-[10px] font-mono text-[#C9A227] font-bold hover:underline">
                            OUTREACH BRIEF →
                          </Link>

                          <button
                            onClick={() => handleRemoveAccount(acc.id)}
                            className="text-[10px] font-mono text-[#ef4444] hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
