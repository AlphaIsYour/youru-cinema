/* eslint-disable react/no-unescaped-entities */
// app/search/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { Anime } from "@/app/lib/api";
import AnimeCard from "@/app/components/AnimeCard";
import { useSearchParams } from "next/navigation";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(searchQuery)}&limit=24`,
      );
      const data = await response.json();
      setResults(data.data || []);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  return (
    <div className="min-h-screen bg-[#141414] pt-20 sm:pt-28 pb-16">
      <div className="max-w-[2560px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-4 sm:mb-8 tracking-tight">
            Search
          </h1>

          <form onSubmit={handleSearch} className="relative max-w-4xl mb-6">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search titles, genres, studios..."
                className="w-full bg-[#1a1a1a] text-white px-4 sm:px-6 py-3.5 sm:py-5 pr-28 sm:pr-32 text-sm sm:text-base font-light focus:outline-none focus:ring-2 focus:ring-red-600 transition-all duration-200 border border-gray-800 focus:border-red-500/50 rounded-xl"
                autoFocus
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-600 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-lg font-bold hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Searching
                  </span>
                ) : (
                  "Search"
                )}
              </button>
            </div>
          </form>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 max-w-4xl">
            {["Action", "Romance", "Fantasy", "Sci-Fi", "Comedy", "Isekai", "Movie", "Top Rated"].map(
              (category) => (
                <button
                  key={category}
                  onClick={() => {
                    setQuery(category);
                    performSearch(category);
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    query.toLowerCase() === category.toLowerCase()
                      ? "bg-red-600 text-white shadow-md scale-105"
                      : "bg-[#222222] hover:bg-[#333333] text-gray-300 hover:text-white border border-white/10"
                  }`}
                >
                  {category}
                </button>
              ),
            )}
          </div>
        </div>


        {loading && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-16 h-16 border-4 border-white/20 border-t-red-600 rounded-full animate-spin mb-6"></div>
            <p className="text-gray-400 text-sm font-light">Searching catalog...</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div>
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1.5">
                Search Results
              </h2>
              <p className="text-gray-400 font-light text-xs sm:text-sm">
                Found {results.length} results for "{query}"
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 md:gap-6">
              {results.map((anime) => (
                <div key={anime.mal_id} className="w-full">
                  <AnimeCard anime={anime} />
                </div>
              ))}
            </div>
          </div>
        )}


        {!loading && hasSearched && query && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="mb-6">
              <svg
                className="w-24 h-24 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              No results found
            </h3>
            <p className="text-gray-400 text-base font-light mb-8 max-w-md text-center">
              We couldn't find any anime matching "{query}". Try searching with
              different keywords.
            </p>
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
                setHasSearched(false);
              }}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-md font-medium transition-all duration-200 text-sm"
            >
              Clear Search
            </button>
          </div>
        )}

        {!loading && !hasSearched && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="mb-6">
              <svg
                className="w-24 h-24 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              Start Searching
            </h3>
            <p className="text-gray-400 text-base font-light max-w-md text-center">
              Enter a title, genre, or studio name to find your favorite anime
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#141414] pt-24 pb-16 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-white/20 border-t-red-600 rounded-full animate-spin"></div>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}

