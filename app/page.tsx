// app/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getTopAnime, getSeasonNowAnime } from "./lib/api";
import AnimeCarousel from "./components/AnimeCarousel";
import Top10Carousel from "./components/Top10Carousel";
import ContinueWatching from "./components/ContinueWatching";
import Image from "next/image";
import Link from "next/link";

const HeroSection = ({ anime }: { anime: any }) => {
  if (!anime) return null;
  const animeSlug = anime.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
  const fullSlug = `${animeSlug}-${anime.mal_id}`;

  return (
    <div className="relative h-[70vh] sm:h-[80vh] lg:h-[90vh] w-full max-w-[2560px] mx-auto overflow-hidden">
      <Image
        src={anime.images.webp.large_image_url || anime.images.webp.image_url}
        alt={anime.title}
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/70 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent"></div>

      {/* Netflix Maturity Rating Tag */}
      <div className="absolute right-0 bottom-36 sm:bottom-44 flex items-center gap-2 bg-black/60 backdrop-blur-sm border-l-4 border-red-600 px-4 py-1.5 text-xs text-white font-medium z-20">
        <span>16+</span>
        <span className="text-gray-400">|</span>
        <span className="text-gray-300 font-light hidden sm:inline">Violence, Language</span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 md:px-12 lg:px-16 pb-20 sm:pb-28 lg:pb-36 z-10">
        <div className="max-w-xl lg:max-w-2xl">
          {/* YourU Red Y Badge */}
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <span className="text-red-600 font-black text-2xl tracking-tighter">Y</span>
            <span className="text-xs text-gray-300 uppercase tracking-widest font-bold">Film / Anime</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white mb-3 sm:mb-6 leading-tight tracking-tight drop-shadow-lg">
            {anime.title}
          </h1>

          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
            <span className="text-green-400 font-bold text-xs sm:text-base">
              {anime.score ? `${(anime.score * 10).toFixed(0)}% Match` : "98% Match"}
            </span>
            <span className="text-gray-300 font-light text-xs sm:text-sm">
              {anime.year || "2024"}
            </span>
            <span className="border border-gray-500 px-2 py-0.5 text-[10px] sm:text-xs text-gray-300 font-semibold rounded-sm">
              16+
            </span>
            <span className="border border-gray-600 px-1.5 py-0.5 text-[9px] sm:text-xs text-gray-400 font-mono rounded-sm">
              HD
            </span>
          </div>

          <p className="text-gray-200 text-xs sm:text-sm lg:text-base font-light leading-relaxed line-clamp-2 sm:line-clamp-3 mb-6 sm:mb-8 text-shadow">
            {anime.synopsis}
          </p>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href={`/watch/${fullSlug}?ep=1`}
              className="flex items-center gap-2 sm:gap-3 bg-white text-black px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-md font-bold text-sm sm:text-base hover:bg-white/90 transition-all duration-200 shadow-xl hover:scale-105"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Play
            </Link>

            <Link
              href={`/anime/${anime.mal_id}`}
              className="flex items-center gap-2 sm:gap-3 bg-gray-500/50 backdrop-blur-md text-white px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-md font-bold text-sm sm:text-base hover:bg-gray-500/30 transition-all duration-200 hover:scale-105"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
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

  // Combine & partition catalog into 8 distinct thematic rows
  const combined = Array.from(
    new Map([...topAnime, ...seasonNowAnime].map((a) => [a.mal_id, a])).values(),
  );

  const actionAnime = combined.slice(0, 12);
  const thrillerAnime = combined.slice(4, 16);
  const fantasyAnime = combined.slice(8, 20);
  const classicsAnime = [...combined].reverse().slice(0, 14);
  const masterpiecesAnime = [...combined].sort((a, b) => b.score - a.score).slice(0, 14);

  return (
    <div className="w-full bg-[#141414] overflow-x-hidden">
      <HeroSection anime={heroAnime} />

      <div className="relative -mt-16 sm:-mt-24 lg:-mt-36 z-10 space-y-6 sm:space-y-10 pb-16 max-w-[2560px] mx-auto">
        <ContinueWatching />

        {/* Row 1: Top 10 Outline Numbers */}
        {topAnime.length > 0 && (
          <Top10Carousel title="Top 10 Anime Today in YourU" animeList={topAnime} />
        )}

        {/* Row 2: Popular on YourU */}
        {topAnime.length > 0 && (
          <AnimeCarousel title="Popular on YourU" animeList={topAnime} />
        )}

        {/* Row 3: New Releases */}
        {seasonNowAnime.length > 0 && (
          <AnimeCarousel title="New & Trending Releases" animeList={seasonNowAnime} />
        )}

        {/* Row 4: High Octane Action */}
        {actionAnime.length > 0 && (
          <AnimeCarousel title="High Octane Action & Battles" animeList={actionAnime} />
        )}

        {/* Row 5: Mind Bending & Thrillers */}
        {thrillerAnime.length > 0 && (
          <AnimeCarousel title="Mind-Bending & Thrillers" animeList={thrillerAnime} />
        )}

        {/* Row 6: Fantasy & Magic Worlds */}
        {fantasyAnime.length > 0 && (
          <AnimeCarousel title="Fantasy & Magic Worlds" animeList={fantasyAnime} />
        )}

        {/* Row 7: Fan Favorite Classics */}
        {classicsAnime.length > 0 && (
          <AnimeCarousel title="Fan Favorite Classics" animeList={classicsAnime} />
        )}

        {/* Row 8: Award Winning Masterpieces */}
        {masterpiecesAnime.length > 0 && (
          <AnimeCarousel title="Award-Winning Masterpieces" animeList={masterpiecesAnime} />
        )}

      </div>
    </div>
  );
}
