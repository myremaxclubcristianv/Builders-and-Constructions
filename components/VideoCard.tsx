'use client';
import React, { useState } from 'react';
import { ConstructionVideo } from '@/lib/video-data';

export function VideoCard({ video }: { video: ConstructionVideo }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="bg-[#111111] border border-[#1A1D1B] rounded-xl overflow-hidden flex flex-col group hover:border-[#C9A227]/50 transition-all">
      {/* Video / Thumbnail Container */}
      <div className="relative aspect-video bg-[#050505] overflow-hidden">
        {isPlaying ? (
          <iframe
            src={`${video.embedUrl}?autoplay=1`}
            title={video.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase ${
                  video.isShort
                    ? 'bg-[#38bdf8]/20 text-[#38bdf8] border border-[#38bdf8]/40'
                    : 'bg-[#C9A227]/20 text-[#C9A227] border border-[#C9A227]/40'
                }`}
              >
                {video.isShort ? 'SHORT' : 'VIDEO'}
              </span>
            </div>

            <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/80 backdrop-blur text-[10px] font-mono text-white rounded">
              {video.duration}
            </div>

            {/* Play Trigger */}
            <button
              onClick={() => setIsPlaying(true)}
              aria-label={`Play ${video.title}`}
              className="absolute inset-0 flex items-center justify-center group/btn cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-[#C9A227]/90 text-black flex items-center justify-center group-hover/btn:scale-110 transition-transform shadow-lg">
                <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </button>
          </>
        )}
      </div>

      {/* Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 font-mono text-xs">
        <div className="space-y-1">
          <span className="text-[10px] text-[#888888] uppercase block">{video.category.replace('_', ' ')}</span>
          <h3 className="text-sm font-bold text-white leading-snug group-hover:text-[#C9A227] transition-colors">
            {video.title}
          </h3>
          <p className="text-[#A0A0A0] text-xs font-sans line-clamp-2 pt-1">{video.description}</p>
        </div>

        <div className="pt-2 border-t border-[#1A1D1B] flex items-center justify-between">
          <span className="text-[#666666] text-[10px]">{video.publishedAt}</span>
          <a
            href={video.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#C9A227] hover:underline text-[11px] font-bold flex items-center gap-1"
          >
            <span>WATCH ON YOUTUBE</span>
            <span>↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}
