// app/components/AnimeCarousel.tsx
import { Anime } from "@/app/lib/api";
import AnimeCard from "./AnimeCard";

type AnimeCarouselProps = {
  title: string;
  animeList: Anime[];
};

const AnimeCarousel = ({ title, animeList }: AnimeCarouselProps) => {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-4 px-4 sm:px-6 lg:px-8">{title}</h2>
      <div className="relative">
        <div className="flex space-x-4 overflow-x-auto pb-4 px-4 sm:px-6 lg:px-8 scrollbar-hide">
          {animeList.map((anime) => (
            <div
              key={anime.mal_id}
              className="flex-shrink-0 w-40 sm:w-48 md:w-56"
            >
              <AnimeCard anime={anime} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimeCarousel;
