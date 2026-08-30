'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';

type ResearchStatus = 'WATCHING' | 'RESEARCHING' | 'PRIORITY' | 'REVIEWED';

export default function WorkspacePage() {
  const [savedItems, setSavedItems] = useState<any[]>([]);

  useEffect(() => {
    try {
      const items = JSON.parse(localStorage.getItem('cg_saved_entities') || '[]');
      // Ensure defaults for status and note
      const normalized = items.map((item: any) => ({
        ...item,
        status: item.status || 'WATCHING',
        note: item.note || ''
      }));
      setSavedItems(normalized);
    } catch {
      setSavedItems([]);
    }
  }, []);

  const updateItem = (slug: string, type: string, updates: Partial<{ status: ResearchStatus; note: string }>) => {
    const updated = savedItems.map(item => {
      if (item.slug === slug && item.type === type) {
        return { ...item, ...updates };
      }
      return item;
    });
    setSavedItems(updated);
    try {
      localStorage.setItem('cg_saved_entities', JSON.stringify(updated));
    } catch {
      // localStorage fallback
    }
  };

  const removeItem = (slug: string, type: string) => {
    const updated = savedItems.filter(item => !(item.slug === slug && item.type === type));
    setSavedItems(updated);
    try {
      localStorage.setItem('cg_saved_entities', JSON.stringify(updated));
    } catch {
      // localStorage fallback
    }
  };

  const clearAll = () => {
    setSavedItems([]);
    try {
      localStorage.removeItem('cg_saved_entities');
    } catch {
      // localStorage fallback
    }
  };

  const exportCSV = () => {
    if (savedItems.length === 0) return;
    const headers = ['Type', 'Name', 'Slug', 'Subtext', 'Research Status', 'Private Notes', 'Saved At'];
    const rows = savedItems.map(item => [
      item.type,
      `"${(item.name || '').replace(/"/g, '""')}"`,
      item.slug,
      `"${(item.subtext || '').replace(/"/g, '""')}"`,
      item.status || 'WATCHING',
      `"${(item.note || '').replace(/"/g, '""')}"`,
      item.savedAt || new Date().toISOString()
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `constructions_research_workspace_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportResearchBrief = () => {
    if (savedItems.length === 0) return;
    const dateStr = new Date().toISOString().split('T')[0];
    const briefLines = [
      '===========================================================',
      'CONSTRUCTIONS by AiXLuxury — INSTITUTIONAL RESEARCH BRIEF',
      `DATE GENERATED: ${dateStr}`,
      'PROVENANCE HIERARCHY: Tier 1 Authoritative Registries / Tier 2 Developer Disclosures',
      '===========================================================',
      '',
      '1. EXECUTIVE SUMMARY & WORKSPACE COVERAGE',
      `Total Saved Research Entities: ${savedItems.length}`,
      `Saved Corporate Entities: ${savedItems.filter(i => i.type === 'company').length}`,
      `Saved Development Projects: ${savedItems.filter(i => i.type === 'project').length}`,
      '',
      '2. SAVED ENTITIES & PRIVATE RESEARCH LEDGER',
      '-----------------------------------------------------------'
    ];

    savedItems.forEach((item, idx) => {
      briefLines.push(`[${String(idx + 1).padStart(2, '0')}] ${item.name.toUpperCase()}`);
      briefLines.push(`     Type: ${item.type.toUpperCase()}`);
      briefLines.push(`     Slug: ${item.slug}`);
      briefLines.push(`     Details: ${item.subtext || 'N/A'}`);
      briefLines.push(`     Research Status Tag: ${item.status || 'WATCHING'}`);
      briefLines.push(`     Private Notes: ${item.note ? item.note : 'NONE RECORDED'}`);
      briefLines.push(`     Dossier Link: https://constructions.cristianvaduva.com/${item.type === 'company' ? 'companies' : 'projects'}/${item.slug}`);
      briefLines.push('');
    });

    briefLines.push('===========================================================');
    briefLines.push('METHODOLOGY & FACTUAL BOUNDARIES:');
    briefLines.push('Data is compiled from verified public disclosures. Fields without primary source evidence remain explicitly classified as NOT DISCLOSED.');
    briefLines.push('===========================================================');

    const briefContent = briefLines.join('\n');
    const blob = new Blob([briefContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `constructions_research_brief_${dateStr}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const companies = savedItems.filter(item => item.type === 'company');
  const projects = savedItems.filter(item => item.type === 'project');

  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <SiteHeader />

      <main className="pt-20">
        <section className="py-10 md:py-16 border-b border-[#1A1D1B] bg-[#0B0B0B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block">
                Private Institutional Research Workstation
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                RESEARCH WORKSPACE 2.0
              </h1>
              <p className="text-sm md:text-base text-[#A0A0A0] max-w-2xl leading-relaxed">
                Manage saved corporate profiles, development dossiers, research status tags, and private notes stored safely in your isolated browser memory.
              </p>
            </div>

            {savedItems.length > 0 && (
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={exportResearchBrief}
                  className="px-4 py-2 bg-[#111111] border border-[#C9A227] text-[#C9A227] font-mono font-bold text-xs rounded-lg hover:bg-[#C9A227] hover:text-[#050505] transition-all"
                >
                  GENERATE RESEARCH BRIEF (.TXT) ↓
                </button>
                <button
                  onClick={exportCSV}
                  className="px-4 py-2 bg-[#C9A227] text-[#050505] font-mono font-bold text-xs rounded-lg hover:bg-[#E4C58F] transition-all"
                >
                  EXPORT RESEARCH CSV ↓
                </button>
                <button
                  onClick={clearAll}
                  className="px-4 py-2 bg-[#111111] border border-[#1A1D1B] text-xs font-mono text-[#ef4444] rounded-lg hover:border-[#ef4444]/50 transition-all"
                >
                  Clear ({savedItems.length})
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="py-10 md:py-16">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-12">
            {savedItems.length === 0 ? (
              <div className="p-12 bg-[#111111] border border-[#1A1D1B] rounded-2xl text-center max-w-xl mx-auto space-y-4">
                <span className="text-4xl">📁</span>
                <h2 className="text-xl font-bold text-white">Your Workspace is Empty</h2>
                <p className="text-xs text-[#A0A0A0] leading-relaxed">
                  Click &quot;SAVE TO WORKSPACE&quot; on any company or project dossier to bookmark entities for rapid research, notes, and CSV export.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <Link href="/companies" className="px-4 py-2 bg-[#0B0B0B] border border-[#1A1D1B] text-xs font-mono text-white rounded-lg hover:border-[#C9A227]/50">
                    Explore Companies (40)
                  </Link>
                  <Link href="/projects" className="px-4 py-2 bg-[#0B0B0B] border border-[#1A1D1B] text-xs font-mono text-white rounded-lg hover:border-[#C9A227]/50">
                    Explore Projects (53)
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-10">
                {/* Saved Companies */}
                {companies.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-xs font-mono text-[#C9A227] uppercase tracking-widest flex items-center justify-between">
                      <span>SAVED CORPORATE ENTITIES ({companies.length})</span>
                      <Link href="/compare" className="text-[10px] text-[#888888] hover:text-[#C9A227]">
                        OPEN IN COMPARISON →
                      </Link>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {companies.map(item => (
                        <div key={item.slug} className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl flex flex-col justify-between space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono text-[#C9A227]">COMPANY DOSSIER</span>
                              <select
                                value={item.status || 'WATCHING'}
                                onChange={e => updateItem(item.slug, 'company', { status: e.target.value as ResearchStatus })}
                                className="bg-[#050505] text-[10px] font-mono text-[#C9A227] border border-[#1A1D1B] rounded px-2 py-1"
                              >
                                <option value="WATCHING">👀 WATCHING</option>
                                <option value="RESEARCHING">🔍 RESEARCHING</option>
                                <option value="PRIORITY">⚡ PRIORITY</option>
                                <option value="REVIEWED">✅ REVIEWED</option>
                              </select>
                            </div>

                            <h3 className="text-base font-bold text-white">
                              <Link href={`/companies/${item.slug}`} className="hover:text-[#C9A227] transition-colors">
                                {item.name}
                              </Link>
                            </h3>
                            {item.subtext && <p className="text-xs text-[#888888]">{item.subtext}</p>}

                            {/* Private Note Field */}
                            <div className="pt-2">
                              <label className="text-[9px] font-mono text-[#666666] uppercase block mb-1">
                                PRIVATE RESEARCH NOTES:
                              </label>
                              <textarea
                                value={item.note || ''}
                                onChange={e => updateItem(item.slug, 'company', { note: e.target.value })}
                                placeholder="Add private institutional notes..."
                                className="w-full h-16 bg-[#050505] border border-[#1A1D1B] rounded p-2 text-xs text-[#d8d6ce] focus:outline-none focus:border-[#C9A227]/50 resize-none font-mono"
                              />
                            </div>
                          </div>

                          <div className="pt-3 border-t border-[#1A1D1B] flex items-center justify-between text-xs font-mono">
                            <button
                              onClick={() => removeItem(item.slug, 'company')}
                              className="text-[#ef4444] hover:underline text-[10px]"
                            >
                              Remove
                            </button>
                            <Link href={`/companies/${item.slug}`} className="text-[#C9A227] font-semibold">
                              DOSSIER →
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Saved Projects */}
                {projects.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-xs font-mono text-[#C9A227] uppercase tracking-widest flex items-center justify-between">
                      <span>SAVED PROJECTS ({projects.length})</span>
                      <Link href="/compare" className="text-[10px] text-[#888888] hover:text-[#C9A227]">
                        OPEN IN COMPARISON →
                      </Link>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {projects.map(item => (
                        <div key={item.slug} className="p-5 bg-[#111111] border border-[#1A1D1B] rounded-xl flex flex-col justify-between space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono text-[#38bdf8]">PROJECT DOSSIER</span>
                              <select
                                value={item.status || 'WATCHING'}
                                onChange={e => updateItem(item.slug, 'project', { status: e.target.value as ResearchStatus })}
                                className="bg-[#050505] text-[10px] font-mono text-[#38bdf8] border border-[#1A1D1B] rounded px-2 py-1"
                              >
                                <option value="WATCHING">👀 WATCHING</option>
                                <option value="RESEARCHING">🔍 RESEARCHING</option>
                                <option value="PRIORITY">⚡ PRIORITY</option>
                                <option value="REVIEWED">✅ REVIEWED</option>
                              </select>
                            </div>

                            <h3 className="text-base font-bold text-white">
                              <Link href={`/projects/${item.slug}`} className="hover:text-[#C9A227] transition-colors">
                                {item.name}
                              </Link>
                            </h3>
                            {item.subtext && <p className="text-xs text-[#888888]">{item.subtext}</p>}

                            {/* Private Note Field */}
                            <div className="pt-2">
                              <label className="text-[9px] font-mono text-[#666666] uppercase block mb-1">
                                PRIVATE RESEARCH NOTES:
                              </label>
                              <textarea
                                value={item.note || ''}
                                onChange={e => updateItem(item.slug, 'project', { note: e.target.value })}
                                placeholder="Add private institutional notes..."
                                className="w-full h-16 bg-[#050505] border border-[#1A1D1B] rounded p-2 text-xs text-[#d8d6ce] focus:outline-none focus:border-[#C9A227]/50 resize-none font-mono"
                              />
                            </div>
                          </div>

                          <div className="pt-3 border-t border-[#1A1D1B] flex items-center justify-between text-xs font-mono">
                            <button
                              onClick={() => removeItem(item.slug, 'project')}
                              className="text-[#ef4444] hover:underline text-[10px]"
                            >
                              Remove
                            </button>
                            <Link href={`/projects/${item.slug}`} className="text-[#C9A227] font-semibold">
                              DOSSIER →
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
