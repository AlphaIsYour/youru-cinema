// app/favorites/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  getFavorites,
  FavoriteAnime,
  removeFromFavorites,
} from "@/app/lib/favorites";
import Link from "next/link";
import Image from "next/image";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteAnime[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"date" | "title">("date");

  useEffect(() => {
    setIsClient(true);
    setFavorites(getFavorites());
  }, []);

  const handleRemove = (malId: number) => {
    removeFromFavorites(malId);
    setFavorites(getFavorites());
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-[#141414] pt-24">
        <div className="max-w-[1920px] mx-auto px-16">
          <div className="flex items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  const filteredFavorites = favorites

    .filter(() => true)
    .sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return b.addedAt - a.addedAt;
    });

  return (
    <div className="min-h-screen bg-[#141414] pt-20 sm:pt-28 pb-16">
      <div className="max-w-[2560px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
        <div className="mb-8 sm:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-5xl font-black text-white mb-2 sm:mb-3 tracking-tight">
              My List
            </h1>
            <p className="text-gray-400 font-light text-xs sm:text-sm">
              {favorites.length > 0
                ? `${favorites.length} ${favorites.length === 1 ? "title" : "titles"} saved`
                : "Your personal collection"}
            </p>
          </div>

          {/* Filter Status Tabs & Sort Options */}
          {favorites.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 bg-[#1a1a1a] p-1 rounded-lg border border-white/10 text-xs font-medium">
                {["All", "Watching", "Completed", "Plan to Watch"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-3 py-1.5 rounded-md transition ${
                      filterStatus === st
                        ? "bg-red-600 text-white shadow"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "date" | "title")}
                className="bg-[#1a1a1a] text-white text-xs px-3 py-2 rounded-lg border border-white/10 focus:outline-none"
              >
                <option value="date">Recently Added</option>
                <option value="title">Title (A-Z)</option>
              </select>
            </div>
          )}
        </div>


        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 sm:py-32">
            <div className="mb-6 sm:mb-8">
              <svg
                className="w-24 h-24 sm:w-32 sm:h-32 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
              Your list is empty
            </h2>
            <p className="text-gray-400 text-sm sm:text-base font-light mb-8 max-w-md text-center">
              Add anime to your list so you can easily find them later. Just tap
              the heart icon on any title.
            </p>
            <Link
              href="/"
              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-black rounded font-bold hover:bg-white/90 transition-all duration-200 text-xs sm:text-sm"
            >
              Browse Anime
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 md:gap-6">
            {filteredFavorites.map((anime) => (
              <div key={anime.mal_id} className="group relative">

                <Link href={`/anime/${anime.mal_id}`} className="block">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-sm mb-2">
                    <Image
                      src={anime.imageUrl}
                      alt={anime.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-white text-sm font-semibold line-clamp-2 leading-tight">
                        {anime.title}
                      </h3>
                    </div>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-2 mx-auto">
                          <svg
                            className="w-6 h-6 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                        <p className="text-white text-xs font-medium">
                          View Details
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
                <button
                  onClick={() => handleRemove(anime.mal_id)}
                  className="absolute top-2 right-2 z-10 w-8 h-8 bg-black/80 hover:bg-red-600 rounded-full transition-all duration-200 flex items-center justify-center group/btn backdrop-blur-sm"
                  aria-label="Remove from favorites"
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <div className="absolute top-2 left-2 z-10 w-8 h-8 bg-black/80 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <svg
                    className="w-4 h-4 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
