import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { getVerifiedVideos } from '@/lib/video-data';
import { VideoCard } from '@/components/VideoCard';
import Link from 'next/link';

export const metadata = {
  title: 'Video & Construction Media Desk · CONSTRUCTIONS by AiXLuxury',
  description: 'Documentary drone progress updates, market analysis broadcasts, and short-form milestone showcases from the CONSTRUCTIONS desk.',
  alternates: {
    canonical: 'https://constructions.cristianvaduva.com/video'
  }
};

export default async function VideoDeskPage() {
  const videos = await getVerifiedVideos();
  const longFormVideos = videos.filter(v => !v.isShort);
  const shortsVideos = videos.filter(v => v.isShort);

  const videoJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: videos.map((v, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'VideoObject',
        name: v.title,
        description: v.description,
        thumbnailUrl: v.thumbnailUrl,
        uploadDate: v.publishedAt,
        embedUrl: v.embedUrl
      }
    }))
  };

  return (
    <div className="bg-[#050505] text-[#F3F1EB] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }}
      />
      <SiteHeader />

      <main className="pt-20">
        {/* Page Hero */}
        <section className="py-12 md:py-20 border-b border-[#1A1D1B] bg-[#0B0B0B]">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A227]">
                FROM THE CONSTRUCTIONS DESK
              </span>
              <span className="px-2 py-0.5 bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/30 rounded text-[9px] font-mono font-bold uppercase">
                EDITORIAL MEDIA
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              CONSTRUCTIONS VIDEO DESK
            </h1>
            <p className="text-sm md:text-base text-[#A0A0A0] max-w-2xl leading-relaxed">
              Drone progress documentations, milestone showcases, and market analysis broadcasts documenting Romania&apos;s evolving urban architecture.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-12 md:py-16">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-16">
            {/* Long Form Videos */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#1A1D1B] pb-3 text-xs font-mono">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">LATEST VIDEO SHOWCASES</h2>
                <span className="text-[#888888]">{longFormVideos.length} RELEASES</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {longFormVideos.map(video => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            </div>

            {/* Shorts Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#1A1D1B] pb-3 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">MILESTONE SHORTS</h2>
                  <span className="px-2 py-0.5 bg-[#38bdf8]/20 text-[#38bdf8] text-[9px] font-bold rounded">
                    SHORT-FORM
                  </span>
                </div>
                <span className="text-[#888888]">{shortsVideos.length} SHORTS</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {shortsVideos.map(video => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            </div>

            {/* Editorial / Data Separation Disclaimer */}
            <div className="p-6 bg-[#111111] border border-[#1A1D1B] rounded-xl text-xs font-mono space-y-2">
              <span className="text-[#C9A227] uppercase font-bold block">EDITORIAL MEDIA POLICY</span>
              <p className="text-[#A0A0A0] leading-relaxed">
                Video documentations serve as an independent media layer and do not alter factual claim ledgers, official registry records, or core entity database counts (40 Companies, 53 Projects).
              </p>
            </div>

            {/* Quick Link to Research */}
            <div className="pt-6 border-t border-[#1A1D1B] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
              <span className="text-[#888888]">NEED CUSTOM DRONE OR SITE MEDIA COVERAGE?</span>
              <Link href="/research-request" className="px-4 py-2 bg-[#C9A227] text-[#050505] font-bold rounded hover:bg-[#E4C58F]">
                REQUEST INSTITUTIONAL MEDIA COVERAGE →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
