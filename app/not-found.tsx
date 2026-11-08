import Link from 'next/link';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { SearchIcon, BuildingIcon } from '@/components/icons/NavIcons';

export default function NotFound() {
  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen flex flex-col justify-between selection:bg-[#C9A227] selection:text-[#050505]">
      <SiteHeader />

      <main className="flex-1 max-w-4xl mx-auto px-4 md:px-8 pt-32 pb-24 flex flex-col items-center justify-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111111] border border-[#C9A227]/30 rounded-full text-[10px] font-mono tracking-widest text-[#C9A227] uppercase mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
          404 · Record Not Located
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
          Dossier or Route Not Found
        </h1>

        <p className="text-sm md:text-base text-[#A0A0A0] max-w-lg mb-8 leading-relaxed">
          The requested intelligence record, project archive, or platform page does not exist or may have been relocated to a verified canonical address.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#C9A227] text-[#050505] text-xs font-mono font-bold tracking-wider uppercase rounded-xl hover:bg-[#E4C58F] transition-all"
          >
            <SearchIcon className="w-4 h-4 text-[#050505]" />
            Search Intelligence Terminal
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#111111] border border-[#1A1D1B] text-white text-xs font-mono font-semibold tracking-wider uppercase rounded-xl hover:border-[#C9A227]/50 hover:bg-[#161616] transition-all"
          >
            <BuildingIcon className="w-4 h-4 text-[#C9A227]" />
            Return to Index
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
