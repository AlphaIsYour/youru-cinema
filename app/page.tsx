// app/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getTopAnime, getSeasonNowAnime } from "./lib/api";
import AnimeCarousel from "./components/AnimeCarousel";
import ContinueWatching from "./components/ContinueWatching";
import Image from "next/image";
import Link from "next/link";

const HeroSection = ({ anime }: { anime: any }) => {
  if (!anime) return null;
  return (
    <div className="relative h-[75vh] w-full">
      <Image
        src={anime.images.webp.large_image_url}
        alt={anime.title}
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/80 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(20,20,20,0.3)_100%)]"></div>

      <div className="absolute bottom-0 left-0 right-0 px-16 pb-40">
        <div className="max-w-xl">
          <h1 className="text-5xl font-black text-white mb-6 leading-tight">
            {anime.title}
          </h1>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-green-400 font-bold text-base">
              {anime.score ? `${(anime.score * 10).toFixed(0)}% Match` : "N/A"}
            </span>
            <span className="text-gray-300 font-light text-sm">
              {anime.year}
            </span>
            <span className="border border-gray-500 px-2 py-0.5 text-xs text-gray-400 font-medium">
              {anime.rating?.split(" ")[0] || "TV"}
            </span>
          </div>
          <p className="text-white text-base font-light leading-relaxed line-clamp-3 mb-8 text-shadow">
            {anime.synopsis}
          </p>
          <div className="flex gap-4">
            <Link
              href={`/anime/${anime.mal_id}`}
              className="flex items-center gap-3 bg-white text-black px-8 py-3 rounded font-bold text-base hover:bg-white/90 transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Play
            </Link>
            <Link
              href={`/anime/${anime.mal_id}`}
              className="flex items-center gap-3 bg-gray-600/70 text-white px-8 py-3 rounded font-bold text-base hover:bg-gray-600/40 transition-all duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              More Info
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default async function HomePage() {
  const [topAnime, seasonNowAnime] = await Promise.all([
    getTopAnime(),
    getSeasonNowAnime(),
  ]);

  const heroAnime = topAnime.length > 0 ? topAnime[0] : null;

  return (
    <div className="w-full bg-[#141414]">
      <HeroSection anime={heroAnime} />

      <div className="relative -mt-40 z-10 space-y-14 pb-16">
        <ContinueWatching />

        {topAnime.length > 0 && (
          <AnimeCarousel title="Popular on Youru" animeList={topAnime} />
        )}

        {seasonNowAnime.length > 0 && (
          <AnimeCarousel title="New Releases" animeList={seasonNowAnime} />
        )}
      </div>
    </div>
  );
}
