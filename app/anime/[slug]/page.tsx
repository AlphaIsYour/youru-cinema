// app/anime/[slug]/page.tsx
import { getAnimeById, createAnimeSlug } from "@/app/lib/api";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import FavoriteButton from "@/app/components/FavoriteButton";

type AnimeDetailPageProps = {
  params: {
    slug: string;
  };
};

export default async function AnimeDetailPage({
  params,
}: AnimeDetailPageProps) {
  const resolvedParams = await params;

  const slugParts = resolvedParams.slug.split("-");
  const animeId = slugParts[slugParts.length - 1];

  const anime = await getAnimeById(animeId);

  if (!anime) {
    notFound();
  }

  const animeSlug = createAnimeSlug(anime.title);
  const fullSlug = `${animeSlug}-${anime.mal_id}`;

  return (
    <div className="text-white bg-[#141414] min-h-screen">
      <div className="relative w-full h-[80vh]">
        <Image
          src={anime.images.webp.large_image_url}
          alt={anime.title}
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/90 to-[#141414]/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(20,20,20,0.4)_100%)]"></div>

        <div className="absolute bottom-0 left-0 right-0 px-16 pb-24">
          <div className="max-w-3xl">
            <h1 className="text-6xl font-black mb-6 leading-tight tracking-tight">
              {anime.title}
            </h1>

            <div className="flex items-center gap-4 mb-8">
              {anime.score && (
                <span className="text-green-400 font-bold text-lg">
                  ★ {anime.score.toFixed(1)}
                </span>
              )}
              <span className="text-gray-300 font-light text-sm">
                {anime.year}
              </span>
              <span className="border border-gray-500 px-2 py-0.5 text-xs text-gray-400 font-medium">
                {anime.type}
              </span>
              <span className="text-gray-300 font-light text-sm">
                {anime.episodes} Episodes
              </span>
            </div>

            <div className="flex gap-4 mb-8">
              <Link
                href={`/watch/${fullSlug}?ep=1`}
                className="inline-flex items-center gap-3 bg-white text-black px-8 py-3 rounded font-bold text-base hover:bg-white/90 transition-all duration-200"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                Play
              </Link>
              <FavoriteButton
                anime={{
                  mal_id: anime.mal_id,
                  title: anime.title,
                  imageUrl: anime.images.webp.image_url,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="px-16 py-16 -mt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-12">
            <div>
              <h2 className="text-2xl font-bold mb-6 text-white">About</h2>
              <p className="text-gray-400 text-base leading-relaxed font-light">
                {anime.synopsis || "No synopsis available."}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4 text-white">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {anime.genres.map((genre) => (
                  <span
                    key={genre.mal_id}
                    className="bg-gray-800/80 hover:bg-gray-700 text-sm font-medium px-4 py-2 rounded-sm transition-colors duration-200 text-gray-300"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-2 font-medium">
                  Studio
                </p>
                <p className="font-light text-gray-300">
                  {anime.studios.map((s) => s.name).join(", ") || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-2 font-medium">
                  Status
                </p>
                <p className="font-light text-gray-300">{anime.status}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-2 font-medium">
                  Aired
                </p>
                <p className="font-light text-gray-300">
                  {anime.aired?.string || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-2 font-medium">
                  Rating
                </p>
                <p className="font-light text-gray-300">
                  {anime.rating || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <h2 className="text-2xl font-bold mb-6 text-white">Episodes</h2>
              <div className="bg-[#1a1a1a] rounded-sm overflow-hidden border border-gray-800">
                <div className="max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                  {Array.from({ length: anime.episodes || 24 }, (_, i) => (
                    <Link
                      href={`/watch/${fullSlug}?ep=${i + 1}`}
                      key={i}
                      className="flex items-center justify-between px-6 py-4 border-b border-gray-800 hover:bg-gray-800/50 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-black text-gray-600 group-hover:text-white transition-colors duration-200 w-8">
                          {i + 1}
                        </span>
                        <div>
                          <span className="font-medium text-sm text-gray-300 group-hover:text-white transition-colors duration-200">
                            Episode {i + 1}
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-800/50 group-hover:bg-white/10 flex items-center justify-center transition-all duration-200">
                        <svg
                          className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors duration-200"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
