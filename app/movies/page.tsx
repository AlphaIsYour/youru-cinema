// app/movies/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { getTopAnime, getSeasonNowAnime, Anime } from "@/app/lib/api";
import AnimeCard from "@/app/components/AnimeCard";

export default function MoviesPage() {
  const [moviesList, setMoviesList] = useState<Anime[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  const genres = [
    "All",
    "Action",
    "Adventure",
    "Comedy",
    "Drama",
    "Fantasy",
    "Horror",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Slice of Life",
  ];

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const [top, season] = await Promise.all([
        getTopAnime(),
        getSeasonNowAnime(),
      ]);
      const combined = [...top, ...season];
      // Deduplicate by mal_id
      const unique = Array.from(new Map(combined.map((a) => [a.mal_id, a])).values());
      setMoviesList(unique);
    } catch {
      setMoviesList([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredMovies = moviesList.filter((anime) => {
    if (selectedGenre === "All") return true;
    const animeGenres = (anime as any).genres;
    if (!animeGenres) return true;
    return animeGenres.some(
      (g: any) => g.name.toLowerCase() === selectedGenre.toLowerCase(),
    );
  });


  return (
    <div className="min-h-screen bg-[#141414] text-white pt-24 sm:pt-32 pb-20 px-4 sm:px-8 md:px-12 lg:px-16 max-w-[2560px] mx-auto space-y-8">
      {/* Header & Genre Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-2">
            Movies & Shows
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm font-light">
            Explore feature films, seasonal releases, and popular anime series.
          </p>
        </div>

        {/* Genre Selector Dropdown / Pills */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:inline">
            Genre:
          </span>
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="bg-[#1c1c1c] text-white text-xs sm:text-sm px-4 py-2.5 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-red-600 shadow"
          >
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Genre Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedGenre === genre
                ? "bg-red-600 text-white shadow-md scale-105"
                : "bg-[#222222] hover:bg-[#333333] text-gray-300 hover:text-white border border-white/10"
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Movies Catalog Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="w-16 h-16 border-4 border-white/20 border-t-red-600 rounded-full animate-spin mb-6"></div>
          <p className="text-gray-400 text-sm font-light">Loading movies catalog...</p>
        </div>
      ) : filteredMovies.length === 0 ? (
        <div className="text-center py-24 text-gray-400 font-light text-sm">
          No titles found for genre &quot;{selectedGenre}&quot;. Try picking another genre.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 md:gap-6">
          {filteredMovies.map((anime) => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </div>
      )}
    </div>
  );
}
