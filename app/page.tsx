/* eslint-disable @typescript-eslint/no-explicit-any */
// app/page.tsx
import { getTopAnime, getSeasonNowAnime } from "./lib/api";
import AnimeCarousel from "./components/AnimeCarousel";

// Komponen Hero Section (bagian atas yang besar)
const HeroSection = ({ anime }: { anime: any }) => {
  if (!anime) return null;
  return (
    <div className="relative h-[50vh] w-full mb-12">
      <img
        src={anime.images.webp.large_image_url}
        alt={anime.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
      <div className="absolute bottom-10 left-10 text-white">
        <h1 className="text-4xl font-bold">{anime.title}</h1>
        <p className="max-w-xl mt-2 line-clamp-3">{anime.synopsis}</p>
      </div>
    </div>
  );
};

export default async function HomePage() {
  // Ambil data untuk kedua carousel secara paralel untuk performa lebih baik
  const [topAnime, seasonNowAnime] = await Promise.all([
    getTopAnime(),
    getSeasonNowAnime(),
  ]);

  // Ambil satu anime acak dari yang populer untuk jadi Hero
  const heroAnime = topAnime.length > 0 ? topAnime[0] : null;

  return (
    // Kita hapus container di sini karena Hero dan Carousel sudah punya padding sendiri
    <div className="w-full">
      <HeroSection anime={heroAnime} />

      <div className="space-y-8">
        {topAnime.length > 0 && (
          <AnimeCarousel title="Paling Populer" animeList={topAnime} />
        )}

        {seasonNowAnime.length > 0 && (
          <AnimeCarousel title="Rilisan Musim Ini" animeList={seasonNowAnime} />
        )}

        {/* Kamu bisa tambahkan carousel lain di sini, misal "Upcoming Anime", dll. */}
      </div>
    </div>
  );
}
