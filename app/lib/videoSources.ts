// app/lib/videoSources.ts

export type VideoSource = {
  server: string;
  url: string;
  quality?: string;
};

export type EpisodeData = {
  animeId: string;
  episodeNumber: number;
  title: string;
  sources: VideoSource[];
  thumbnail?: string;
  duration?: string;
};

export const saveEpisodeData = (data: EpisodeData): void => {
  if (typeof window === "undefined") return;

  const key = `episode_${data.animeId}_${data.episodeNumber}`;
  localStorage.setItem(key, JSON.stringify(data));
};

export const getEpisodeData = (
  animeId: string,
  episodeNumber: number,
): EpisodeData | null => {
  if (typeof window === "undefined") return null;

  const key = `episode_${animeId}_${episodeNumber}`;
  const data = localStorage.getItem(key);

  if (!data) return null;

  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

export const saveAnimeEpisodes = (
  animeId: string,
  episodes: EpisodeData[],
): void => {
  if (typeof window === "undefined") return;

  const key = `anime_episodes_${animeId}`;
  localStorage.setItem(key, JSON.stringify(episodes));
};

export const getAnimeEpisodes = (animeId: string): EpisodeData[] => {
  if (typeof window === "undefined") return [];

  const key = `anime_episodes_${animeId}`;
  const data = localStorage.getItem(key);

  if (!data) return [];

  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const hasVideoSource = (
  animeId: string,
  episodeNumber: number,
): boolean => {
  const episodeData = getEpisodeData(animeId, episodeNumber);
  return episodeData !== null && episodeData.sources.length > 0;
};
