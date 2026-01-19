// app/components/AnimeCarousel.tsx
"use client";
import { Anime } from "@/app/lib/api";
import AnimeCard from "./AnimeCard";
import { useRef, useState } from "react";

type AnimeCarouselProps = {
  title: string;
  animeList: Anime[];
};

const AnimeCarousel = ({ title, animeList }: AnimeCarouselProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth - 100;
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
    <div className="group/carousel relative">
      <div className="px-16 mb-4">
        <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
      </div>

      <div className="relative">
        <button
          onClick={() => scroll("left")}
          className={`absolute left-0 top-0 bottom-6 w-16 z-40 flex items-center justify-center bg-gradient-to-r from-[#141414] via-[#141414]/95 to-transparent transition-opacity duration-300 ${
            showLeftArrow
              ? "opacity-0 group-hover/carousel:opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
          aria-label="Scroll left"
        >
          <div className="w-10 h-10 rounded-full bg-black/80 hover:bg-black flex items-center justify-center transition-all duration-200 hover:scale-110 border border-white/20">
            <svg
              className="w-5 h-5 text-white"
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
          className={`absolute right-0 top-0 bottom-6 w-16 z-40 flex items-center justify-center bg-gradient-to-l from-[#141414] via-[#141414]/95 to-transparent transition-opacity duration-300 ${
            showRightArrow
              ? "opacity-0 group-hover/carousel:opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
          aria-label="Scroll right"
        >
          <div className="w-10 h-10 rounded-full bg-black/80 hover:bg-black flex items-center justify-center transition-all duration-200 hover:scale-110 border border-white/20">
            <svg
              className="w-5 h-5 text-white"
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
          className="flex gap-2 overflow-x-scroll pb-8 px-16 scrollbar-hide scroll-smooth"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <div className="flex-shrink-0 w-44">
            <AnimeCard anime={animeList[0]} />
          </div>

          {animeList.slice(1).map((anime) => (
            <div key={anime.mal_id} className="flex-shrink-0 w-44">
              <AnimeCard anime={anime} />
            </div>
          ))}

          <div className="flex-shrink-0 w-8"></div>
        </div>

        <div className="absolute bottom-0 left-16 right-16 h-0.5 bg-gray-800/50">
          <div
            className="h-full bg-white/20 transition-all duration-300"
            style={{
              width: `${
                ((scrollContainerRef.current?.scrollLeft || 0) /
                  ((scrollContainerRef.current?.scrollWidth || 1) -
                    (scrollContainerRef.current?.clientWidth || 0))) *
                100
              }%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AnimeCarousel;
