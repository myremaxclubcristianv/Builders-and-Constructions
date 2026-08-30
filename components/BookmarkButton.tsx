'use client';

import { useState, useEffect } from 'react';

interface BookmarkButtonProps {
  id: string;
  name: string;
  type: 'company' | 'project' | 'city';
  slug: string;
  subtext?: string;
}

export function BookmarkButton({ id, name, type, slug, subtext }: BookmarkButtonProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('cg_saved_entities') || '[]');
      setIsSaved(saved.some((item: any) => item.slug === slug && item.type === type));
    } catch {
      // localStorage fallback
    }
  }, [slug, type]);

  const toggleBookmark = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('cg_saved_entities') || '[]');
      let updated;
      if (isSaved) {
        updated = saved.filter((item: any) => !(item.slug === slug && item.type === type));
      } else {
        updated = [...saved, { id, name, type, slug, subtext, savedAt: new Date().toISOString() }];
      }
      localStorage.setItem('cg_saved_entities', JSON.stringify(updated));
      setIsSaved(!isSaved);
    } catch {
      // localStorage fallback
    }
  };

  return (
    <button
      onClick={toggleBookmark}
      className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
        isSaved
          ? 'bg-[#C9A227]/20 border-[#C9A227] text-[#C9A227]'
          : 'bg-[#111111] border-[#1A1D1B] text-[#A0A0A0] hover:border-[#C9A227]/50 hover:text-white'
      }`}
    >
      <span>{isSaved ? '★' : '☆'}</span>
      <span>{isSaved ? 'SAVED TO WORKSPACE' : 'SAVE TO WORKSPACE'}</span>
    </button>
  );
}
