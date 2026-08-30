'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface SavedItem {
  id: string;
  name: string;
  type: 'company' | 'project' | 'city';
  slug: string;
  subtext?: string;
  savedAt: string;
}

export function WatchlistViewer() {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const items = JSON.parse(localStorage.getItem('cg_saved_entities') || '[]');
      setSavedItems(items);
    } catch {
      setSavedItems([]);
    }
  }, []);

  const removeSavedItem = (slug: string, type: string) => {
    try {
      const items = JSON.parse(localStorage.getItem('cg_saved_entities') || '[]');
      const updated = items.filter((item: SavedItem) => !(item.slug === slug && item.type === type));
      localStorage.setItem('cg_saved_entities', JSON.stringify(updated));
      setSavedItems(updated);
    } catch {
      // localStorage fallback
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#1A1D1B] pb-3 text-xs font-mono">
        <span className="text-[#C9A227] font-bold uppercase tracking-wider">
          BROWSER-LOCAL SAVED WATCHLIST ({savedItems.length})
        </span>
        <span className="text-[#888888]">100% PRIVATE TO YOUR DEVICE</span>
      </div>

      {savedItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
          {savedItems.map(item => (
            <div key={`${item.type}-${item.slug}`} className="p-4 bg-[#111111] border border-[#1A1D1B] rounded-xl flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="px-2 py-0.5 bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/30 rounded uppercase font-bold">
                    {item.type}
                  </span>
                  <button
                    onClick={() => removeSavedItem(item.slug, item.type)}
                    className="text-[#888888] hover:text-red-400 text-xs"
                    title="Remove from watchlist"
                  >
                    ✕ REMOVE
                  </button>
                </div>
                <h3 className="text-sm font-bold text-white mt-2">
                  <Link href={`/${item.type === 'company' ? 'companies' : item.type === 'project' ? 'projects' : 'cities'}/${item.slug}`} className="hover:text-[#C9A227]">
                    {item.name}
                  </Link>
                </h3>
                {item.subtext && <p className="text-[11px] text-[#888888] mt-1 font-sans">{item.subtext}</p>}
              </div>

              <div className="pt-2 border-t border-[#1A1D1B] flex items-center justify-between text-[10px] text-[#888888]">
                <span>Saved {new Date(item.savedAt).toLocaleDateString()}</span>
                <Link
                  href={`/${item.type === 'company' ? 'companies' : item.type === 'project' ? 'projects' : 'cities'}/${item.slug}`}
                  className="text-[#C9A227] font-bold hover:underline"
                >
                  OPEN DOSSIER →
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 bg-[#111111] border border-[#1A1D1B] rounded-xl text-center font-mono space-y-3">
          <div className="text-2xl">☆</div>
          <h3 className="text-sm font-bold text-white uppercase">YOUR WATCHLIST IS CURRENTLY EMPTY</h3>
          <p className="text-xs text-[#888888] max-w-md mx-auto font-sans leading-relaxed">
            Click &quot;SAVE TO WORKSPACE&quot; on any company dossier, project dossier, or regional hub to monitor specific entities directly in your browser.
          </p>
          <div className="pt-2">
            <Link href="/companies" className="px-4 py-2 bg-[#050505] border border-[#C9A227] text-[#C9A227] rounded text-xs font-bold hover:bg-[#C9A227] hover:text-[#050505] transition-all">
              EXPLORE MARKET ENTITIES →
            </Link>
          </div>
        </div>
      )}

      <div className="p-4 bg-[#0B0B0B] border border-[#1A1D1B] rounded-xl text-[11px] font-mono text-[#777777] leading-relaxed">
        <strong className="text-[#A0A0A0]">PRIVACY DISCLOSURE:</strong> Your watchlist is saved exclusively in your browser&apos;s local storage. No saved entities, tracking cookies, or personal data are transmitted to or stored on our servers.
      </div>
    </div>
  );
}
