/* eslint-disable react/no-unescaped-entities */
// app/search/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Anime } from "@/app/lib/api";
import AnimeCard from "@/app/components/AnimeCard";
import { useSearchParams } from "next/navigation";

export default function SearchPage() {
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
    <div className="min-h-screen bg-[#141414] pt-24 pb-16">
      <div className="max-w-[1920px] mx-auto px-16">
        <div className="mb-12">
          <h1 className="text-5xl font-black text-white mb-8 tracking-tight">
            Search
          </h1>

          <form onSubmit={handleSearch} className="relative max-w-4xl">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search titles, genres, studios..."
                className="w-full bg-[#1a1a1a] text-white px-6 py-5 pr-32 text-base font-light focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 border border-gray-800 focus:border-white/40"
                autoFocus
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-black px-8 py-3 rounded font-bold hover:bg-white/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    Searching
                  </span>
                ) : (
                  "Search"
                )}
              </button>
            </div>
          </form>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mb-6"></div>
            <p className="text-gray-400 text-sm font-light">Searching...</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                Search Results
              </h2>
              <p className="text-gray-400 font-light text-sm">
                Found {results.length} results for "{query}"
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
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
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded font-medium transition-all duration-200 text-sm"
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
