// app/lib/watchHistory.ts

export type WatchHistoryItem = {
  animeId: string;
  animeTitle: string;
  episodeNumber: number;
  thumbnail: string;
  watchedAt: number;
  progress: number;
  duration: number;
};

export const saveWatchHistory = (item: WatchHistoryItem): void => {
  if (typeof window === "undefined") return;

  const history = getWatchHistory();
  const filtered = history.filter(
    (h) =>
      !(h.animeId === item.animeId && h.episodeNumber === item.episodeNumber),
  );

  filtered.unshift(item);

  const limited = filtered.slice(0, 50);

  localStorage.setItem("watch_history", JSON.stringify(limited));
};

export const getWatchHistory = (): WatchHistoryItem[] => {
  if (typeof window === "undefined") return [];

  const data = localStorage.getItem("watch_history");
  if (!data) return [];

  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const getContinueWatching = (): WatchHistoryItem[] => {
  const history = getWatchHistory();

  return history.filter((item) => {
    const percentage = (item.progress / item.duration) * 100;
    return percentage > 5 && percentage < 90;
  });
};

export const removeFromHistory = (
  animeId: string,
  episodeNumber: number,
): void => {
  if (typeof window === "undefined") return;

  const history = getWatchHistory();
  const filtered = history.filter(
    (h) => !(h.animeId === animeId && h.episodeNumber === episodeNumber),
  );

  localStorage.setItem("watch_history", JSON.stringify(filtered));
};

export const clearWatchHistory = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("watch_history");
};
