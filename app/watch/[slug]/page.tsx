// app/watch/[slug]/page.tsx
import { getAnimeById, createAnimeSlug } from "@/app/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import WatchPlayer from "@/app/components/WatchPlayer";

type WatchPageProps = {
  params: {
    slug: string;
  };
  searchParams: {
    ep?: string;
  };
};

export default async function WatchPage({
  params,
  searchParams,
}: WatchPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const episodeNumber = parseInt(resolvedSearchParams.ep || "1", 10);
  const slugParts = resolvedParams.slug.split("-");
  const animeId = slugParts[slugParts.length - 1];

  if (!animeId || isNaN(episodeNumber)) {
    notFound();
  }

  const anime = await getAnimeById(animeId);
  if (!anime) {
    notFound();
  }

  const animeSlug = createAnimeSlug(anime.title);
  const fullSlug = `${animeSlug}-${anime.mal_id}`;

  const totalEpisodes = anime.episodes || 0;
  const hasNextEpisode = episodeNumber < totalEpisodes;
  const hasPrevEpisode = episodeNumber > 1;

  const allEpisodes = Array.from({ length: totalEpisodes }, (_, i) => ({
    number: i + 1,
    isCurrent: i + 1 === episodeNumber,
  }));

  return (
    <div className="min-h-screen bg-[#141414]">
      <div className="w-full bg-black">
        <div className="max-w-[1920px] mx-auto">
          <WatchPlayer
            animeSlug={animeSlug}
            episodeNumber={episodeNumber}
            animeTitle={anime.title}
            thumbnail={anime.images.webp.image_url}
            hasTrailer={!!anime.trailer?.youtube_id && episodeNumber === 1}
            trailerUrl={
              anime.trailer?.youtube_id
                ? `https://www.youtube.com/watch?v=${anime.trailer.youtube_id}`
                : undefined
            }
          />
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-16 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <div className="mb-8">
              <Link
                href={`/anime/${animeId}`}
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 mb-6 group"
              >
                <svg
                  className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span className="text-sm font-light">Back to series</span>
              </Link>

              <h1 className="text-4xl font-black mb-2 text-white leading-tight">
                {anime.title}
              </h1>
              <p className="text-lg text-gray-400 font-light">
                Episode {episodeNumber}
                {totalEpisodes > 0 && (
                  <span className="text-gray-600"> of {totalEpisodes}</span>
                )}
              </p>
            </div>

            <div className="flex gap-4 mb-12">
              {hasPrevEpisode ? (
                <Link
                  href={`/watch/${fullSlug}?ep=${episodeNumber - 1}`}
                  className="flex items-center justify-center gap-2 bg-gray-800/80 hover:bg-gray-700 px-6 py-3 rounded transition-all duration-200 font-medium text-sm flex-1 sm:flex-none"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Previous
                </Link>
              ) : (
                <span className="flex items-center justify-center gap-2 bg-gray-900/50 text-gray-700 px-6 py-3 rounded cursor-not-allowed font-medium text-sm flex-1 sm:flex-none">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Previous
                </span>
              )}

              {hasNextEpisode ? (
                <Link
                  href={`/watch/${fullSlug}?ep=${episodeNumber + 1}`}
                  className="flex items-center justify-center gap-2 bg-white text-black hover:bg-white/90 px-6 py-3 rounded transition-all duration-200 font-bold text-sm flex-1 sm:flex-none"
                >
                  Next Episode
                  <svg
                    className="w-4 h-4"
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
                </Link>
              ) : (
                <span className="flex items-center justify-center gap-2 bg-gray-900/50 text-gray-700 px-6 py-3 rounded cursor-not-allowed font-medium text-sm flex-1 sm:flex-none">
                  Next Episode
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              )}
            </div>

            {anime.synopsis && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-white">About</h2>
                <p className="text-gray-400 leading-relaxed font-light text-base">
                  {anime.synopsis}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-2 font-medium">
                  Studio
                </p>
                <p className="font-light text-gray-300 text-sm">
                  {anime.studios.map((s) => s.name).join(", ") || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-2 font-medium">
                  Year
                </p>
                <p className="font-light text-gray-300 text-sm">
                  {anime.year || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-2 font-medium">
                  Rating
                </p>
                <p className="font-light text-gray-300 text-sm">
                  {anime.rating || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-2 font-medium">
                  Score
                </p>
                <p className="font-light text-gray-300 text-sm">
                  {anime.score ? `★ ${anime.score.toFixed(1)}` : "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <h2 className="text-xl font-bold mb-4 text-white">
                All Episodes
              </h2>
              <div className="bg-[#1a1a1a] rounded-sm overflow-hidden border border-gray-800">
                <div className="max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                  {allEpisodes.map((episode) => (
                    <Link
                      href={`/watch/${fullSlug}?ep=${episode.number}`}
                      key={episode.number}
                      className={`flex items-center justify-between px-5 py-4 border-b border-gray-800 transition-all duration-200 group ${
                        episode.isCurrent
                          ? "bg-gray-800 border-l-4 border-l-white"
                          : "hover:bg-gray-800/50"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span
                          className={`text-xl font-black w-8 transition-colors duration-200 ${
                            episode.isCurrent
                              ? "text-white"
                              : "text-gray-600 group-hover:text-white"
                          }`}
                        >
                          {episode.number}
                        </span>
                        <div>
                          <span
                            className={`font-medium text-sm transition-colors duration-200 ${
                              episode.isCurrent
                                ? "text-white"
                                : "text-gray-400 group-hover:text-white"
                            }`}
                          >
                            Episode {episode.number}
                          </span>
                        </div>
                      </div>
                      {!episode.isCurrent && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-800/50 group-hover:bg-white/10 flex items-center justify-center transition-all duration-200">
                          <svg
                            className="w-3 h-3 text-gray-500 group-hover:text-white transition-colors duration-200"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      )}
                      {episode.isCurrent && (
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                        </div>
                      )}
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
