// app/components/Top10Carousel.tsx
"use client";
import { Anime } from "@/app/lib/api";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

type Top10CarouselProps = {
  title?: string;
  animeList: Anime[];
};

const Top10Carousel = ({
  title = "Top 10 Anime Today",
  animeList,
}: Top10CarouselProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const top10List = animeList.slice(0, 10);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth - 120;
    const targetScroll =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;

    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < maxScroll - 10);
  };

  return (
    <div className="group/top10 relative my-6 sm:my-10">
      <div className="px-4 sm:px-8 md:px-12 lg:px-16 mb-3 sm:mb-5 flex items-center gap-2">
        <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight">
          {title}
        </h2>
        <span className="bg-red-600 text-white text-[10px] sm:text-xs font-black px-2 py-0.5 rounded tracking-wider uppercase">
          Top 10
        </span>
      </div>

      <div className="relative">
        <button
          onClick={() => scroll("left")}
          className={`absolute left-0 top-0 bottom-6 w-12 sm:w-16 z-40 flex items-center justify-center bg-gradient-to-r from-[#141414] via-[#141414]/90 to-transparent transition-opacity duration-300 ${
            showLeftArrow
              ? "opacity-0 group-hover/top10:opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
          aria-label="Scroll left"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/80 hover:bg-black flex items-center justify-center border border-white/20">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </div>
        </button>

        <button
          onClick={() => scroll("right")}
          className={`absolute right-0 top-0 bottom-6 w-12 sm:w-16 z-40 flex items-center justify-center bg-gradient-to-l from-[#141414] via-[#141414]/90 to-transparent transition-opacity duration-300 ${
            showRightArrow
              ? "opacity-0 group-hover/top10:opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
          aria-label="Scroll right"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/80 hover:bg-black flex items-center justify-center border border-white/20">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </button>

        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-4 sm:gap-6 overflow-x-scroll pb-6 sm:pb-8 px-4 sm:px-8 md:px-12 lg:px-16 scrollbar-hide scroll-smooth"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {top10List.map((anime, index) => {
            const rank = index + 1;

            return (

              <div
                key={anime.mal_id}
                className="flex-shrink-0 flex items-center relative group/item"
              >
                {/* Netflix Big Number Graphic (1-10) */}
                <div className="relative select-none text-[120px] sm:text-[180px] lg:text-[200px] font-black leading-none tracking-tighter text-transparent -mr-6 sm:-mr-10 z-0">
                  <span
                    className="stroke-number"
                    style={{
                      WebkitTextStroke: "4px #595959",
                      color: "#141414",
                    }}
                  >
                    {rank}
                  </span>
                </div>

                {/* Poster Card */}
                <Link
                  href={`/anime/${anime.mal_id}`}
                  className="relative w-28 sm:w-36 md:w-44 aspect-[2/3] rounded-md overflow-hidden z-10 shadow-2xl transition-transform duration-300 group-hover/item:scale-105"
                >
                  <Image
                    src={
                      anime.images.webp.large_image_url ||
                      anime.images.webp.image_url
                    }
                    alt={anime.title}
                    fill
                    sizes="(max-width: 640px) 120px, (max-width: 768px) 150px, 180px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                  {/* Top 10 Red Tag */}
                  <div className="absolute top-0 right-0 bg-red-600 text-white text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-bl-sm uppercase tracking-tighter shadow">
                    TOP 10
                  </div>

                  <div className="absolute bottom-2 left-2 right-2">
                    <h3 className="text-white text-xs sm:text-sm font-bold line-clamp-1 drop-shadow-md">
                      {anime.title}
                    </h3>
                  </div>
                </Link>
              </div>
            );
          })}

          <div className="flex-shrink-0 w-4 sm:w-8"></div>
        </div>
      </div>
    </div>
  );
};

export default Top10Carousel;
