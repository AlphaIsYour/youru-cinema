// app/watch/[id_episode]/page.tsx
import { getAnimeById } from "@/app/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import VideoPlayer from "@/app/components/VideoPlayer";

type WatchPageProps = {
  params: {
    id_episode: string;
  };
};

export default async function WatchPage({ params }: WatchPageProps) {
  // --- LOGIKA UTAMA ---
  // Kita pecah id_episode (contoh: '5114-ep-1') menjadi ID anime dan nomor episode
  const [animeId, , episodeNumberStr] = params.id_episode.split("-");
  const episodeNumber = parseInt(episodeNumberStr, 10);

  if (!animeId || isNaN(episodeNumber)) {
    notFound(); // Jika format ID salah, tampilkan 404
  }

  const anime = await getAnimeById(animeId);
  if (!anime) {
    notFound(); // Jika anime tidak ditemukan, tampilkan 404
  }

  // --- NAVIGASI EPISODE ---
  const totalEpisodes = anime.episodes || 0;
  const hasNextEpisode = episodeNumber < totalEpisodes;
  const hasPrevEpisode = episodeNumber > 1;

  const nextEpisodeId = hasNextEpisode
    ? `${animeId}-ep-${episodeNumber + 1}`
    : null;
  const prevEpisodeId = hasPrevEpisode
    ? `${animeId}-ep-${episodeNumber - 1}`
    : null;

  // --- SUMBER VIDEO (PENTING!) ---
  // Jikan API tidak menyediakan link video.
  // Untuk tujuan development, kita gunakan video placeholder.
  // Nantinya, kamu harus mengganti ini dengan sumber video aslimu.
  const videoUrl = "https://www.youtube.com/watch?v=LXb3EKWsInQ"; // Contoh: Big Buck Bunny

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <main className="flex-grow">
        {/* Komponen Video Player */}
        <VideoPlayer url={videoUrl} />

        {/* Info dan Kontrol Navigasi */}
        <div className="container mx-auto px-4 py-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold">{anime.title}</h1>
          <p className="text-lg text-gray-300 mb-4">Episode {episodeNumber}</p>

          <div className="flex justify-between items-center border-t border-b border-gray-700 py-3">
            {/* Tombol Episode Sebelumnya */}
            <div>
              {prevEpisodeId ? (
                <Link
                  href={`/watch/${prevEpisodeId}`}
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md transition-colors"
                >
                  ← Episode Sebelumnya
                </Link>
              ) : (
                <span className="bg-gray-800 text-gray-500 px-4 py-2 rounded-md cursor-not-allowed">
                  ← Episode Sebelumnya
                </span>
              )}
            </div>

            {/* Tombol Episode Selanjutnya */}
            <div>
              {nextEpisodeId ? (
                <Link
                  href={`/watch/${nextEpisodeId}`}
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md transition-colors"
                >
                  Episode Selanjutnya →
                </Link>
              ) : (
                <span className="bg-gray-800 text-gray-500 px-4 py-2 rounded-md cursor-not-allowed">
                  Episode Selanjutnya →
                </span>
              )}
            </div>
          </div>

          <div className="mt-6">
            <Link
              href={`/anime/${animeId}`}
              className="text-blue-400 hover:underline"
            >
              ← Kembali ke Detail Anime
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
