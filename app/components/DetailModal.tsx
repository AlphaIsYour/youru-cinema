// app/components/DetailModal.tsx
"use client";
import { useEffect, useState, useCallback } from "react";

import Image from "next/image";
import Link from "next/link";
import { AnimeDetail, createAnimeSlug, getTopAnime, Anime } from "@/app/lib/api";
import { isFavorite, toggleFavorite } from "@/app/lib/favorites";

type DetailModalProps = {
  anime: AnimeDetail | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function DetailModal({
  anime,
  isOpen,
  onClose,
}: DetailModalProps) {
  const [activeTab, setActiveTab] = useState<"episodes" | "more">("episodes");
  const [isFav, setIsFav] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [recommendations, setRecommendations] = useState<Anime[]>([]);

  const fetchRecommendations = useCallback(async () => {
    try {
      const topList = await getTopAnime();
      setRecommendations(
        topList.filter((a) => a.mal_id !== anime?.mal_id).slice(0, 6),
      );
    } catch {
      setRecommendations([]);
    }
  }, [anime?.mal_id]);

  useEffect(() => {
    if (anime) {
      setIsFav(isFavorite(anime.mal_id));
      fetchRecommendations();
    }
  }, [anime, fetchRecommendations]);


  if (!isOpen || !anime) return null;

  const animeSlug = createAnimeSlug(anime.title);
  const fullSlug = `${animeSlug}-${anime.mal_id}`;
  const watchUrl = `/watch/${fullSlug}?ep=1`;

  const handleToggleFav = () => {
    const updated = toggleFavorite({
      mal_id: anime.mal_id,
      title: anime.title,
      imageUrl: anime.images.webp.image_url,
      addedAt: Date.now(),
    });
    setIsFav(updated);
  };

  const matchPercentage = anime.score
    ? Math.round((anime.score / 10) * 100)
    : 96;

  const totalEpisodes = anime.episodes || 12;
  const episodeList = Array.from({ length: Math.min(totalEpisodes, 24) }, (_, i) => ({
    number: i + 1,
    title: `Episode ${i + 1}`,
    duration: "24m",
    synopsis: anime.synopsis
      ? anime.synopsis.slice(0, 110) + "..."
      : "No episode details available.",
  }));

  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto bg-black/80 backdrop-blur-sm flex justify-center items-start pt-24 sm:pt-28 pb-16 px-4 animate-fadeIn">
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-[#181818] rounded-xl overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.95)] border border-white/10 text-white my-4">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center border border-white/20 transition hover:scale-110"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Banner Section */}
        <div className="relative h-[40vh] sm:h-[50vh] w-full bg-black">
          <Image
            src={anime.images.webp.large_image_url || anime.images.webp.image_url}
            alt={anime.title}
            fill
            priority
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#181818] via-[#181818]/60 to-transparent"></div>

          {/* Banner Content */}
          <div className="absolute bottom-6 left-6 sm:left-10 right-6 sm:right-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-red-600 font-black text-xl tracking-tighter">Y</span>

              <span className="text-xs text-gray-300 uppercase tracking-widest font-semibold">Series</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black mb-4 leading-tight text-white drop-shadow-md">
              {anime.title}
            </h1>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={watchUrl}
                onClick={onClose}
                className="flex items-center gap-2 bg-white text-black px-6 sm:px-8 py-2.5 sm:py-3 rounded-md font-bold text-sm sm:text-base hover:bg-white/90 transition shadow-lg hover:scale-105"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Play
              </Link>

              <button
                onClick={handleToggleFav}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition ${
                  isFav
                    ? "border-white bg-white/20 text-white"
                    : "border-gray-400 hover:border-white text-white hover:bg-white/10"
                }`}
                title={isFav ? "Remove from My List" : "Add to My List"}
              >
                {isFav ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                )}
              </button>

              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition ${
                  isLiked
                    ? "border-green-400 text-green-400 bg-green-400/10"
                    : "border-gray-400 hover:border-white text-white hover:bg-white/10"
                }`}
                title="Like"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-10 space-y-8">
          {/* Metadata & Synopsis Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="text-green-400 font-bold">{matchPercentage}% Match</span>
                <span className="text-gray-300">{anime.year}</span>
                <span className="border border-gray-500 px-1.5 py-0.5 text-xs text-gray-300 font-semibold rounded-sm">
                  16+
                </span>
                <span className="text-gray-300">{totalEpisodes} Episodes</span>
                <span className="border border-gray-600 px-1 py-0.5 text-[10px] text-gray-400 font-mono rounded-sm">
                  HD
                </span>
              </div>

              <p className="text-gray-300 text-sm sm:text-base font-light leading-relaxed">
                {anime.synopsis}
              </p>
            </div>

            {/* Sidebar Details */}
            <div className="md:col-span-4 space-y-3 text-xs sm:text-sm">
              <div>
                <span className="text-gray-500">Studios: </span>
                <span className="text-gray-300">
                  {anime.studios.map((s) => s.name).join(", ") || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Genres: </span>
                <span className="text-gray-300">
                  {anime.genres.map((g) => g.name).join(", ") || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Status: </span>
                <span className="text-gray-300">{anime.status}</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs (Episodes vs More Like This) */}
          <div className="border-t border-gray-800 pt-6">
            <div className="flex items-center justify-between border-b border-gray-800 mb-6">
              <div className="flex gap-8">
                <button
                  onClick={() => setActiveTab("episodes")}
                  className={`pb-3 text-lg font-bold transition border-b-2 ${
                    activeTab === "episodes"
                      ? "border-red-600 text-white"
                      : "border-transparent text-gray-400 hover:text-white"
                  }`}
                >
                  Episodes
                </button>
                <button
                  onClick={() => setActiveTab("more")}
                  className={`pb-3 text-lg font-bold transition border-b-2 ${
                    activeTab === "more"
                      ? "border-red-600 text-white"
                      : "border-transparent text-gray-400 hover:text-white"
                  }`}
                >
                  More Like This
                </button>
              </div>
            </div>

            {/* Tab 1: Episodes */}
            {activeTab === "episodes" && (
              <div className="space-y-4">
                {episodeList.map((ep) => (
                  <Link
                    key={ep.number}
                    href={`/watch/${fullSlug}?ep=${ep.number}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-4 rounded-lg bg-[#222222] hover:bg-[#2e2e2e] transition group"
                  >
                    <span className="text-xl font-bold text-gray-500 group-hover:text-white w-6">
                      {ep.number}
                    </span>

                    <div className="relative w-28 sm:w-36 aspect-video rounded overflow-hidden flex-shrink-0 bg-black">
                      <Image
                        src={anime.images.webp.image_url}
                        alt={ep.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition">
                        <div className="w-8 h-8 rounded-full bg-white/30 flex items-center justify-center">
                          <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-sm text-white group-hover:text-red-500 transition">
                          {ep.title}
                        </h4>
                        <span className="text-xs text-gray-400 font-light">{ep.duration}</span>
                      </div>
                      <p className="text-xs text-gray-400 font-light line-clamp-2 leading-relaxed">
                        {ep.synopsis}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Tab 2: More Like This */}
            {activeTab === "more" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {recommendations.map((item) => (
                  <Link
                    key={item.mal_id}
                    href={`/anime/${item.mal_id}`}
                    onClick={onClose}
                    className="bg-[#222222] rounded-md overflow-hidden hover:bg-[#2b2b2b] transition group"
                  >
                    <div className="relative aspect-video w-full bg-black">
                      <Image
                        src={item.images.webp.large_image_url || item.images.webp.image_url}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-green-400 font-bold text-xs">
                          {item.score ? `${(item.score * 10).toFixed(0)}% Match` : "95% Match"}
                        </span>
                        <span className="border border-gray-600 px-1 py-0.5 text-[9px] text-gray-400 rounded-sm">
                          16+
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-white line-clamp-1 group-hover:text-red-500 transition">
                        {item.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
