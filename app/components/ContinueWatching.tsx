// app/components/ContinueWatching.tsx
"use client";

import { useEffect, useState } from "react";
import { getContinueWatching, WatchHistoryItem } from "@/app/lib/watchHistory";
import Link from "next/link";
import Image from "next/image";

export default function ContinueWatching() {
  const [items, setItems] = useState<WatchHistoryItem[]>([]);

  useEffect(() => {
    setItems(getContinueWatching());
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="px-4 sm:px-6 lg:px-16 mb-12">
      <h2 className="text-2xl font-bold mb-6 text-white">Continue Watching</h2>
      <div className="flex space-x-3 overflow-x-auto pb-6 scrollbar-hide">
        {items.map((item) => {
          const progress = (item.progress / item.duration) * 100;

          return (
            <Link
              key={`${item.animeId}-${item.episodeNumber}`}
              href={`/watch/${item.animeId}-ep-${item.episodeNumber}`}
              className="flex-shrink-0 w-80 group"
            >
              <div className="relative aspect-video rounded-md overflow-hidden">
                <Image
                  src={item.thumbnail}
                  alt={item.animeTitle}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-black/60 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg
                      className="w-8 h-8 text-white ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
                  <div
                    className="h-full bg-red-600"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
              <div className="mt-2">
                <h3 className="text-white font-medium line-clamp-1">
                  {item.animeTitle}
                </h3>
                <p className="text-gray-400 text-sm">
                  Episode {item.episodeNumber}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
