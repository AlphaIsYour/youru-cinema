// app/lib/videoProviders.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface VideoSource {
  url: string;
  quality: string;
  isM3U8: boolean;
}

export interface SubtitleTrack {
  url: string;
  lang: string;
  label: string;
}

export interface AnimeVideoData {
  sources: VideoSource[];
  subtitles: SubtitleTrack[];
  intro?: {
    start: number;
    end: number;
  };
  outro?: {
    start: number;
    end: number;
  };
  headers?: {
    Referer: string;
  };
}

const CONSUMET_API =
  process.env.NEXT_PUBLIC_CONSUMET_API || "http://localhost:3001";

export function createAnimeSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// Search menggunakan Anilist
export async function searchAnimeOnAnilist(
  title: string,
): Promise<number | null> {
  try {
    const searchUrl = `${CONSUMET_API}/meta/anilist/${encodeURIComponent(title)}`;
    console.log("Searching Anilist:", searchUrl);

    const response = await fetch(searchUrl);

    if (!response.ok) {
      console.error("Anilist search failed:", response.status);
      return null;
    }

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      console.log("Found Anilist ID:", data.results[0].id);
      return data.results[0].id;
    }
    return null;
  } catch (error) {
    console.error("Anilist search error:", error);
    return null;
  }
}

export async function getAnilistAnimeInfo(anilistId: number) {
  try {
    const infoUrl = `${CONSUMET_API}/meta/anilist/info/${anilistId}`;
    console.log("Fetching info:", infoUrl);

    const response = await fetch(infoUrl);

    if (!response.ok) {
      console.error("Anilist info fetch failed:", response.status);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Anilist info fetch error:", error);
    return null;
  }
}

export async function getAnilistEpisodeStreaming(
  anilistId: number,
  episodeNumber: number,
): Promise<AnimeVideoData | null> {
  try {
    const animeInfo = await getAnilistAnimeInfo(anilistId);

    if (!animeInfo || !animeInfo.episodes) {
      console.error("No episodes found");
      return null;
    }

    const episode = animeInfo.episodes.find(
      (ep: any) => ep.number === episodeNumber,
    );

    if (!episode) {
      console.error(`Episode ${episodeNumber} not found`);
      return null;
    }

    console.log("Episode ID:", episode.id);

    const streamUrl = `${CONSUMET_API}/meta/anilist/watch/${episode.id}`;
    console.log("Stream URL:", streamUrl);

    const streamResponse = await fetch(streamUrl);

    if (!streamResponse.ok) {
      console.error("Stream fetch failed:", streamResponse.status);
      return null;
    }

    const streamData = await streamResponse.json();

    if (!streamData.sources || streamData.sources.length === 0) {
      console.error("No video sources found");
      return null;
    }

    const videoData: AnimeVideoData = {
      sources: streamData.sources.map((source: any) => ({
        url: source.url,
        quality: source.quality || "default",
        isM3U8: source.isM3U8 !== false,
      })),
      subtitles: (streamData.subtitles || []).map((sub: any) => ({
        url: sub.url,
        lang: sub.lang,
        label: sub.lang === "English" ? "English" : sub.lang,
      })),
      headers: streamData.headers,
    };

    return videoData;
  } catch (error) {
    console.error("Streaming fetch error:", error);
    return null;
  }
}

const CACHE_DURATION = 1000 * 60 * 60;
const streamCache = new Map<
  string,
  { data: AnimeVideoData; timestamp: number }
>();

export async function getCachedStream(
  animeTitle: string,
  episode: number,
): Promise<AnimeVideoData | null> {
  const cacheKey = `anilist-${animeTitle}-${episode}`;

  const cached = streamCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log("Using cached stream");
    return cached.data;
  }

  const anilistId = await searchAnimeOnAnilist(animeTitle);

  if (!anilistId) {
    console.error("Could not find anime on Anilist");
    return null;
  }

  const streamData = await getAnilistEpisodeStreaming(anilistId, episode);

  if (streamData) {
    streamCache.set(cacheKey, {
      data: streamData,
      timestamp: Date.now(),
    });
  }

  return streamData;
}
