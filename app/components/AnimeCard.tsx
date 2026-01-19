// app/components/AnimeCard.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { Anime } from "@/app/lib/api";
import { useState } from "react";

type AnimeCardProps = {
  anime: Anime;
};

const AnimeCard = ({ anime }: AnimeCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={`/anime/${anime.mal_id}`}
      className="group block relative aspect-[2/3] overflow-visible rounded-sm"
      onMouseEnter={() => setTimeout(() => setIsHovered(true), 150)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`relative w-full h-full rounded-sm overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isHovered
            ? "scale-100 z-50 shadow-[0_12px_32px_rgba(0,0,0,0.6)]"
            : "scale-100 shadow-none"
        }`}
      >
        <Image
          src={anime.images.webp.image_url}
          alt={anime.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

        <div className="absolute bottom-0 left-0 right-0 p-2">
          <h3 className="text-white text-xs font-semibold line-clamp-2 leading-tight">
            {anime.title}
          </h3>
        </div>

        {anime.score && (
          <div
            className={`absolute top-1.5 right-1.5 bg-yellow-400 text-black text-xs font-bold px-1.5 py-0.5 rounded transition-opacity duration-200 ${
              isHovered ? "opacity-100 delay-100" : "opacity-0"
            }`}
          >
            ★ {anime.score.toFixed(1)}
          </div>
        )}

        <div
          className={`absolute bottom-8 left-0 right-0 px-2 transition-opacity duration-200 mb-2 ${
            isHovered ? "opacity-100 delay-150" : "opacity-0"
          }`}
        >
          <div className="flex items-center gap-1.5 text-xs text-gray-300">
            {anime.year && <span className="font-light">{anime.year}</span>}
            {anime.episodes && (
              <>
                <span>•</span>
                <span className="font-light">{anime.episodes} eps</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AnimeCard;
