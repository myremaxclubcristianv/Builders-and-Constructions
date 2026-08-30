'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { realCompaniesDataset, realProjectsDataset } from '@/lib/real-romanian-data';

export default function OutreachPage() {
  const [selectedSlug, setSelectedSlug] = useState<string>('one-united-properties');
  const [customGoal, setCustomGoal] = useState<string>('Institutional Research Discussion');

  const company = realCompaniesDataset.find(c => c.slug === selectedSlug);
  const connectedProjects = realProjectsDataset.filter(p => p.developer_slug === selectedSlug || p.contractor_slug === selectedSlug);

  const generateBriefTxt = () => {
    if (!company) return;
    const dateStr = new Date().toISOString().split('T')[0];
    const lines = [
      '===========================================================',
      'CONSTRUCTIONS by AiXLuxury — OUTREACH PREPARATION BRIEF',
      `DATE: ${dateStr}`,
      `TARGET ENTITY: ${company.name.toUpperCase()}`,
      `PRIMARY GOAL: ${customGoal}`,
      '===========================================================',
      '',
      '1. CORPORATE IDENTITY & PROVENANCE',
      `Entity Name: ${company.name}`,
      `HQ Location: ${company.location}`,
      `Entity Type: ${company.type.toUpperCase()}`,
      `Indexed Active Projects: ${connectedProjects.length}`,
      'Contact Phone: NOT DISCLOSED (Public Registry strictly enforced)',
      'Contact Email: NOT DISCLOSED (Public Registry strictly enforced)',
      '',
      '2. CONNECTED PROJECT PORTFOLIO',
      '-----------------------------------------------------------'
    ];

    connectedProjects.forEach((p, idx) => {
      lines.push(`[${idx + 1}] ${p.name}`);
      lines.push(`    Status: ${p.status_display}`);
      lines.push(`    Location: ${p.location}`);
      lines.push(`    Built Area: ${p.built_area_sqm ? `${p.built_area_sqm.toLocaleString()} sqm` : 'NOT DISCLOSED'}`);
      lines.push(`    General Contractor: ${p.contractor_name || 'NOT DISCLOSED'}`);
      lines.push('');
    });

    lines.push('===========================================================');
    lines.push('METHODOLOGY & FACTUAL BOUNDARIES:');
    lines.push('Factual data is derived strictly from public disclosures. Personal contact info is NOT DISCLOSED.');
    lines.push('===========================================================');

    const content = lines.join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `outreach_brief_${company.slug}_${dateStr}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <SiteHeader />

      <main className="pt-20">
        <section className="py-10 md:py-16 border-b border-[#1A1D1B] bg-[#0B0B0B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227] block">
              Outreach & Research Brief Preparation
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              OUTREACH PREPARATION
            </h1>
            <p className="text-sm md:text-base text-[#A0A0A0] max-w-2xl leading-relaxed">
              Generate deterministic executive briefs for target entities using verified project portfolios, primary registry disclosures, and non-overclaiming factual boundaries.
            </p>
          </div>
        </section>

        <section className="py-10 md:py-16">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-8">
            <div className="p-6 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-4">
              <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest block font-bold">
                CONFIGURE OUTREACH BRIEF
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono text-[#888888] block mb-1">SELECT CORPORATE ENTITY</label>
                  <select
                    value={selectedSlug}
                    onChange={e => setSelectedSlug(e.target.value)}
                    className="w-full bg-[#050505] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white focus:border-[#C9A227] outline-none"
                  >
                    {realCompaniesDataset.map(c => (
                      <option key={c.slug} value={c.slug}>
                        {c.name} ({c.location})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-[#888888] block mb-1">OUTREACH GOAL</label>
                  <input
                    type="text"
                    value={customGoal}
                    onChange={e => setCustomGoal(e.target.value)}
                    className="w-full bg-[#050505] border border-[#1A1D1B] rounded-lg px-3 py-2 text-xs text-white focus:border-[#C9A227] outline-none"
                  />
                </div>
              </div>
            </div>

            {company && (
              <div className="p-6 bg-[#111111] border border-[#1A1D1B] rounded-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1A1D1B] pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-[#C9A227] font-bold uppercase">{company.type}</span>
                    <h2 className="text-xl font-bold text-white">
                      <Link href={`/companies/${company.slug}`} className="hover:text-[#C9A227]">
                        {company.name}
                      </Link>
                    </h2>
                    <p className="text-xs text-[#888888]">HQ Location: {company.location}</p>
                  </div>

                  <button
                    onClick={generateBriefTxt}
                    className="px-4 py-2 bg-[#C9A227] text-[#050505] font-mono font-bold text-xs rounded-lg hover:bg-[#E4C58F] transition-all shrink-0"
                  >
                    DOWNLOAD OUTREACH BRIEF (.TXT) ↓
                  </button>
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-mono text-[#888888] uppercase tracking-widest block font-bold">
                    CONNECTED PROJECT PORTFOLIO ({connectedProjects.length})
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {connectedProjects.map(p => (
                      <div key={p.slug} className="p-4 bg-[#050505] border border-[#1A1D1B] rounded-lg space-y-1 text-xs">
                        <h3 className="font-bold text-white">
                          <Link href={`/projects/${p.slug}`} className="hover:text-[#C9A227]">
                            {p.name}
                          </Link>
                        </h3>
                        <p className="text-[#888888] font-mono text-[10px]">
                          Status: {p.status_display} · Built Area: {p.built_area_sqm ? `${p.built_area_sqm.toLocaleString()} m²` : 'NOT DISCLOSED'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
