// app/components/AnimeCard.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import Image from "next/image";
import { Anime, AnimeDetail, createAnimeSlug, getAnimeById } from "@/app/lib/api";
import { useState, useRef, useEffect } from "react";
import { isFavorite, toggleFavorite } from "@/app/lib/favorites";
import DetailModal from "./DetailModal";

type AnimeCardProps = {
  anime: Anime;
};

const AnimeCard = ({ anime }: AnimeCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDetail, setModalDetail] = useState<AnimeDetail | null>(null);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  const animeSlug = createAnimeSlug(anime.title);
  const fullSlug = `${animeSlug}-${anime.mal_id}`;
  const watchUrl = `/watch/${fullSlug}?ep=1`;

  useEffect(() => {
    setIsFav(isFavorite(anime.mal_id));
  }, [anime.mal_id]);

  const handleMouseEnter = () => {
    hoverTimerRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 250);
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
    setIsHovered(false);
  };

  const handleOpenDetailModal = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHovered(false);

    if (modalDetail) {
      setIsModalOpen(true);
      return;
    }

    try {
      const fullDetail = await getAnimeById(anime.mal_id.toString());
      setModalDetail(fullDetail || (anime as any));
      setIsModalOpen(true);
    } catch {
      setModalDetail(anime as any);
      setIsModalOpen(true);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updatedFav = toggleFavorite({
      mal_id: anime.mal_id,
      title: anime.title,
      imageUrl: anime.images.webp.image_url,
      addedAt: Date.now(),
    });
    setIsFav(updatedFav);
  };

  const handleToggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const matchPercentage = anime.score
    ? Math.round((anime.score / 10) * 100)
    : 95;

  return (
    <>
      <div
        className="relative aspect-[2/3] w-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Base Card (Click opens Netflix Big Detail Modal) */}
        <div
          onClick={handleOpenDetailModal}
          className="block relative w-full h-full rounded-md overflow-hidden bg-[#181818] group cursor-pointer"
        >
          <Image
            src={anime.images.webp.large_image_url || anime.images.webp.image_url}
            alt={anime.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-2.5">
            <h3 className="text-white text-xs sm:text-sm font-bold line-clamp-2 leading-tight drop-shadow-sm">
              {anime.title}
            </h3>
          </div>
        </div>

        {/* Netflix Authentic Hover Popover Modal Card (Non-Mobile) */}
        {isHovered && (
          <div className="hidden sm:block absolute -top-4 -left-16 w-[180%] z-[100] bg-[#181818] rounded-lg overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.98)] border border-white/15 animate-in fade-in zoom-in-95 duration-200">
            {/* Header Video/Image Section */}
            <div className="relative h-56 w-full bg-black cursor-pointer" onClick={handleOpenDetailModal}>


              <Image
                src={anime.images.webp.large_image_url || anime.images.webp.image_url}
                alt={anime.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-black/30"></div>

              {/* Netflix Red N Badge & Title */}
              <div className="absolute bottom-3 left-3 right-12">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-red-600 font-black text-lg tracking-tighter leading-none">Y</span>

                  <span className="text-[10px] text-gray-300 uppercase tracking-widest font-semibold">Series</span>
                </div>
                <h3 className="text-white text-sm font-black line-clamp-1 leading-tight drop-shadow-lg">
                  {anime.title}
                </h3>
              </div>

              {/* Mute/Unmute Toggle */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsMuted(!isMuted);
                }}
                className="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-black/70 border border-white/30 text-white flex items-center justify-center hover:bg-black transition"
                aria-label="Toggle mute"
              >
                {isMuted ? (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Action Bar & Metadata Section */}
            <div className="p-4 space-y-3 bg-[#181818]">
              {/* Control Buttons */}
              <div className="flex items-center gap-2">
                {/* Play Button */}
                <Link
                  href={watchUrl}
                  className="w-9 h-9 rounded-full bg-white text-black hover:bg-gray-200 flex items-center justify-center transition-transform hover:scale-105 shadow"
                  title="Play Episode 1"
                >
                  <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </Link>

                {/* My List / Favorite (+ / ✓) */}
                <button
                  onClick={handleToggleFavorite}
                  className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
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

                {/* Like (Thumbs Up) */}
                <button
                  onClick={handleToggleLike}
                  className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
                    isLiked
                      ? "border-green-400 text-green-400 bg-green-400/10"
                      : "border-gray-400 hover:border-white text-white hover:bg-white/10"
                  }`}
                  title="I like this"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2" />
                  </svg>
                </button>

                {/* Chevron Down Details (Opens Big Detail Modal) */}
                <button
                  onClick={handleOpenDetailModal}
                  className="w-9 h-9 rounded-full border-2 border-gray-400 hover:border-white text-white flex items-center justify-center ml-auto hover:bg-white/10 transition"
                  title="More Episode Details"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Metadata Information Line */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-green-400 font-bold">{matchPercentage}% Match</span>
                <span className="border border-gray-500 px-1 py-0.5 text-[10px] text-gray-300 font-semibold rounded-sm">
                  16+
                </span>
                <span className="text-gray-300 font-light">
                  {anime.episodes ? `${anime.episodes} Eps` : "Ongoing"}
                </span>
                <span className="border border-gray-600 px-1 py-0.5 text-[9px] text-gray-400 font-mono rounded-sm">
                  HD
                </span>
              </div>

              {/* Tags Row */}
              <div className="text-xs text-gray-300 font-light flex items-center gap-1.5">
                <span>Popular</span>
                <span className="text-gray-600">•</span>
                <span>Anime</span>
                <span className="text-gray-600">•</span>
                <span>HD Series</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Netflix Big Detail Modal Window */}
      {isModalOpen && (
        <DetailModal
          anime={modalDetail}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default AnimeCard;
