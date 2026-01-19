// app/lib/favorites.ts

export type FavoriteAnime = {
  mal_id: number;
  title: string;
  imageUrl: string;
  addedAt: number;
};

export const addToFavorites = (anime: FavoriteAnime): void => {
  if (typeof window === "undefined") return;

  const favorites = getFavorites();

  const exists = favorites.some((f) => f.mal_id === anime.mal_id);
  if (exists) return;

  favorites.unshift(anime);
  localStorage.setItem("favorites", JSON.stringify(favorites));
};

export const removeFromFavorites = (malId: number): void => {
  if (typeof window === "undefined") return;

  const favorites = getFavorites();
  const filtered = favorites.filter((f) => f.mal_id !== malId);

  localStorage.setItem("favorites", JSON.stringify(filtered));
};

export const getFavorites = (): FavoriteAnime[] => {
  if (typeof window === "undefined") return [];

  const data = localStorage.getItem("favorites");
  if (!data) return [];

  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const isFavorite = (malId: number): boolean => {
  const favorites = getFavorites();
  return favorites.some((f) => f.mal_id === malId);
};

export const toggleFavorite = (anime: FavoriteAnime): boolean => {
  if (isFavorite(anime.mal_id)) {
    removeFromFavorites(anime.mal_id);
    return false;
  } else {
    addToFavorites(anime);
    return true;
  }
};
