// app/components/AnimeCard.tsx
import Link from "next/link";
import Image from "next/image";
import { Anime } from "@/app/lib/api"; // Import tipe data Anime

type AnimeCardProps = {
  anime: Anime;
};

const AnimeCard = ({ anime }: AnimeCardProps) => {
  return (
    <Link
      href={`/anime/${anime.mal_id}`}
      className="group block relative aspect-[2/3] overflow-hidden rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105"
    >
      {/* Gambar Anime */}
      <Image
        src={anime.images.webp.image_url}
        alt={anime.title}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
        className="object-cover transition-transform duration-300 group-hover:scale-110"
      />

      {/* Overlay Gelap di Bawah */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

      {/* Judul Anime */}
      <div className="absolute bottom-0 left-0 p-4">
        <h3 className="text-white text-lg font-bold line-clamp-2">
          {anime.title}
        </h3>
      </div>

      {/* (Opsional) Skor di Pojok Kanan Atas */}
      <div className="absolute top-2 right-2 bg-yellow-400 text-black text-sm font-bold px-2 py-1 rounded-md">
        ⭐ {anime.score.toFixed(1)}
      </div>
    </Link>
  );
};

export default AnimeCard;
