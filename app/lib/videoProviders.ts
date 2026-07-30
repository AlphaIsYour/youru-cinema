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

const PUBLIC_CONSUMET_ENDPOINTS = [
  process.env.NEXT_PUBLIC_CONSUMET_API,
  "https://api.consumet.org",
  "https://consumet-api-clone.vercel.app",
].filter((url): url is string => typeof url === "string" && url.trim() !== "");


export function createAnimeSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

async function fetchWithTimeout(url: string, timeoutMs = 4000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

// Search menggunakan Anilist dengan multi-endpoint fallback
export async function searchAnimeOnAnilist(
  title: string,
): Promise<{ id: number; endpoint: string } | null> {
  for (const endpoint of PUBLIC_CONSUMET_ENDPOINTS) {
    try {
      const searchUrl = `${endpoint}/meta/anilist/${encodeURIComponent(title)}`;
      console.log("Searching Anilist on:", searchUrl);

      const response = await fetchWithTimeout(searchUrl, 3500);

      if (!response.ok) continue;

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        console.log("Found Anilist ID:", data.results[0].id, "via", endpoint);
        return { id: data.results[0].id, endpoint };
      }
    } catch {
      // Continue to next endpoint if failed
      continue;
    }
  }
  return null;
}

export async function getAnilistAnimeInfo(anilistId: number, endpoint: string) {
  try {
    const infoUrl = `${endpoint}/meta/anilist/info/${anilistId}`;
    const response = await fetchWithTimeout(infoUrl, 4000);

    if (!response.ok) return null;

    const data = await response.json();
    return data;
  } catch {
    return null;
  }
}

export async function getAnilistEpisodeStreaming(
  anilistId: number,
  episodeNumber: number,
  endpoint: string,
): Promise<AnimeVideoData | null> {
  try {
    const animeInfo = await getAnilistAnimeInfo(anilistId, endpoint);

    if (!animeInfo || !animeInfo.episodes) return null;

    const episode = animeInfo.episodes.find(
      (ep: any) => ep.number === episodeNumber,
    );

    if (!episode) return null;

    const streamUrl = `${endpoint}/meta/anilist/watch/${episode.id}`;
    const streamResponse = await fetchWithTimeout(streamUrl, 5000);

    if (!streamResponse.ok) return null;

    const streamData = await streamResponse.json();

    if (!streamData.sources || streamData.sources.length === 0) return null;

    const videoData: AnimeVideoData = {
      sources: streamData.sources.map((source: any) => ({
        url: source.url,
        quality: source.quality || "auto",
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
  } catch {
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
    return cached.data;
  }

  const anilistResult = await searchAnimeOnAnilist(animeTitle);

  if (anilistResult) {
    const streamData = await getAnilistEpisodeStreaming(
      anilistResult.id,
      episode,
      anilistResult.endpoint,
    );

    if (streamData) {
      streamCache.set(cacheKey, {
        data: streamData,
        timestamp: Date.now(),
      });
      return streamData;
    }
  }

  // Graceful fallback stream bila external API tidak dapat terhubung
  const fallbackData: AnimeVideoData = {
    sources: [
      {
        url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
        quality: "Auto / HD (Stream Fallback)",
        isM3U8: true,
      },
      {
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        quality: "1080p (Direct MP4)",
        isM3U8: false,
      },
    ],
    subtitles: [
      {
        url: "https://raw.githubusercontent.com/brenopolanski/html5-video-caption-completer/master/vtt/example.vtt",
        lang: "en",
        label: "English",
      },
    ],
  };

  return fallbackData;
}

