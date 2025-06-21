// app/anime/[id]/page.tsx
import { getAnimeById } from "@/app/lib/api"; // Path alias @/app/... berfungsi jika pakai src atau tidak
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// Ini adalah tipe untuk props halaman, yang berisi `params`
type AnimeDetailPageProps = {
  params: {
    id: string;
  };
};

export default async function AnimeDetailPage({
  params,
}: AnimeDetailPageProps) {
  const anime = await getAnimeById(params.id);

  // Jika anime tidak ditemukan, tampilkan halaman 404
  if (!anime) {
    notFound();
  }

  // DATA DUMMY UNTUK EPISODE (karena Jikan tidak menyediakan link video)
  const episodes = Array.from({ length: anime.episodes || 24 }, (_, i) => ({
    id: `${anime.mal_id}-ep-${i + 1}`,
    title: `Episode ${i + 1}`,
  }));

  return (
    <div className="text-white">
      {/* Bagian Banner */}
      <div className="relative w-full h-[30vh] md:h-[40vh]">
        <Image
          src={anime.images.webp.image_url}
          alt={anime.title}
          fill
          className="object-cover object-top"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4 md:p-8">
          <h1 className="text-3xl md:text-5xl font-bold">{anime.title}</h1>
        </div>
      </div>

      {/* Konten Utama */}
      <div className="container mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Kolom Kiri: Sinopsis dan Info */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">Synopsis</h2>
            <p className="text-gray-300 leading-relaxed mb-8">
              {anime.synopsis || "No synopsis available."}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {anime.genres.map((genre) => (
                <span
                  key={genre.mal_id}
                  className="bg-gray-700 text-xs font-semibold px-2 py-1 rounded-full"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <div className="text-sm text-gray-400">
              <p>
                <strong>Score:</strong> ⭐ {anime.score.toFixed(2)}
              </p>
              <p>
                <strong>Year:</strong> {anime.year}
              </p>
              <p>
                <strong>Studio:</strong>{" "}
                {anime.studios.map((s) => s.name).join(", ")}
              </p>
            </div>
          </div>

          {/* Kolom Kanan: Daftar Episode */}
          <div className="md:col-span-1">
            <h2 className="text-2xl font-semibold mb-4">Episodes</h2>
            <div className="bg-gray-800 rounded-lg max-h-96 overflow-y-auto">
              {episodes.map((episode) => (
                <Link
                  href={`/watch/${episode.id}`}
                  key={episode.id}
                  className="block p-4 border-b border-gray-700 hover:bg-gray-700 transition-colors duration-200"
                >
                  {episode.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
